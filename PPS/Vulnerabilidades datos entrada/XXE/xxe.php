<?php
// Prevenir XXE deshabilitando la carga de entidades externas
// (Necesario en versiones antiguas de PHP, redundante pero seguro en PHP 8+)
if (function_exists('libxml_disable_entity_loader')) {
    libxml_disable_entity_loader(true);
}

// Crear un objeto DOMDocument
$dom = new DOMDocument();

// Leer la entrada
$input = file_get_contents('php://input');

if ($input) {
    // Cargar XML sin los flags peligrosos (LIBXML_NOENT | LIBXML_DTDLOAD)
    // Esto evita la expansión de entidades externas y ataques XXE
    $dom->loadXML($input);

    // Convertir el XML a SimpleXMLElement (opcional)
    $parsed = simplexml_import_dom($dom);

    // Mostrar el resultado (sanitizado)
    echo htmlspecialchars($parsed);
}
?>
?>