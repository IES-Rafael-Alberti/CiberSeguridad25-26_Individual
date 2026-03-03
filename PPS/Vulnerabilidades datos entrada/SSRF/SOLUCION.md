# Solución: Server-Side Request Forgery (SSRF)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con un script vulnerable a SSRF, usado para realizar peticiones HTTP desde el servidor a URLs arbitrarias. He comprobado que un atacante podría usarlo para explorar la red interna o acceder a metadatos de servicios en la nube (e.g. AWS).

## 2. Código Vulnerable (Original)
El código original aceptaba cualquier URL y devolvía su contenido sin restricciones:

```php
$url = $_GET['url'];
$response = file_get_contents($url);
echo $response;
```

Esto permitía acceder a `http://localhost/admin`, `http://192.168.1.1` (router), o incluso servicios locales.

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he implementado una estricta validación de la URL y verificación de IPs de destino.

1.  **Validación de Formato URL:** Verifico que la entrada tenga el formato de una URL válida (`filter_var`, `parse_url`).
2.  **Lista Blanca de Esquemas:** Solo permito protocolos `http` y `https` (nada de `file://`, `ftp://`, etc.).
3.  **Resolución y Validación de IP:** Resuelvo el nombre de dominio a una dirección IP con `gethostbyname()`.
4.  **Bloqueo de IPs Privadas/Reservadas:** Verifico que la IP no pertenezca a rangos privados (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`) ni reservados (`127.0.0.0/8`, `169.254.0.0/16`) usando `FILTER_FLAG_NO_PRIV_RANGE` y `FILTER_FLAG_NO_RES_RANGE`.

```php
function is_safe_url($url) {
    if (!filter_var($url, FILTER_VALIDATE_URL)) return false;
    $parsed = parse_url($url);
    if (!isset($parsed['scheme']) || !in_array($parsed['scheme'], ['http', 'https'])) return false;
    
    $host = $parsed['host'];
    $ip = gethostbyname($host);
    
    if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        return false;
    }
    return true;
}
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He intentado acceder a `ssrf.php?url=http://google.com` y comprobé que funciona correctamente.
2.  He intentado acceder a `ssrf.php?url=http://localhost`, `ssrf.php?url=http://127.0.0.1` y `ssrf.php?url=http://192.168.1.1`.
3.  He verificado que el sistema bloquea la petición con el mensaje: "Error: URL no válida o acceso a red interna bloqueado (SSRF Protection).".
