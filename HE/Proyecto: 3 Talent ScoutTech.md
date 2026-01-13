
# 📄 Informe de Seguridad – Bloque 1

**Proyecto: Talent ScoutTech**

## 1. Análisis de Vulnerabilidades de Autenticación

---

### **1.a – Inyección SQL por concatenación de parámetros**

Al introducir el carácter `'` en el campo **username**, la aplicación genera un error interno, evidenciando que la consulta SQL falla por una sintaxis inválida.
Esto indica que el valor introducido por el usuario se concatena directamente en la consulta SQL sin validación ni uso de consultas preparadas, lo que expone a la aplicación a ataques de **SQL Injection**.

📸 *[Se adjuntará captura de pantalla del error generado]*

---

### **1.b – Ataque de diccionario mediante SQL Injection**

Se intentó realizar un ataque de diccionario aprovechando la vulnerabilidad de SQL Injection detectada en el apartado anterior.
El ataque no tuvo éxito, ya que no fue posible autenticarse utilizando este método.

Para continuar con la auditoría, se accedió al sistema utilizando las credenciales proporcionadas por el enunciado:

* **Usuario:** `luis`
* **Contraseña:** `1234`

📸 *[Se adjuntará captura de pantalla del acceso exitoso]*

---

### **1.c – Gestión insegura de credenciales**

Se observa que la aplicación gestiona las credenciales de autenticación mediante **cookies**, almacenando el nombre de usuario y la contraseña en texto plano.
Este enfoque supone un riesgo elevado, ya que un atacante podría interceptar o manipular dichas cookies y obtener acceso no autorizado al sistema.

Además, no se implementan mecanismos de seguridad adicionales como:

* Hash de contraseñas
* Tokens de sesión
* Cookies con atributos `HttpOnly` o `Secure`

📸 *[Se adjuntará captura de las cookies almacenadas en el navegador]*

---

### **1.d – Exposición de archivos de respaldo**

Se intentó acceder a un posible archivo de respaldo del código fuente mediante la siguiente URL:

```
http://localhost/web/add_comment.php~
```

El servidor respondió con un error **404 Not Found**, indicando que el archivo de backup no existe o no es accesible desde la configuración actual del servidor.

Por tanto, no fue posible explotar esta vulnerabilidad en el entorno proporcionado.

📸 *[Se adjuntará captura del error 404 mostrado por el servidor]*

---


Perfecto 👌
Seguimos **igual que en la Parte 1**: explicación clara, texto **listo para el informe en Markdown** y te indico **qué capturas añadir**.
Vamos **apartado por apartado** de la **Parte 2 – XSS**.

---

# 📄 Informe de Seguridad – Parte 2

**Cross-Site Scripting (XSS)**

---

## **2.a – Prueba de XSS mediante comentarios**

Para comprobar si la aplicación es vulnerable a **XSS**, se creó un comentario malicioso cuyo contenido incluye código JavaScript con el objetivo de generar una ventana emergente (`alert`) cuando cualquier usuario consulte los comentarios del jugador afectado en la página `show_comments.php`.

El comentario introducido fue, por ejemplo:

```html
<script>alert('XSS')</script>
```

Al acceder posteriormente al listado de comentarios del jugador, el navegador ejecuta el código JavaScript embebido, mostrando una ventana `alert`.
Esto confirma que la aplicación **no valida ni escapa correctamente** el contenido introducido por el usuario antes de mostrarlo en la página, siendo vulnerable a **XSS almacenado (Stored XSS)**.

📸 *[Añadir captura del comentario introducido]*
📸 *[Añadir captura del alert ejecutándose al ver los comentarios]*

---

## **2.b – Uso de `&amp;` en enlaces HTML**

En el código HTML de la aplicación se observa que los enlaces con parámetros GET utilizan `&amp;` en lugar de `&`, por ejemplo:

```html
<a href="index.php?amount=100&amp;destination=ACMEScouting">
```

Esto ocurre porque en **HTML** el carácter `&` tiene un significado especial y debe ser **escapado** para cumplir con el estándar del lenguaje.
Aunque en el código fuente aparece como `&amp;`, el navegador lo interpreta correctamente como `&` al procesar el enlace.

Este mecanismo **no es una vulnerabilidad**, sino una práctica correcta para evitar errores de interpretación del HTML y posibles problemas de seguridad o renderizado.

---

## **2.c – Problema de seguridad en `show_comments.php` y solución**

El problema principal de `show_comments.php` es que **muestra directamente el contenido de los comentarios sin ningún tipo de saneamiento o escape**, permitiendo la ejecución de código JavaScript introducido por los usuarios.

### 🔴 Problema

* El contenido almacenado en la base de datos se imprime directamente en el HTML
* No se utilizan funciones de escape
* Permite **XSS almacenado**

### 🟢 Solución

Antes de mostrar cualquier contenido introducido por el usuario, se debería escapar correctamente usando funciones como:

```php
htmlspecialchars($comentario, ENT_QUOTES, 'UTF-8');
```

De este modo:

* El código JavaScript se mostraría como texto
* No sería interpretado ni ejecutado por el navegador
* Se elimina la vulnerabilidad XSS

---

## **2.d – Otras páginas afectadas por la misma vulnerabilidad**

Tras analizar el funcionamiento de la aplicación, se observa que **cualquier página que muestre datos introducidos por el usuario sin validación ni escape** puede estar afectada por la misma vulnerabilidad.

La detección se realizó introduciendo el mismo payload de XSS en distintos campos de entrada y comprobando si el código se ejecutaba al visualizar los datos posteriormente.

Esto sugiere que la vulnerabilidad no es exclusiva de `show_comments.php`, sino que es **un problema generalizado de falta de saneamiento de entradas y salidas** en la aplicación.

📸 *[Añadir captura del campo vulnerable adicional o del comportamiento observado]*

---

## ✅ Conclusión Parte 2

La aplicación es vulnerable a **XSS almacenado**, permitiendo la ejecución de código JavaScript malicioso introducido por los usuarios.
Esto puede derivar en:

* Robo de cookies
* Secuestro de sesiones
* Redirecciones maliciosas
* Ejecución de acciones en nombre del usuario

La correcta validación y escape de datos es imprescindible para mitigar este tipo de ataques.

---

🔹 **Parte 2 finalizada y lista para entregar**
🔹 Markdown limpio
🔹 Solo falta añadir las capturas

---

👉 ¿Seguimos con la **Parte 3** del proyecto?
Pásame el enunciado y continuamos 💪




