import { Router } from "express";
import { passport, isGoogleOAuthReady, createDevUserFromHeader } from "../config/passport.js";
import { requireAuth } from "../middleware/auth.js";
import { issueAccessToken } from "../utils/token.js";
import { env } from "../config/env.js";
import { upsertUserFromOAuth } from "../data/repository.js";

const localTestAccounts = [
  {
    id: "local-admin",
    email: "admin@vetapp.local",
    password: "Admin123!",
    fullName: "Administrador VetCare",
    roles: ["admin"],
    adoptedPetCount: 0,
    city: "Madrid"
  },
  {
    id: "local-client",
    email: "cliente@vetapp.local",
    password: "Client123!",
    fullName: "Cliente VetCare",
    roles: ["client"],
    adoptedPetCount: 1,
    city: "Valencia"
  },
  {
    id: "local-vet",
    email: "vet@vetapp.local",
    password: "Vet123!",
    fullName: "Veterinaria VetCare",
    roles: ["vet"],
    adoptedPetCount: 0,
    city: "Sevilla"
  },
  {
    id: "local-sales",
    email: "ventas@vetapp.local",
    password: "Sales123!",
    fullName: "Ventas VetCare",
    roles: ["sales"],
    adoptedPetCount: 0,
    city: "Bilbao"
  }
];

function renderOAuthSuccessPage({ user, accessToken, redirectUrl }) {
  return `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0b1324" />
        <title>Autenticación completada | VetCare One</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>
          :root { color-scheme: dark; }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Inter, Segoe UI, sans-serif;
            background:
              radial-gradient(circle at top left, rgba(122, 167, 255, 0.18), transparent 28%),
              radial-gradient(circle at top right, rgba(126, 230, 192, 0.16), transparent 22%),
              linear-gradient(160deg, #08111f 0%, #0b1730 45%, #101f3d 100%);
            color: #edf4ff;
            padding: 24px;
          }
          .card {
            width: min(920px, 100%);
            background: rgba(9, 17, 31, 0.82);
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 28px;
            box-shadow: 0 24px 60px rgba(0,0,0,0.35);
            backdrop-filter: blur(18px);
            padding: 28px;
          }
          .topline {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            align-items: start;
            flex-wrap: wrap;
          }
          .badge {
            display: inline-block;
            padding: 8px 12px;
            border-radius: 999px;
            background: rgba(126, 230, 192, 0.12);
            color: #dffcf1;
            border: 1px solid rgba(126, 230, 192, 0.25);
            font-size: 0.82rem;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 14px;
          }
          h1 { margin: 0 0 10px; font-size: clamp(2rem, 4vw, 3.6rem); line-height: 1.05; max-width: 12ch; }
          p { color: #a9b9d0; line-height: 1.7; }
          .grid { display: grid; gap: 16px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 24px; }
          .panel {
            background: rgba(255,255,255,0.04);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 20px;
            padding: 18px;
          }
          .label { color: #7ee6c0; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.75rem; font-weight: 700; }
          pre {
            margin: 0;
            padding: 16px;
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.08);
            border-radius: 16px;
            white-space: pre-wrap;
            word-break: break-word;
            color: #edf4ff;
          }
          .actions { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 20px; }
          a {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 14px 18px;
            border-radius: 16px;
            text-decoration: none;
            font-weight: 700;
          }
          .primary { background: linear-gradient(135deg, #7ee6c0 0%, #7aa7ff 100%); color: #07121f; }
          .secondary { background: rgba(255,255,255,0.06); color: #edf4ff; border: 1px solid rgba(255,255,255,0.1); }
          .muted { color: #a9b9d0; }
          .stack { display: grid; gap: 12px; }
          @media (max-width: 760px) {
            .grid { grid-template-columns: 1fr; }
          }
        </style>
      </head>
      <body>
        <main class="card">
          <div class="badge">OAuth 2 completado</div>
          <div class="topline">
            <div>
              <h1>Sesión iniciada correctamente</h1>
              <p>Tu cuenta ya está autenticada. El token JWT quedó emitido para usarlo en el cliente y en las pruebas protegidas.</p>
            </div>
            <div class="stack">
              <div class="panel">
                <div class="label">Usuario</div>
                <p class="muted" style="margin-bottom:0">${user.email}</p>
              </div>
              <div class="panel">
                <div class="label">Roles</div>
                <p class="muted" style="margin-bottom:0">${(user.roles || []).join(", ")}</p>
              </div>
            </div>
          </div>

          <div class="grid">
            <section class="panel">
              <div class="label">Token de acceso</div>
              <pre>${accessToken}</pre>
            </section>
            <section class="panel">
              <div class="label">Siguiente paso</div>
              <p>Abre el panel principal para ver tu sesión y probar productos, servicios, adopciones y ofertas exclusivas.</p>
              <div class="actions">
                <a class="primary" href="${redirectUrl}">Ir al panel</a>
                <a class="secondary" href="/">Ir a la home</a>
              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  `;
}

const router = Router();

