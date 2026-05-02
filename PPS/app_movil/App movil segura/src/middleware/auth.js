import { verifyAccessToken } from "../utils/token.js";

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  return next();
}

function getBearerToken(headerValue) {
  if (!headerValue || typeof headerValue !== "string") return null;
  if (!headerValue.toLowerCase().startsWith("bearer ")) return null;
  return headerValue.slice(7).trim();
}

export function injectUser(req, _res, next) {
  const bearerToken = getBearerToken(req.headers.authorization);
  if (bearerToken) {
    const tokenUser = verifyAccessToken(bearerToken);
    if (tokenUser) {
      req.user = tokenUser;
      return next();
    }
  }

  req.user = req.session?.user || null;
  next();
}
