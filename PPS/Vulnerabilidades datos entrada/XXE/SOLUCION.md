# Solución: XML External Entity (XXE)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con una página vulnerable a ataques XXE. He comprobado que un atacante podía utilizar entidades XML externas para acceder a archivos sensibles del servidor (`/etc/passwd`), escanear puertos internos, o incluso ejecutar código.

## 2. Código Vulnerable (Original)
El código original cargaba cualquier XML sin restricciones e instruía explícitamente a librarse de las advertencias de entidades externas (`LIBXML_NOENT`), permitiendo su resolución:

```php
$dom->loadXML(file_get_contents('php://input'), LIBXML_NOENT | LIBXML_DTDLOAD);
```

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he deshabilitado explícitamente la carga de entidades externas en el analizador XML de PHP y he eliminado las banderas inseguras.

1.  **Bloqueo de Entidades:** He llamado a `libxml_disable_entity_loader(true);` para asegurar que las entidades externas no sean procesadas (útil para versiones antiguas de PHP).
2.  **Eliminación de Banderas Inseguras:** Al llamar a `loadXML()`, he quitado `LIBXML_NOENT` y `LIBXML_DTDLOAD`.
3.  **Sanitización de Salida:** He agregado `htmlspecialchars()` al resultado final para evitar también XSS.

```php
// Bloquear entidades externas
if (function_exists('libxml_disable_entity_loader')) {
    libxml_disable_entity_loader(true);
}
...
// Cargar XML sin banderas peligrosas
$dom->loadXML($input);
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He intentado enviar un payload XML malicioso (XXE attack) como:
    ```xml
    <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/passwd"> ]>
    <foo>&xxe;</foo>
    ```
2.  He comprobado que el sistema procesa el XML de forma segura y no expande la entidad `&xxe;`, resultando en una salida vacía o un error controlado, en lugar de mostrar el contenido del archivo `/etc/passwd`.
