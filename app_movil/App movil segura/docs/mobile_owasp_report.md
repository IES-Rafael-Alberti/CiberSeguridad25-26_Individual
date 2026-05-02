# Informe de Vulnerabilidades: OWASP Mobile Top 10 (2024)

Este informe evalúa la aplicación móvil de la clínica veterinaria frente a los riesgos más críticos definidos por OWASP en su versión 2024.

---

### M1: Improper Credential Usage
- **Riesgo:** Uso de credenciales hardcodeadas o gestión débil de claves.
- **Estado:** ✅ **Mitigado**.
- **Acción:** No se incluyen `API_KEYS` o secretos en el código fuente. La autenticación se realiza vía OAuth2/JWT. Las claves de entorno se gestionan fuera del binario.

### M2: Inadequate Supply Chain Security
- **Riesgo:** Dependencias vulnerables o procesos de build comprometidos.
- **Estado:** ⚠️ **En observación**.
- **Acción:** Se recomienda ejecutar `npm audit` semanalmente. Se utiliza Capacitor oficial para minimizar plugins de terceros no verificados.

### M3: Insecure Authentication/Authorization
- **Riesgo:** Fallos en el login, falta de validación de tokens o escalada de privilegios.
- **Estado:** ✅ **Mitigado**.
- **Acción:** La app solo permite el rol `client`. El backend valida el JWT en cada petición (RBAC/ABAC). Se implementa logout del lado del cliente borrando el token de forma segura.

### M4: Insufficient Input/Output Validation
- **Riesgo:** Inyecciones, XSS o falta de saneamiento de datos recibidos de la API.
- **Estado:** ✅ **Mitigado**.
- **Acción:** Uso de React (JSX) que escapa automáticamente el contenido. Validación de esquemas con **Zod** en el cliente antes de enviar datos a la API.

### M5: Insecure Communication
- **Riesgo:** Tráfico sin cifrar (HTTP) o falta de validación de certificados.
- **Estado:** ✅ **Mitigado**.
- **Acción:** Se fuerza el uso de HTTPS (TLS 1.2+). En producción se debe implementar *Certificate Pinning* para evitar ataques MitM.

### M6: Inadequate Privacy Controls
- **Riesgo:** Fuga de PII (Información de Identificación Personal) en logs o almacenamiento.
- **Estado:** ✅ **Mitigado**.
- **Acción:** No se registran datos sensibles en la consola (`console.log`) en producción. Solo se solicitan permisos estrictamente necesarios (Red).

### M7: Insufficient Binary Protections
- **Riesgo:** Ingeniería inversa o manipulación del binario.
- **Estado:** ℹ️ **Recomendación**.
- **Acción:** Al ser una app híbrida, el código JS es visible si se descomprime el APK. Se recomienda usar **ProGuard/R8** para Android y herramientas de ofuscación de código JS (como Terser o Jscrambler).

### M8: Security Misconfiguration
- **Riesgo:** Permisos excesivos en el manifest, modo debug activado.
- **Estado:** ✅ **Mitigado**.
- **Acción:** El archivo `AndroidManifest.xml` solo incluye permisos de Internet. El modo debug se desactiva automáticamente en las builds de producción de Capacitor.

### M9: Insecure Data Storage
- **Riesgo:** Almacenamiento de datos sensibles en SQLite o LocalStorage sin cifrar.
- **Estado:** ✅ **Mitigado**.
- **Acción:** El `accessToken` no se guarda en `localStorage`. Se utiliza el plugin `@capacitor-community/secure-storage` para guardar el JWT en el Keystore (Android) / Keychain (iOS).

### M10: Insufficient Cryptography
- **Riesgo:** Uso de algoritmos obsoletos (MD5, SHA1) o implementación incorrecta.
- **Estado:** ✅ **Mitigado**.
- **Acción:** No se implementa criptografía propia. Se delega en los estándares de TLS y en el almacenamiento seguro provisto por el sistema operativo.

---

## Conclusión

La aplicación móvil sigue un modelo de **Seguridad por Diseño**. Al ser una extensión de una API ya securizada, el foco principal ha sido el almacenamiento seguro de la sesión y la integridad de las comunicaciones. Se recomienda realizar un escaneo con **MobSF** tras cada cambio mayor en la arquitectura de plugins.
