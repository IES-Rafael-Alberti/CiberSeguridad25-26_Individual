# Informe de entrega: aplicacion web (frameworks)

## 1. Resumen del proyecto

Aplicacion web de clinica veterinaria implementada con backend en Express.js y frontend web integrado.

Alcance funcional:

- Venta de articulos
- Servicios veterinarios
- Adopcion de mascotas
- Ofertas exclusivas para clientes con adopciones aprobadas

Roles implementados:

- `admin`
- `client`
- `vet`
- `sales`

Modelo de roles:

- Relacion muchos-a-muchos entre usuarios y roles mediante `roles` + `user_roles`.

## 2. Arquitectura tecnica

### 2.1 Backend (framework fijo)

- Framework: Express.js
- Entrada: `src/server.js`
- Composicion de middlewares y rutas: `src/app.js`
- Seguridad base: `helmet`, sesiones (`express-session` + `connect-sqlite3`), JWT Bearer

### 2.2 Frontend (opcional, implementado)

- HTML/CSS/JS estatico en `public/`
- Gestion de token JWT en `localStorage`
- Panel de sesion, catalogo, pruebas por rol y panel admin de gestion de roles

### 2.3 Datos

- Soporte para Supabase (PostgreSQL) y modo memoria para desarrollo
- Script SQL de estructura en `sql/schema.sql`

## 3. Autenticacion OAuth 2

Implementacion:

- Inicio OAuth: `GET /auth/google?redirect=1`
- Callback OAuth: `GET /auth/google/callback`
- Integracion con Google mediante Passport (`passport-google-oauth20`)

Comportamiento:

- Tras autenticar con Google, se emite JWT (`accessToken`) para consumo del cliente.
- En modo `redirect=1`, el token se devuelve al frontend y queda persistido para llamadas protegidas.

Evidencia tecnica:

- Redireccion HTTP 302 a Google verificada en pruebas locales.

## 4. Autorizacion RBAC y ABAC

### 4.1 RBAC

Reglas implementadas (ejemplos):

- `POST /products` -> `admin`, `sales`
- `POST /services/book` -> `client`
- `PATCH /services/:id/status` -> `admin`, `vet`
- `POST /adoptions` -> `client`
- `PATCH /adoptions/:id/approve` -> `admin`, `vet`
- Rutas de administracion (`/admin/*`) -> solo `admin`

### 4.2 ABAC

Regla de negocio para ofertas exclusivas:

- Endpoint: `GET /offers/exclusive`
- Acceso permitido si:
  - rol `admin`, o
  - rol `client` con `adoptedPetCount > 0`

Resultado esperado:

- Cliente adoptante accede a ofertas exclusivas.
- Usuarios sin atributo requerido reciben `403`.

## 5. Informe de analisis estatico (SAST + RCA/SCA)

## 5.1 SAST con SonarQube

Objetivo:

- Detectar vulnerabilidades, bugs y hotspots de seguridad sobre codigo fuente.

Configuracion existente:

- `sonar-project.properties`
- Workflow CI: `.github/workflows/security.yml` (job `sast-sonarqube`)

Ejecucion local:

```bash
npm run sast
```

Salida esperada:

- Hallazgos en SonarQube por severidad
- Base para remediacion y seguimiento por branch/PR

## 5.2 RCA/SCA con OWASP Dependency Check

Objetivo:

- Identificar CVE en dependencias y analizar causa raiz del riesgo por libreria/version.

Configuracion existente:

- Script local: `npm run sca`
- Workflow CI: `.github/workflows/security.yml` (job `sca-owasp-dependency-check`)

Ejecucion local:

```bash
npm run sca
```

Salida esperada:

- Reporte HTML en `reports/dependency-check`
- Lista de CVE, componentes afectados y prioridad de actualizacion

## 6. Informe de analisis dinamico (DAST + pruebas funcionales)

## 6.1 DAST con OWASP ZAP

Objetivo:

- Detectar riesgos de seguridad en tiempo de ejecucion sobre la superficie HTTP.

Configuracion existente:

- Script local: `npm run dast`
- Workflow CI: `.github/workflows/security.yml` (job `dast-zap`)

Ejecucion local:

```bash
npm run dast
```

Salida esperada:

- `zap-report.html` con alertas por severidad y endpoints afectados

## 6.2 Pruebas funcionales dinamicas de autorizacion (ejecutadas)

Pruebas realizadas sobre API en ejecucion local:

- RBAC products POST como `sales`: **201** (ok)
- RBAC products POST como `client`: **403** (denegado esperado)
- RBAC services book como `client`: **201** (ok)
- RBAC services book como `vet`: **403** (denegado esperado)
- RBAC patch estado servicio como `vet`: **200** (ok)
- RBAC patch estado servicio como `client`: **403** (denegado esperado)
- RBAC adopcion create como `client`: **201** (ok)
- RBAC adopcion approve como `admin`: **200** (ok)
- RBAC adopcion approve como `sales`: **403** (denegado esperado)
- ABAC ofertas exclusivas como `client` adoptante: **200** (ok)
- ABAC ofertas exclusivas como `vet`: **403** (denegado esperado)

Conclusion dinamica:

- Las politicas RBAC/ABAC se comportan de acuerdo con el enunciado funcional.

## 7. Despliegue en Render + Supabase

Configuracion incluida:

- Infraestructura Render: `render.yaml`
- Guia operativa: `docs/deploy.md`
- Variables de entorno requeridas documentadas en `.env.example`

Estado de validacion:

- Flujo de despliegue documentado y listo.
- En local, endpoint `/health` responde correctamente.
- Para cierre final academico, se recomienda adjuntar URL publica de Render y captura de conexion activa a Supabase.

## 8. Gestion de secretos

Mecanismos definidos:

- Render Environment Variables (produccion)
- GitHub Secrets (CI/CD)
- Supabase project secrets

Buenas practicas aplicadas:

- Secretos fuera de repositorio
- `.env.example` sin credenciales reales
- Variables sensibles declaradas en documentacion de despliegue

Recomendacion operativa:

- Rotar cualquier secreto usado durante pruebas manuales
- No reutilizar secretos de desarrollo en produccion

## 9. Checklist de cumplimiento de la tarea

- [x] Aplicacion web con framework backend (Express)
- [x] Dominio de clinica veterinaria con tienda, servicios y adopciones
- [x] Roles: admin, clientela, veterinari@s, ventas
- [x] Ofertas exclusivas para clientela adoptante
- [x] OAuth 2
- [x] Autorizacion RBAC y ABAC
- [x] SAST (SonarQube)
- [x] RCA/SCA (OWASP Dependency Check)
- [x] DAST (OWASP ZAP)
- [x] Despliegue documentado en Render + Supabase
- [x] Gestion de secretos documentada
- [x] Documentacion de resultados en repositorio individual

## 10. Evidencias a adjuntar en el repo (entrega final)

Para dejar la entrega cerrada de forma evaluable, incluir en carpeta de evidencias:

1. Captura de login OAuth2 exitoso
2. Captura o log de prueba RBAC (200/403 por rol)
3. Captura o log de prueba ABAC (200/403 por atributo)
4. Reporte SonarQube
5. Reporte OWASP Dependency Check
6. Reporte OWASP ZAP
7. Captura de deploy en Render y estado de Supabase
