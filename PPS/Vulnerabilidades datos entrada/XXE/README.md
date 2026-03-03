# XXE

XXE (XML External Entity) ocurre cuando una aplicación procesa XML sin restricciones, permitiendo a un atacante:
- Leer archivos internos del servidor (/etc/passwd, C:\windows\win.ini).
- Realizar peticiones SSRF (http://169.254.169.254/latest/meta-data/).
- Ejecutar ataques DoS (Billion Laughs Attack).