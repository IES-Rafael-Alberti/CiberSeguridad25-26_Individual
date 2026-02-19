## Actividades vulnerabilidades OWASP Top 10

En todas las actividades hay que demostrar la forma de explotar la vulnerabilidad y después mitigarla, demostrando que la vulnerabilidad se ha solventado.

---

### 1. SQL Injection

**Estado:** Realizado :white_check_mark:

#### Vulnerabilidad Detectada
El archivo `login.php` concatenaba directamente las variables `$username` y `$password` en la consulta SQL sin sanitizar, permitiendo inyectar código SQL arbitrario.

**Código Vulnerable:**
```php
$query = "SELECT * FROM users WHERE name = '$username' AND passwd = '$password'";
```

#### Explotación (Proof of Concept)
Para saltarse el login sin conocer la contraseña, se utilizó el siguiente payload en el campo de usuario:
`' OR '1'='1`

Esto modifica la consulta a:
```sql
SELECT * FROM users WHERE name = '' OR '1'='1' AND passwd = '...'
```
Como `'1'='1'` es siempre verdadero, la base de datos devuelve todos los registros, permitiendo el acceso como el primer usuario (admin).

#### Mitigación Aplicada
La vulnerabilidad se soluciona utilizando **Sentencias Preparadas (Prepared Statements)** con PDO. Esto asegura que los datos del usuario se traten estrictamente como datos y no como código ejecutable.

**Código Seguro (Solución):**
```php
$query = "SELECT * FROM users WHERE name = :username AND passwd = :password";
$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();
```

Al aplicar este cambio, el intento de inyección `' OR '1'='1` simplemente busca un usuario con ese nombre literal, fallando el login y protegiendo la aplicación.
