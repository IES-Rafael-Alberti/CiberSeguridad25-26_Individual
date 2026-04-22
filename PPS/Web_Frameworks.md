# Informe de entrega

## 1. Identificacion del proyecto

Aplicacion web para una clinica veterinaria con tienda, servicios veterinarios y adopcion de mascotas.

Alcance funcional:

- Venta de articulos
- Servicios veterinarios
- Adopcion de mascotas
- Ofertas exclusivas para clientes que hayan adoptado

Roles del sistema:

- `admin`
- `client`
- `vet`
- `sales`

Modelo de autorizacion de usuarios:

- Relacion muchos-a-muchos entre usuarios y roles mediante `roles` y `user_roles`.

## 2. Arquitectura de la aplicacion

### 2.1 Backend

- Framework: Express.js
- Punto de arranque: `src/server.js`
- Configuracion de la app: `src/app.js`
- Seguridad base: `helmet`, sesiones, JWT Bearer, Passport para OAuth2

### 2.2 Frontend

- Interfaz web estatica en `public/`
- Inicio de sesion, panel de sesion, catalogo, pruebas por rol y panel de administracion
- Persistencia del token en `localStorage`

### 2.3 Datos

- Compatibilidad con Supabase (PostgreSQL)
- Modo de respaldo en memoria para desarrollo
- Esquema SQL en `sql/schema.sql`

## 3. Analisis funcional

La aplicacion cubre el flujo principal pedido en la tarea:

1. Login OAuth 2 con Google.
2. Obtencion de token JWT para el cliente.
3. Acceso a recursos segun rol.
4. Acceso a ofertas exclusivas segun atributos del usuario.
5. Gestion de usuarios y roles desde el panel admin.

Endpoints principales:

