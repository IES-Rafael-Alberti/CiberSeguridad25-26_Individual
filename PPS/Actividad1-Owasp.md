# Reporte de Actividad: Inyección SQL

## 1. Demostración de la Vulnerabilidad

El archivo original `login.php` es vulnerable a Inyección SQL debido a que concatena directamente las entradas del usuario (`$username` y `$password`) en la consulta SQL sin sanitización ni uso de sentencias preparadas.

### Código Vulnerable:
```php
$query = "SELECT * FROM users WHERE name = '$username' AND passwd = '$password'";
```

### Exploit (Payload):
Para explotar esta vulnerabilidad y acceder sin conocer la contraseña, se puede usar el siguiente payload en el campo de usuario:

**Usuario:** `' OR '1'='1`
**Contraseña:** (Cualquier valor)

Esto transforma la consulta en:
```sql
SELECT * FROM users WHERE name = '' OR '1'='1' AND passwd = '...'
```
Dado que `'1'='1'` es siempre verdadero, la consulta devuelve todos los registros, permitiendo el acceso no autorizado.

## 2. Mitigación

Para solucionar la vulnerabilidad, se debe utilizar **Sentencias Preparadas (Prepared Statements)**. Esto separa la estructura de la consulta de los datos, impidiendo que el motor de base de datos interprete la entrada del usuario como código SQL.

### Código Corregido:
Se ha modificado `login.php` para usar `prepare()` y `execute()`.

```php
$stmt = $db->prepare("SELECT * FROM users WHERE name = :username AND passwd = :password");
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();
```

## 3. Verificación

Con el código corregido, si intentamos usar el payload `' OR '1'='1`, la base de datos buscará literalmente un usuario con ese nombre, en lugar de modificar la lógica de la consulta SQL. El ataque fallará y el sistema será seguro.
