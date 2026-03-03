<?php
// Lista blanca de archivos permitidos
$allowed_files = ['welcome.txt'];

$file = isset($_GET['file']) ? basename($_GET['file']) : '';

// Validar si el archivo está en la lista permitida
if (in_array($file, $allowed_files)) {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo "Error: El archivo no existe.";
    }
} else {
    echo "Acceso denegado: Archivo no permitido.";
}
?>
?>