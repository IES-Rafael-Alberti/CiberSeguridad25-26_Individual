# Veterinary Framework App

Aplicacion web de referencia para una clinica veterinaria con:

- tienda de articulos
- servicios veterinarios
- adopcion de mascotas
- ofertas exclusivas para clientes adoptantes

Framework backend usado: **Express.js**.

## Funcionalidades implementadas

1. OAuth 2.0
2. Autorizacion RBAC
3. Autorizacion ABAC
4. Integracion con Supabase
5. Pipeline de seguridad (SAST, SCA/RCA, DAST)
6. Preparado para deploy en Render

Importante: tras el callback OAuth2, el backend devuelve un `accessToken` JWT al cliente.

## Roles

- `admin`: control total
- `client`: compra y solicita adopcion/servicios
- `vet`: aprueba adopciones y gestiona servicios
- `sales`: gestiona articulos/ofertas de tienda

Modelo de roles: **muchos-a-muchos**.

- Un usuario puede tener varios roles simultaneos.
- Un rol puede pertenecer a multiples usuarios.
- Implementado con tablas `roles` y `user_roles`.

## Reglas de autorizacion

### RBAC

- Crear productos: `admin`, `sales`
- Aprobar adopciones: `admin`, `vet`
- Cambiar estado de servicios: `admin`, `vet`
- Reservar servicios: `client`

La evaluacion RBAC se realiza contra el arreglo `user.roles`.

### ABAC

Endpoint: `GET /offers/exclusive`

Acceso permitido si:

- rol `admin`, o
- rol `client` con `adoptedPetCount > 0`

Esto implementa la condicion de ofertas exclusivas para quienes adoptan mascotas.

## Tecnologias

- Node.js + Express
- Passport (Google OAuth2)
- Supabase (PostgreSQL)
- Helmet, session, Zod

## Ejecucion local

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Crear entorno:
   ```bash
   copy .env.example .env
   ```
3. Configurar variables requeridas en `.env`.
4. Ejecutar:
   ```bash
   npm run dev
   ```
5. Abrir:
   - `http://localhost:3000`

## Configuracion OAuth 2 con Google

Para que el login con Google funcione de verdad necesitas estas variables:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback` en local

En Google Cloud Console debes registrar exactamente esa URL de callback en las credenciales OAuth.

En produccion con Render:

- `GOOGLE_CALLBACK_URL=https://TU-APP.onrender.com/auth/google/callback`
- `APP_ORIGIN=https://TU-APP.onrender.com`

El boton principal de la home usa `GET /auth/google?redirect=1`, inicia sesion con Google y vuelve al panel mostrando el token JWT.

## Endpoints principales

- `GET /health`
- `GET /auth/google`
- `GET /auth/google/callback` (respuesta JSON con `accessToken`)
- `GET /auth/me`
- `GET /auth/token` (renueva token para usuario autenticado)
- `POST /auth/dev-login`
- `POST /auth/logout`
- `GET /products`
- `POST /products`
- `GET /services`
- `POST /services/book`
- `POST /adoptions`
- `PATCH /adoptions/:id/approve`
- `GET /offers/exclusive`

## Uso del token en cliente

Despues de autenticar, usa el valor `accessToken` en cada peticion protegida:

```bash
curl -H "Authorization: Bearer TU_ACCESS_TOKEN" http://localhost:3000/auth/me
```

Para frontend, si prefieres redireccion, puedes usar:

- `GET /auth/google?redirect=1`

Flujo recomendado:

1. El usuario pulsa el boton `OAuth 2 Google`.
2. Google autentica y vuelve al callback de la app.
3. El callback muestra una pantalla de exito con el token JWT y un boton `Ir al panel`.
4. Si usas el modo `?redirect=1`, el callback redirecciona a `APP_ORIGIN` con `?token=...`.
5. La home detecta ese token, lo guarda en `localStorage` y deja la sesion lista para probar endpoints.

## Base de datos

Ejecutar script en Supabase SQL editor:

- `sql/schema.sql`

Incluye tablas para relacion muchos-a-muchos de roles:

- `profiles`
- `roles`
- `user_roles`

Opcionalmente, insertar datos iniciales:

```bash
npm run seed
```

## Seguridad

Ver detalle en:

- [Análisis de Seguridad General](docs/security.md)
- [Herramientas de Análisis Mobile (SAST/DAST)](docs/security_tools.md)
- [Informe OWASP Mobile Top 10](docs/mobile_owasp_report.md)

## Aplicación Móvil (Ionic)

Ubicada en la carpeta `mobile-app/`, esta aplicación complementa el sistema para clientes.

### Funcionalidades
- Tienda de artículos.
- Reserva de servicios veterinarios.
- Acceso a ofertas exclusivas para adoptantes (ABAC).

### Ejecución
1. `cd mobile-app`
2. `npm install`
3. `npm run dev` (Requiere el backend en el puerto 3000)

## Comandos de Seguridad

```bash
npm run sast
npm run sca
npm run dast
```

## Despliegue

Guia completa:

- `docs/deploy.md`

Archivo de infraestructura para Render:

- `render.yaml`

## Nota academica

Para facilitar pruebas locales existe `POST /auth/dev-login`; en produccion usa OAuth2 real y elimina accesos de desarrollo.

## Problemas comunes

- Si aparece `OAuth2 de Google no configurado`, faltan las credenciales en `.env`.
- Si Google rechaza el callback, revisa que la URL registrada coincida al 100% con `GOOGLE_CALLBACK_URL`.
- Si el navegador muestra `ERR_CONNECTION_REFUSED`, asegúrate de tener `npm run dev` activo en la terminal.
- Si aparece `Error 403: org_internal`, tu credencial OAuth esta configurada como **Internal** en Google Cloud y tu cuenta no pertenece a esa organizacion. Cambia la pantalla de consentimiento a **External** o usa una cuenta de Workspace de esa organizacion.
