# Solución: Unsafe Deserialization

## 1. Explicación de la Actividad
En esta actividad, he trabajado con una página vulnerable a ejecución de código arbitrario o modificación de objetos mediante deserialización insegura. El sistema aceptaba objetos serializados por el usuario y los deserializaba ciegamente con `unserialize()`.

## 2. Código Vulnerable (Original)
El código original aceptaba una cadena serializada (e.g., `O:4:"User":2:{s:8:"username";s:5:"admin";...}`) y la reconstruía como un objeto PHP en memoria, lo que permitía manipular propiedades privadas o invocar métodos mágicos (`__wakeup`, `__destruct`):

```php
$data = unserialize($_GET['data']);
if ($data->isAdmin) {
    echo "¡Acceso de administrador concedido!";
}
```

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he eliminado el uso de `serialize/unserialize` y he adoptado el estándar **JSON** para el intercambio de datos.

1.  **Formatos Seguros:** He sustituido `serialize()` por `json_encode()` y `unserialize()` por `json_decode()`. JSON es solo un formato de datos y no permite la instanciación automática de clases arbitrarias ni la ejecución de código (métodos mágicos).
2.  **Validación de Estructura:** He validado que el JSON recibido tenga la estructura esperada antes de usarlo.

**En `deserialize.php` (receptor):**
```php
$json_data = isset($_GET['data']) ? $_GET['data'] : '';
$data = json_decode($json_data);

if (json_last_error() === JSON_ERROR_NONE && is_object($data)) {
    if (isset($data->isAdmin) && $data->isAdmin === true) {
        echo "¡Acceso de administrador concedido (vía JSON)!";
    }
}
```

**En `serialize_attack.php` (generador):**
```php
$user = new stdClass();
$user->username = "user";
$user->isAdmin = false;
echo urlencode(json_encode($user));
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He usado `serialize_attack.php` para generar un payload JSON válido (por ejemplo: `{"username":"user","isAdmin":false}`).
2.  He enviado este JSON a `deserialize.php?data=...`.
3.  He intentado enviar un objeto PHP serializado al estilo antiguo (`O:4:"User"...`).
4.  He verificado que `json_decode` falla o retorna `null`, evitando la vulnerabilidad.
