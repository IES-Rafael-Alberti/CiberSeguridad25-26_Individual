import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const TOKEN_ISSUER = "vet-framework-app";
const TOKEN_AUDIENCE = "vet-framework-client";

export function issueAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      roles: Array.isArray(user.roles) ? user.roles : [],
      adoptedPetCount: user.adoptedPetCount || 0,
      city: user.city || ""
    },
    env.JWT_SECRET,
    {
      expiresIn: env.ACCESS_TOKEN_TTL,
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE
    }
  );
}

export function verifyAccessToken(token) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, {
      issuer: TOKEN_ISSUER,
      audience: TOKEN_AUDIENCE
    });

    return {
      id: payload.sub,
      email: payload.email,
      roles: Array.isArray(payload.roles) ? payload.roles : [],
      adoptedPetCount: payload.adoptedPetCount || 0,
      city: payload.city || ""
    };
  } catch (_err) {
    return null;
  }
}
