# Seguridad: SAST, SCA/RCA y DAST

## 1) SAST con SonarQube

1. Crear proyecto en SonarQube.
2. Configurar secretos en GitHub:
   - `SONAR_TOKEN`
   - `SONAR_HOST_URL`
3. Ejecutar en local:
   ```bash
   npm run sast
   ```
4. Revisar hallazgos en:
   - vulnerabilidades
   - code smells
   - hotspots de seguridad

## 2) SCA + RCA con OWASP Dependency Check

RCA aqui se toma como analisis de causa raiz de riesgos por dependencias vulnerables.

1. Ejecutar:
   ```bash
   npm run sca
   ```
2. Revisar el reporte HTML generado en `reports/dependency-check`.
3. Para cada CVE:
   - identificar paquete afectado
   - actualizar version
   - documentar impacto y mitigacion en el README

## 3) DAST con OWASP ZAP

1. Levantar la aplicacion:
   ```bash
   npm start
   ```
2. Ejecutar baseline:
   ```bash
   npm run dast
   ```
3. Revisar `zap-report.html` y registrar:
   - riesgos alto/medio/bajo
   - endpoints afectados
   - acciones correctivas

## 4) Gestion de secretos

Este proyecto usa variables de entorno y recomienda:

- Render Environment Variables (produccion)
- GitHub Secrets (CI/CD)
- Supabase Project Secrets
- Opcional: Infisical o HashiCorp Vault para equipo

Nunca subas llaves reales al repositorio.
