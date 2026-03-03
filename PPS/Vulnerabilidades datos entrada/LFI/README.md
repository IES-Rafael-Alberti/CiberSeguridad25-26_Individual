# LFI

LFI (Local File Inclusion) es una vulnerabilidad web que permite a un atacante incluir archivos locales del servidor en la
respuesta de la aplicación.

Si no se controla correctamente, un atacante podría:
- Leer archivos sensibles como /etc/passwd o C:\windows\win.ini.
- Ejecutar código malicioso si se permite la inclusión de archivos .php.
- Escalar a Remote Code Execution (RCE) si se combina con técnicas de log poisoning.