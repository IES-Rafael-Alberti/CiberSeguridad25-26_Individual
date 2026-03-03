# Solución: SQL Injection (SQLi)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con un formulario de inicio de sesión vulnerable a SQL Injection. Permitía acceder sin las credenciales correctas o extraer información de la base de datos al concatenar directamente las entradas del usuario en la consulta SQL.

## 2. Código Vulnerable (Original)
El código original formaba la consulta SQL concatenando los valores de `$_POST` directamente, sin validación ni escapado:

```php
$query = "SELECT * FROM users WHERE name = '$username' AND passwd = '$password'";
```

Un atacante podía ingresar algo como `' OR '1'='1` para vulnerar la consulta.

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he cambiado el método de consulta por **Sentencias Preparadas (Prepared Statements)** con PDO (PHP Data Objects).

1.  **Conexión Segura:** He actualizado la conexión a SQLite para usar una ruta relativa (`data.db`) y manejar errores con `PDO::ERRMODE_EXCEPTION`.
2.  **Prepared Statements:** He reemplazado la concatenación insegura por marcadores de posición (`:name`, `:passwd`).
3.  **Vinculación de Parámetros:** He configurado el envío de valores por separado al motor de base de datos (`bindParams()`), evitando que sean interpretados como código SQL.
4.  **Sanitización de Salida:** Además, he usado `htmlspecialchars()` al mostrar los resultados para prevenir **Cross-Site Scripting (XSS)**.

```php
$stmt = $db->prepare("SELECT * FROM users WHERE name = :name AND passwd = :passwd");
$stmt->bindParam(':name', $username);
$stmt->bindParam(':passwd', $password);
$stmt->execute();
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He intentado iniciar sesión con credenciales válidas (creando un usuario en `data.db` para la prueba).
2.  He intentado inyectar SQL en el campo de usuario o contraseña, por ejemplo: `admin' --` o `' OR 1=1 --`.
3.  He comprobado que el sistema trata la entrada literalmente como nombre de usuario, fallando la autenticación en lugar de ejecutar la lógica maliciosa.