router.get("/google", (req, res, next) => {
  if (!isGoogleOAuthReady()) {
    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>OAuth2 no configurado</title>
          <style>
            body { font-family: Segoe UI, sans-serif; background: #f6fbff; color: #0d2a3b; margin: 0; padding: 2rem; }
            .card { max-width: 760px; margin: 2rem auto; background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
            code, pre { background: #eef6ff; padding: .2rem .45rem; border-radius: 6px; }
            button { background: #0b5cab; color: white; border: 0; border-radius: 10px; padding: .85rem 1.1rem; cursor: pointer; font-size: 1rem; }
            button:hover { background: #094a8a; }
            form { margin: 1rem 0; }
            .muted { color: #4d6477; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>OAuth2 de Google no configurado</h1>
            <p class="muted">Faltan las variables <code>GOOGLE_CLIENT_ID</code>, <code>GOOGLE_CLIENT_SECRET</code> o <code>GOOGLE_CALLBACK_URL</code>.</p>
            <p>Mientras lo configuras, puedes seguir probando la web con el login de desarrollo.</p>
            <form method="POST" action="/auth/dev-login">
              <input type="hidden" name="role" value="client" />
              <input type="hidden" name="responseMode" value="html" />
              <button type="submit">Entrar como cliente de prueba</button>
            </form>
            <p class="muted">Esto crea una sesion local y devuelve un token Bearer util para las pruebas.</p>
            <h2>Variables necesarias</h2>
            <pre>GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback</pre>
          </div>
        </body>
      </html>
    `);
  }

  const shouldRedirect = req.query?.redirect === "1";
  req.session.oauthReturnToPanel = shouldRedirect;
  req.session.save(() => {
    return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  });
});

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!isGoogleOAuthReady()) {
      return res.status(503).json({ error: "OAuth2 Google no configurado" });
    }
    return next();
  },
  passport.authenticate("google", { failureRedirect: "/auth/failure", session: false }),
  (req, res) => {
    req.session.user = req.user;
    const accessToken = issueAccessToken(req.user);

    const shouldRedirect = req.session.oauthReturnToPanel === true;
    req.session.oauthReturnToPanel = false;
    const redirectUrl = `${env.APP_ORIGIN}/?token=${encodeURIComponent(accessToken)}`;

    if (shouldRedirect) {
      return res.redirect(redirectUrl);
    }

    return res.status(200).send(
      renderOAuthSuccessPage({
        user: req.user,
        accessToken,
        redirectUrl
      })
    );
  }
);

router.get("/failure", (_req, res) => {
  res.status(401).json({ error: "Autenticacion OAuth2 fallida" });
});

router.post("/dev-login", (req, res) => {
  const requestedRoles = Array.isArray(req.body?.roles)
    ? req.body.roles
    : req.body?.roles
      ? [req.body.roles]
      : req.body?.role
        ? [req.body.role]
        : ["client"];
  req.session.user = createDevUserFromHeader(requestedRoles);
  const accessToken = issueAccessToken(req.session.user);

  if (String(req.body?.responseMode).toLowerCase() === "html") {
    return res.status(200).send(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Login de prueba completado</title>
          <style>
            body { font-family: Segoe UI, sans-serif; background: #f6fbff; color: #0d2a3b; margin: 0; padding: 2rem; }
            .card { max-width: 760px; margin: 2rem auto; background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 10px 30px rgba(0,0,0,.08); }
            code, pre { background: #eef6ff; padding: .2rem .45rem; border-radius: 6px; word-break: break-all; }
            a { color: #0b5cab; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>Login de prueba completado</h1>
            <p>Token recibido por el cliente:</p>
            <pre>${accessToken}</pre>
            <p><strong>Roles:</strong> ${req.session.user.roles.join(", ")}</p>
            <p><a href="/">Volver a la web</a></p>
          </div>
        </body>
      </html>
    `);
  }

  res.json({
    message: "Sesion de desarrollo iniciada",
    tokenType: "Bearer",
    accessToken,
    expiresIn: env.ACCESS_TOKEN_TTL,
    user: req.session.user
  });
});

router.post("/local-login", async (req, res) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");

  const account = localTestAccounts.find(
    (entry) => entry.email.toLowerCase() === email && entry.password === password
  );

  if (!account) {
    return res.status(401).json({ error: "Credenciales invalidas" });
  }

  const user = await upsertUserFromOAuth({
    id: account.id,
    email: account.email,
    fullName: account.fullName,
    avatarUrl: "",
    authProvider: "local",
    roles: account.roles,
    adoptedPetCount: account.adoptedPetCount,
    city: account.city
  });

  req.session.user = user;
  const accessToken = issueAccessToken(user);

  return res.json({
    message: "Sesion local iniciada",
    tokenType: "Bearer",
    accessToken,
    expiresIn: env.ACCESS_TOKEN_TTL,
    user
  });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get("/token", requireAuth, (req, res) => {
  const accessToken = issueAccessToken(req.user);
  res.json({
    tokenType: "Bearer",
    accessToken,
    expiresIn: env.ACCESS_TOKEN_TTL
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Sesion cerrada" });
  });
});

export default router;
