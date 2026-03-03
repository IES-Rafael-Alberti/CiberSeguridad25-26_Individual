# Solución: Broken Authentication (SQL Injection)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con un sistema de inicio de sesión (`login_weak.php`) que era vulnerable a inyección SQL. He observado que el sistema concatenaba directamente los datos introducidos por el usuario (usuario y contraseña) en la consulta a la base de datos sin ninguna validación o saneamiento. Esto permitía a un atacante manipular la consulta SQL original para eludir el mecanismo de autenticación, por ejemplo, introduciendo `' OR '1'='1` en el campo de contraseña.

## 2. Código Vulnerable (Original)
El código original construía la consulta SQL insertando las variables directamente, lo cual es altamente inseguro:

```php
$query = "SELECT * FROM users WHERE name = '$username' AND passwd = '$password'";
echo "Consulta SQL: " . $query . "<br>";
$result = $db->query($query);
```
Un atacante podía cerrar la comilla simple y añadir condiciones siempre verdaderas para acceder sin credenciales válidas.

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he implementado el uso de **Sentencias Preparadas (Prepared Statements)** con PDO.

*   **Preparación:** La consulta SQL ahora utiliza marcadores de posición (`:username`, `:password`) en lugar de insertar los valores directamente.
*   **Vinculación:** Los valores se envían por separado al motor de la base de datos, garantizando que se traten estrictamente como datos literales y no como código ejecutable.

```php
// Corrección aplicada en login_weak.php
$query = "SELECT * FROM users WHERE name = :username AND passwd = :password";
echo "Consulta SQL: (Preferencia preparada) <br>";

$stmt = $db->prepare($query);
$stmt->bindParam(':username', $username);
$stmt->bindParam(':password', $password);
$stmt->execute();
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:

1.  He intentado iniciar sesión con credenciales válidas (el flujo normal sigue funcionando).
2.  He intentado realizar un ataque de inyección SQL introduciendo `' OR '1'='1` como nombre de usuario o contraseña.
3.  He comprobado que el sistema ahora rechaza el acceso (mostrando "Usuario o contraseña incorrectos"), ya que la base de datos busca literalmente un usuario llamado `' OR '1'='1` en lugar de evaluar la lógica inyectada.
