# Reporte de Actividad: Inyección S QL

## 1. Identificación de la Vulnerabilidad

**Archivo afectado:** `login.php`

El código original presentaba una vulnerabilidad de **Inyección SQL (SQLi)** debido a la concatenación directa de las variables `$username` y `$password` en la consulta a la base de datos, sin ningún tipo de validación o sanitización.

### Código Vulnerable:
```php
$username = $_POST["username"];
$password = $_POST["password"];
$query = "SELECT * FROM users WHERE name = '$username' AND passwd = '$password'";
```

Esta práctica permite a un atacante manipular la consulta SQL inyectando código malicioso a través de los campos del formulario.

---

## 2. Explotación (Proof of Concept)

El objetivo es lograr un **"Inicio de sesión exitoso"** sin conocer las credenciales legítimas de ningún usuario.

**Payload utilizado:**
```sql
' OR '1'='1' --
```

**Procedimiento:**
1. En el campo `Usuario`, se introduce el payload: `' OR '1'='1' --`
2. El campo `Contraseña` se puede dejar vacío o con cualquier valor (ej. `asd`).
3. Al enviar el formulario, la aplicación ejecuta la consulta manipulada.
4. Como resultado, se obtiene acceso administrativo y **se muestra en pantalla el listado completo de usuarios y contraseñas** de la base de datos.

**Resultado obtenido:**
- Mensaje: **"Inicio de sesión exitoso"**
- **Listado de Usuarios expuestos:**
  - ID: 1 - Usuario: admin
  - ID: 2 - Usuario: user (u otros que existan)

Esto confirma que la vulnerabilidad ha sido explotada con éxito, permitiendo no solo el bypass de autenticación sino también la exfiltración de datos.
La inyección funciona porque `' OR '1'='1'` siempre es verdadero, y `--` comenta el resto de la consulta (la verificación de contraseña), anulando su efecto.

---

## 3. Mitigación y Solución

Para corregir la vulnerabilidad, se ha modificado el código para utilizar **Sentencias Preparadas (Prepared Statements)** con PDO. Esta técnica separa la estructura de la consulta de los datos proporcionados por el usuario.

### Código Seguro (Corrección):
```php
// Uso de marcadores de posición (:username, :password)
$query = "SELECT * FROM users WHERE name = :username AND passwd = :password";
$stmt = $db->prepare($query);

// Vinculación segura de parámetros
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();
```

### Verificación de la Solución:
Tras aplicar el parche:
1. Se intenta nuevamente el ataque con el payload `' OR '1'='1`.
2. La base de datos busca literalmente un usuario llamado `' OR '1'='1`.
3. Al no encontrarlo, el sistema responde correctamente:
   > **Usuario o contraseña incorrectos**

![alt text](image.png)

La vulnerabilidad ha sido mitigada satisfactoriamente.
