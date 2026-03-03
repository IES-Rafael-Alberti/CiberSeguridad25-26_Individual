<?php
// Lista blanca de archivos permitidos para prevenir Local/Remote File Inclusion
$allowed_files = [
    'home' => 'home.php'
];

$file = isset($_GET['file']) ? $_GET['file'] : 'home';

if (array_key_exists($file, $allowed_files)) {
    $target_file = $allowed_files[$file];
    
    // Verificar que el archivo existe localmente y no es una URL remota
    if (file_exists($target_file)) {
        include($target_file);
    } else {
        echo "Error: Archivo no encontrado.";
    }
} else {
    echo "Acceso denegado: Página no válida.";
}
?>
?>