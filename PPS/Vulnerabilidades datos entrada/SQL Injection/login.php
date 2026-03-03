<?php
try {
    // Usar ruta relativa para data.db
    $db = new PDO("sqlite:data.db");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST["username"];
        $password = $_POST["password"];

        // Usar Prepared Statements para prevenir SQL Injection
        $stmt = $db->prepare("SELECT * FROM users WHERE name = :username AND passwd = :password");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->execute();
        
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Verificar si se encontraron resultados
        if (count($result) > 0) {
            echo "Inicio de sesión exitoso<br>";
             foreach ($result as $row) {
                // Sanitizar output con htmlspecialchars para evitar XSS
                echo "ID: " . htmlspecialchars($row['id']) . " - Usuario: " . htmlspecialchars($row['name']) . "<br>";
            }
        } else {
            echo "Usuario o contraseña incorrectos";
        }
    }
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
}
?>
<form method="post">
<input type="text" name="username" placeholder="Usuario">
<input type="password" name="password" placeholder="Contraseña">
<button type="submit">Iniciar Sesión</button>
</form>
