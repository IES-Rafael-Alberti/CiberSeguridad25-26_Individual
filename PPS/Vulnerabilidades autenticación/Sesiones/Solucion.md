# Solución: Gestión de Sesiones (Session Fixation)

## 1. Explicación de la Actividad
En esta actividad, he analizado un script de gestión de sesiones (`session.php`) que permitía establecer una sesión de usuario basándose únicamente en un parámetro GET (`user`). He identificado una vulnerabilidad de **Fijación de Sesión (Session Fixation)**, ya que el identificador de sesión (PHPSESSID) no se regeneraba al autenticar al usuario. Un atacante podría establecer un ID de sesión conocido en el navegador de la víctima y luego esperar a que esta inicie sesión para secuestrar su cuenta.

## 2. Código Vulnerable (Original)
El código original iniciaba la sesión y asignaba el usuario sin cambiar el identificador de la sesión:

```php
session_start();
$_SESSION['user'] = $_GET['user'];
// El ID de sesión permanecía igual antes y después de "autenticarse"
```

## 3. Corrección Aplicada
Para prevenir el secuestro de sesión mediante fijación, he implementado la regeneración del ID de sesión.

*   **Regeneración de ID:** He añadido `session_regenerate_id(true)` justo en el momento en que se establece la sesión del usuario. Esto obliga al servidor a emitir un nuevo ID de sesión y invalidar el anterior, desconectando cualquier posible acceso ilegítimo que un atacante pudiera tener con el ID antiguo.
*   **Saneamiento:** También he añadido `htmlspecialchars` para prevenir XSS básico al mostrar el nombre del usuario.

```php
// Corrección aplicada en session.php
session_start();

// Regenerar ID si es una nueva sesión autenticada
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id(true);
    $_SESSION['initiated'] = true;
}

$_SESSION['user'] = htmlspecialchars($_GET['user'], ENT_QUOTES, 'UTF-8');
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:

1.  He accedido a la página y observado el valor de la cookie `PHPSESSID` en las herramientas de desarrollador del navegador.
2.  He recargado la página pasando el parámetro `?user=admin` para simular el inicio de sesión.
3.  He comprobado que el valor de la cookie `PHPSESSID` ha cambiado automáticamente. Esto confirma que el identificador de sesión antiguo ha sido descartado y la sesión actual es segura y nueva.
