<?php
// RCE es peligroso. Restringir comandos permitidos.
$allowed_commands = [
    'date' => 'date',
    'uptime' => 'uptime'
];

$cmd = isset($_GET['cmd']) ? $_GET['cmd'] : '';

if (array_key_exists($cmd, $allowed_commands)) {
    // Ejecutar solo el comando exacto predefinido
    $output = shell_exec($allowed_commands[$cmd]);
    echo "<pre>$output</pre>";
} else {
    echo "Error: Comando no permitido o inválido. (Solo 'date' o 'uptime' son permitidos)";
}
?>
?>
