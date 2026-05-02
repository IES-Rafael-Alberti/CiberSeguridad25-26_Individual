# Herramientas de Análisis de Seguridad (SAST, DAST, etc.)

Para garantizar que la aplicación móvil de la clínica veterinaria cumple con los estándares de **OWASP Mobile Application Security (MASVS/MSTG)**, se han identificado y ubicado las siguientes herramientas:

## 1. Análisis Estático (SAST - Static Application Security Testing)

Estas herramientas analizan el código fuente o el binario sin ejecutar la aplicación para encontrar vulnerabilidades de seguridad, malas prácticas y secretos expuestos.

- **SonarQube / SonarCloud:**
  - **Ubicación:** Integrado en el pipeline de CI/CD (GitHub Actions).
  - **Uso:** Analiza el código TypeScript/JavaScript de Ionic/React buscando inyecciones, debilidades criptográficas y código muerto.
- **MobSF (Mobile Security Framework) - Static Analysis:**
  - **Ubicación:** Servidor local o contenedor Docker.
  - **Uso:** Se sube el archivo `.apk` (Android) o `.ipa` (iOS) generado. MobSF analiza el manifiesto, permisos, binarios compilados y bibliotecas de terceros para detectar riesgos como `M1: Improper Credential Usage` o `M7: Insufficient Binary Protections`.
- **Horusec:**
  - **Ubicación:** CLI local.
  - **Uso:** Escaneo rápido del código fuente en busca de secretos hardcodeados (claves de API, tokens de Supabase, etc.).

## 2. Análisis Dinámico (DAST - Dynamic Application Security Testing)

Estas herramientas analizan la aplicación mientras está en ejecución, simulando ataques reales.

- **MobSF (Dynamic Analyzer):**
  - **Ubicación:** Emulador de Android (Genymotion/AVD) conectado a MobSF.
  - **Uso:** Permite interactuar con la app mientras se monitorea el tráfico de red, el acceso al sistema de archivos y las llamadas a la API. Detecta problemas de `M5: Insecure Communication` (falta de TLS, bypass de certificado).
- **OWASP ZAP (ZAPProxy):**
  - **Ubicación:** Proxy intermedio configurado en el dispositivo/emulador.
  - **Uso:** Intercepta el tráfico entre la App móvil y la API Express para realizar ataques de interceptación (Man-in-the-Middle) y fuzzing de endpoints.

## 3. Análisis de Composición de Software (SCA - Software Composition Analysis)

- **npm audit / Snyk:**
  - **Ubicación:** CLI y GitHub Actions.
  - **Uso:** Identifica vulnerabilidades en las dependencias de `package.json` (bibliotecas de React, Capacitor, Ionic, etc.) para mitigar el riesgo `M2: Inadequate Supply Chain Security`.

## Resumen de Ejecución recomendada

| Fase | Herramienta | Cuándo ejecutar |
| :--- | :--- | :--- |
| Desarrollo | SonarQube / npm audit | En cada commit/pull request |
| Pre-Release | MobSF Static | Al generar la build de producción |
| Testing QA | MobSF Dynamic / OWASP ZAP | Antes de la publicación en stores |
