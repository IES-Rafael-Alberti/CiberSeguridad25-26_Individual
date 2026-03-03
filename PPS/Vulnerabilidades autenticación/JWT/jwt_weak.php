<?php
require 'vendor/autoload.php';
use Firebase\JWT\JWT;

// Corrección: Uso de una clave secreta fuerte y compleja
// En producción, esto debería cargarse desde una variable de entorno (e.g., getenv('JWT_SECRET'))
$key = "k9js83nls92kd02nd_STRONG_SECRET_KEY_!@#$"; 

$payload = ["user" => "admin", "role" => "admin"];
// Agregar el tercer parámetro: el algoritmo de firma
$jwt = JWT::encode($payload, $key, "HS256");
echo "JWT Generado: " . $jwt;
?>