# SSRF

SSRF (Server-Side Request Forgery) ocurre cuando una aplicación permite que un usuario controle solicitudes realizadas
desde el servidor.

Esto puede ser utilizado para:
- Acceder a recursos internos (localhost, 127.0.0.1, 169.254.169.254).
- Filtrar información sensible, como credenciales en AWS.
- Escanear la red interna del servidor víctima.