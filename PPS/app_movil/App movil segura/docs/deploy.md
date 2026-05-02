# Despliegue en Render + Supabase

## Supabase

1. Crear proyecto en Supabase.
2. Ejecutar script SQL de [sql/schema.sql](../sql/schema.sql).
3. Copiar `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`.

## Render

1. Conectar repositorio GitHub en Render.
2. Render detecta `render.yaml` automaticamente.
3. Configurar variables de entorno:
   - `SESSION_SECRET`
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `GOOGLE_CALLBACK_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_ORIGIN`
4. Deploy y validar endpoint `/health`.

## Flujo recomendado en Render

1. Crear primero el proyecto en Supabase y ejecutar el schema.
2. Crear el servicio web en Render.
3. Añadir todas las variables como secretos, nunca en el repositorio.
4. Configurar `APP_ORIGIN` con la URL publica de Render.
5. Registrar `GOOGLE_CALLBACK_URL` exacta en Google Cloud Console.
6. Probar `/auth/google?redirect=1` para confirmar el retorno al panel.

## OAuth2 en produccion

En Google Cloud Console:

1. Crear credenciales OAuth 2.0 Client ID.
2. Registrar callback URL de Render:
   - `https://TU-APP.onrender.com/auth/google/callback`
3. Guardar credenciales en secretos de Render.
4. Si recibes `Error 403: org_internal`, cambia el tipo de usuario de la pantalla de consentimiento a **External** y añade tu cuenta como test user mientras la app no este verificada.
