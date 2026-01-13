
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

