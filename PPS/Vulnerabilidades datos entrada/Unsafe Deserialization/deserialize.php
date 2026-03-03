<?php
// Usar JSON en lugar de serialize/unserialize para evitar vulnerabilidades de deserialización
// JSON es un formato de intercambio de datos seguro que no ejecuta código

class User {
    public $username;
    public $isAdmin = false;
}

// Recibir datos en formato JSON
$json_input = isset($_GET['data']) ? $_GET['data'] : ''; 

// Decodificar JSON
$data = json_decode($json_input);

// Verificar y validar
if ($data && isset($data->isAdmin) && $data->isAdmin === true) {
    // Aún así, confiar en el cliente para "isAdmin" es mala práctica (Broken Access Control),
    // pero aquí hemos eliminado la vulnerabilidad de Unsafe Deserialization.
    echo "¡Acceso de administrador concedido!";
} else {
    echo "Acceso denegado.";
}
?>