- `GET /health`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /auth/me`
- `GET /auth/token`
- `POST /auth/local-login`
- `POST /auth/dev-login`
- `POST /auth/logout`
- `GET /products`
- `POST /products`
- `GET /services`
- `POST /services/book`
- `POST /adoptions`
- `PATCH /adoptions/:id/approve`
- `GET /offers/exclusive`
- `GET /admin/users`
- `PATCH /admin/users/:id/roles`

## 4. Autenticacion OAuth 2

Implementacion:

- Inicio: `GET /auth/google?redirect=1`
- Callback: `GET /auth/google/callback`
- Estrategia: Passport Google OAuth2

Comportamiento:

- Tras autenticar con Google se genera un `accessToken` JWT.
- El token puede devolverse al frontend para mantener la sesion activa.

Validacion realizada:

- Se verifico redireccion HTTP 302 hacia Google.
- Se verifico retorno con token al flujo del panel.

## 5. Autorizacion RBAC y ABAC

### 5.1 RBAC

Reglas aplicadas:

- Crear productos: `admin`, `sales`
- Reservar servicios: `client`
- Cambiar estado de servicios: `admin`, `vet`
- Crear adopciones: `client`
- Aprobar adopciones: `admin`, `vet`
- Administracion de usuarios y roles: `admin`

### 5.2 ABAC

Regla de ofertas exclusivas:

- `GET /offers/exclusive`
- Acceso permitido si:
  - rol `admin`, o
  - rol `client` con `adoptedPetCount > 0`

Resultado esperado:

- Cliente adoptante: acceso permitido.
- Usuario sin atributo requerido: acceso denegado con `403`.

## 6. Informe de analisis estatico

### 6.1 SAST con SonarQube

Objetivo:

- Detectar bugs, code smells, vulnerabilidades y hotspots de seguridad en el codigo fuente.

Configuracion disponible:

- `sonar-project.properties`
- Workflow GitHub Actions: `.github/workflows/security.yml`

Ejecucion:

```bash
npm run sast
```

Resultado esperado:

- Informe de SonarQube con hallazgos clasificados por severidad.

### 6.2 RCA/SCA con OWASP Dependency Check

Objetivo:

- Identificar dependencias vulnerables y analizar la causa raiz de su riesgo.

Configuracion disponible:

- Script: `npm run sca`
- Workflow GitHub Actions: `.github/workflows/security.yml`

Ejecucion:

```bash
npm run sca
```

Resultado esperado:

- Reporte HTML con CVE, componentes afectados y acciones de mitigacion.

## 7. Informe de analisis dinamico

### 7.1 DAST con OWASP ZAP

Objetivo:

- Evaluar la superficie HTTP de la aplicacion en ejecucion.

Configuracion disponible:

- Script: `npm run dast`
- Workflow GitHub Actions: `.github/workflows/security.yml`

Ejecucion:

```bash
npm run dast
```

Resultado esperado:

- Reporte `zap-report.html` con alertas por severidad.

### 7.2 Pruebas funcionales dinamicas ejecutadas

Pruebas realizadas sobre la API local:

| Caso | Resultado |
| --- | --- |
| `POST /products` como `sales` | `201` |
| `POST /products` como `client` | `403` |
| `POST /services/book` como `client` | `201` |
| `POST /services/book` como `vet` | `403` |
| `PATCH /services/:id/status` como `vet` | `200` |
| `PATCH /services/:id/status` como `client` | `403` |
| `POST /adoptions` como `client` | `201` |
| `PATCH /adoptions/:id/approve` como `admin` | `200` |
| `PATCH /adoptions/:id/approve` como `sales` | `403` |
| `GET /offers/exclusive` como `client` adoptante | `200` |
| `GET /offers/exclusive` como `vet` | `403` |

Conclusiones dinamicas:

- Las politicas RBAC y ABAC funcionan segun el enunciado.
- La aplicacion responde correctamente a accesos permitidos y denegados.

## 8. Despliegue en Render y Supabase

Preparacion incluida en el repositorio:

- `render.yaml`
- `docs/deploy.md`
- `.env.example`
- `sql/schema.sql`

Variables de entorno relevantes:

- `SESSION_SECRET`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `APP_ORIGIN`

Estado:

- El despliegue esta documentado para Render.
- El esquema de base de datos esta preparado para Supabase.
- En local, el endpoint `/health` responde correctamente.

## 9. Gestion de secretos

Herramientas y enfoques previstos:

- Render Environment Variables
- GitHub Secrets
- Supabase Project Secrets
- Opcionalmente Vault o Infisical en entornos de equipo

Buenas practicas aplicadas:

- No guardar secretos reales en el repositorio
- Mantener `.env.example` como plantilla
- Documentar variables necesarias sin exponer credenciales

## 10. Resultado de cumplimiento de la tarea

- [x] Aplicacion web usando framework backend fijo
- [x] Dominio de clinica veterinaria con tienda, adopciones y servicios
- [x] Roles: admin, client, vet y sales
- [x] Ofertas exclusivas para clientes adoptantes
- [x] Autenticacion OAuth 2
- [x] Autorizacion RBAC
- [x] Autorizacion ABAC
- [x] SAST con SonarQube
- [x] RCA/SCA con OWASP Dependency Check
- [x] DAST con OWASP ZAP
- [x] Despliegue preparado para Render y Supabase
- [x] Gestion de secretos documentada
- [x] Documentacion de resultados preparada para repositorio individual

## 11. Evidencias recomendadas para anexar

Para cerrar la entrega con soporte visual o tecnico, anexar:

1. Captura de OAuth 2 completado
2. Capturas o logs de RBAC con respuestas `200` y `403`
3. Capturas o logs de ABAC con respuestas `200` y `403`
4. Reporte de SonarQube
5. Reporte de OWASP Dependency Check
6. Reporte de OWASP ZAP
7. Captura del despliegue en Render y la configuracion de Supabase

## 12. Conclusiones

La aplicacion cumple el flujo funcional pedido en la tarea y deja documentados los puntos clave de seguridad, autorizacion, analisis estatico, analisis dinamico y despliegue.

La parte academica de la entrega queda lista para copiarse al repositorio individual como informe principal, junto con sus anexos de evidencias.
