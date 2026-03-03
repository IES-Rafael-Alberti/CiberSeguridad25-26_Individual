# Solución: Cross-Site Request Forgery (CSRF)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con un formulario de transferencia de fondos vulnerable a CSRF. He observado que el sistema no verificaba si la solicitud `POST` provenía intencionadamente del usuario autenticado o si fue forzada por un sitio externo malicioso.

## 2. Código Vulnerable (Original)
El código original aceptaba cualquier petición `POST` al archivo `transfer.php` y procesaba la transferencia ciegamente:

```php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $amount = $_POST["amount"];
    echo "Transferidos $$amount";
}
```

Un atacante podía crear un formulario oculto en otro sitio web que enviara una petición a este archivo, y si el usuario tenía la sesión abierta, la transferencia se ejecutaba.

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he implementado un mecanismo de **Token Anti-CSRF (Synchronizer Token Pattern)**.

1.  **Generación del Token:** Al iniciar la sesión, genero un token aleatorio criptográficamente seguro y lo guardo en `$_SESSION['csrf_token']`.
2.  **Inclusión en el Formulario:** Añado el token como un campo oculto (`<input type="hidden">`) en el formulario HTML.
3.  **Verificación:** Al procesar el formulario, compruebo en el servidor que el token recibido coincida exactamente con el guardado en la sesión.

```php
session_start();
// Generar token
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

// Verificar token
if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
    die("Error: Token CSRF inválido.");
}
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He abierto `transfer.php` para generar un token único.
2.  He enviado el formulario legítimo y comprobado que la transferencia funciona.
3.  He intentado enviar una petición POST desde una herramienta externa (como Postman o el archivo `csrf_attack.html` original) sin incluir el token o con un token incorrecto.
4.  He comprobado que el sistema rechaza la petición con el mensaje "Error: Token CSRF inválido".
