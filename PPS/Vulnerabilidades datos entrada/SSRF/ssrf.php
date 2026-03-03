<?php
$url = isset($_GET['url']) ? $_GET['url'] : '';

function is_safe_url($url) {
    // Validar formato URL
    if (!filter_var($url, FILTER_VALIDATE_URL)) return false;
    
    $parsed = parse_url($url);
    // Solo permitir http y https
    if (!isset($parsed['scheme']) || !in_array($parsed['scheme'], ['http', 'https'])) return false;
    
    $host = $parsed['host'];
    // Resolver IP
    $ip = gethostbyname($host);
    
    // Filtrar IPs privadas (10.x, 192.168.x, 172.16.x) y reservadas (127.0.0.1, link-local, etc.)
    if (!filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
        return false;
    }
    return true;
}

if (is_safe_url($url)) {
    // Usar contexto seguro si es necesario, pero la validación de IP es clave
    echo file_get_contents($url);
} else {
    echo "Error: URL no válida o acceso a red interna bloqueado (SSRF Protection).";
}
?>
?>