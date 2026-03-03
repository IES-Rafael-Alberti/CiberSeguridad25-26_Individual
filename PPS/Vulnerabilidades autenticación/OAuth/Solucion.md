# Solución: OAuth Inseguro (CSRF / State)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con una implementación de inicio de sesión OAuth (`github_login.php` y `oauth_callback.php`). He detectado que la implementación era vulnerable a ataques CSRF (Cross-Site Request Forgery) debido al uso incorrecto del parámetro `state`. El valor de `state` era estático ("pepe") y no se validaba al recibir la respuesta de GitHub. Esto permitiría a un atacante engañar a una víctima para que vincule su cuenta en el servicio con la cuenta de GitHub del atacante.

## 2. Código Vulnerable (Original)
El código original enviaba un estado fijo y no realizaba ninguna comprobación de seguridad al recibir el código de autorización:

**github_login.php:**
```php
"state" => "pepe", // Valor estático y predecible
```

**oauth_callback.php:**
```php
// No existía validación de $_GET['state'] vs sesión del usuario
if (isset($_GET['code'])) { ... }
```

## 3. Corrección Aplicada
Para corregir esta vulnerabilidad, he implementado una validación robusta del parámetro `state`.

*   **Generación de Token Aleatorio:** En `github_login.php`, genero un token criptográficamente seguro y lo almaceno en la sesión del usuario antes de redirigirlo a GitHub.
*   **Validación Estricta:** En `oauth_callback.php`, verifico que el parámetro `state` devuelto por GitHub coincida exactamente con el valor almacenado en la sesión del usuario.

**github_login.php (Corrección):**
```php
session_start();
if (empty($_SESSION['oauth_state'])) {
    $_SESSION['oauth_state'] = bin2hex(random_bytes(16));
}
// ... "state" => $_SESSION['oauth_state'] ...
```

**oauth_callback.php (Corrección):**
```php
session_start();
if ($_GET['state'] !== $_SESSION['oauth_state']) {
    die("Error: Estado OAuth inválido (posible ataque CSRF).");
}
// Limpieza del estado tras su uso
unset($_SESSION['oauth_state']);
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:

1.  He iniciado el flujo de login normal y comprobado que la redirección a GitHub incluye un parámetro `state` aleatorio y único.
2.  He completado el flujo de autenticación exitosamente, confirmando que el callback valida correctamente el estado legítimo.
3.  He simulado un ataque intentando acceder directamente a `oauth_callback.php` con un código válido pero con un `state` incorrecto o sin sesión previa.
4.  He comprobado que el sistema rechaza estas solicitudes con el mensaje "Error: Estado OAuth inválido", previniendo el ataque CSRF.
