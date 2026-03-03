# OAuth inseguro 

OAuth (Open Authorization) es un estándar abierto que permite a aplicaciones de terceros acceder a recursos protegidos en nombre de un usuario sin necesidad de compartir credenciales como contraseñas. OAuth 2.0 es la versión más utilizada y se basa en la emisión de tokens de acceso para autenticar y autorizar a los usuarios.

## Vulnerabilidad en la Implementación OAuth

Si OAuth 2.0 se configura incorrectamente, puede permitir varios tipos de ataques, como:
- CSRF (Cross-Site Request Forgery): Si no se usa un parámetro state, un atacante puede redirigir la autenticación a su propio código malicioso.
- Token Leakage: Si los tokens se exponen en la URL o no se protegen adecuadamente, un atacante podría
reutilizarlos para acceder a los recursos protegidos.