<?php
session_start();

if (isset($_GET['code']) && isset($_GET['state'])) {
    // Corrección: Validar que el estado recibido coincida con el almacenado
    if ($_GET['state'] !== $_SESSION['oauth_state']) {
        die("Error: Estado OAuth inválido (posible ataque CSRF).");
    }

    echo "Código OAuth recibido: " . htmlspecialchars($_GET['code'], ENT_QUOTES, 'UTF-8');
    echo "<br>Estado verificado correctamente.";
    
    // Limpiar estado después del uso
    unset($_SESSION['oauth_state']);

} else {
    echo "Error: Faltan parámetros (code o state).";
}
?>