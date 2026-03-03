<?php
session_start();

// Generar token CSRF si no existe
if (empty($_SESSION['csrf_token'])) {
    $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Verificar token CSRF
    if (!isset($_POST['csrf_token']) || $_POST['csrf_token'] !== $_SESSION['csrf_token']) {
        die("Error: Token CSRF inválido.");
    }

    $amount = $_POST["amount"];
    // Sanitizar la entrada para evitar XSS (buena práctica adicional)
    $amount = htmlspecialchars($amount); 
    echo "Transferidos $$amount";
}
?>
<form method="post">
    <input type="hidden" name="csrf_token" value="<?php echo $_SESSION['csrf_token']; ?>">
    <input type="number" name="amount">
    <button type="submit">Transferir</button>
</form>
