<?php
session_start();

// Corrección: Regenerar ID de sesión al elevar privilegios o iniciar sesión
// Esto previene ataques de fijación de sesión (Session Fixation)
if (!isset($_SESSION['initiated'])) {
    session_regenerate_id(true);
    $_SESSION['initiated'] = true;
}

// Validación básica de entrada
if (isset($_GET['user']) && !empty($_GET['user'])) {
    $_SESSION['user'] = htmlspecialchars($_GET['user'], ENT_QUOTES, 'UTF-8');
    echo "Sesión iniciada como: " . $_SESSION['user'];
    echo "<br>ID de Sesión Seguro: " . session_id();
} else {
    echo "Error: Usuario no especificado.";
}
?>