# Solución: Local File Inclusion (LFI)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con una página vulnerable a LFI. He notado que el archivo incluido en la página dependía directamente de la entrada del usuario en la URL (`file=`).

## 2. Código Vulnerable (Original)
El código original permitía al usuario leer cualquier archivo local accesible por el proceso PHP (como `/etc/passwd` o `C:\Windows\win.ini`):

```php
$file = $_GET['file'];
$content = file_get_contents($file);
echo $content;
```

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he limitado los archivos que pueden ser incluidos mediante una **Lista Blanca (Whitelist)**.

1.  **Definición de Archivos Permitidos:** He creado un array `$allowed_files` con los nombres exactos de los archivos permitidos (`['welcome.txt']`).
2.  **Validación:** Antes de incluir el archivo, verifico si el nombre proporcionado por el usuario existe en esta lista.
3.  **Sanitización adicional:** He empleado `basename()` para evitar ataques de Directory Traversal (`../`).

```php
// Lista blanca de archivos permitidos
$allowed_files = ['welcome.txt'];

// Sanitizar entrada
$file = isset($_GET['file']) ? basename($_GET['file']) : '';

// Validar contra la lista blanca
if (in_array($file, $allowed_files)) {
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        echo "Error: El archivo no existe.";
    }
} else {
    echo "Acceso denegado: Archivo no permitido.";
}
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He visitado `lfi.php?file=welcome.txt` y he visto que se muestra el contenido de `welcome.txt`.
2.  He intentado acceder a `lfi.php?file=../../../../etc/passwd` y otros archivos de sistema.
3.  He comprobado que el sistema bloquea el acceso y muestra "Acceso denegado: Archivo no permitido".
