# Solución: Remote File Inclusion (RFI)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con una página vulnerable a RFI. He comprobado que un atacante podía incluir código PHP arbitrario desde un servidor remoto al incluir su URL en el parámetro `file`.

## 2. Código Vulnerable (Original)
El código original permitía incluir cualquier archivo (local o remoto) sin validación:

```php
$file = $_GET['file'];
include($file);
```

Si el servidor PHP tenía `allow_url_include=On`, esto era crítico, permitiendo una ejecución de cualquier código.

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he prohibido la inclusión de URLs externas y he implementado una **Lista Blanca (Whitelist)** para los archivos locales disponibles.

1.  **Definición de Archivos Permitidos:** He creado un array `$allowed_files` con los archivos seguros permitidos (`['home.php']`).
2.  **Validación y Comprobación:** Verifico si el archivo existe en la lista y, además, compruebo que **exista localmente** mediante `file_exists()`.
3.  **Sanitización adicional:** He agregado un archivo `home.php` seguro para mostrar en la inclusión.

```php
// Lista blanca para RFI
$allowed_files = [
    'home' => 'home.php'
];

$file = isset($_GET['file']) ? $_GET['file'] : 'home';

// RFI se previene validando que sea local y esté en lista blanca
if (array_key_exists($file, $allowed_files)) {
    $target_file = $allowed_files[$file];
    
    // Verificar que existe localmente
    if (file_exists($target_file)) {
        include($target_file);
    } else {
        echo "Error: Archivo no encontrado.";
    }
}
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He visitado `rfi.php?file=home` y se ha mostrado el contenido de `home.php`.
2.  He intentado incluir un archivo remoto como `http://evil.com/shell.php` o una página local no permitida.
3.  He comprobado que el sistema bloquea la inclusión y muestra "Acceso denegado: Página no válida".
