import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import crypto from "node:crypto";
import { env } from "./env.js";
import { upsertUserFromOAuth } from "../data/repository.js";

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const googleConfigured = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_CALLBACK_URL
);

if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: env.GOOGLE_CALLBACK_URL
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const avatarUrl = profile.photos?.[0]?.value;
          const appUser = await upsertUserFromOAuth({
            id: profile.id,
            email,
            fullName: profile.displayName,
            avatarUrl,
            authProvider: "google",
            roles: ["client"]
          });
          done(null, appUser);
        } catch (err) {
          done(err, null);
        }
      }
    )
  );
}

export function isGoogleOAuthReady() {
  return googleConfigured;
}

export function createDevUserFromHeader(roles = ["client"]) {
  const normalizedRoles = Array.isArray(roles) ? roles : [roles];
  return {
    id: `dev-${crypto.randomUUID()}`,
    email: "dev-user@vetapp.local",
    roles: normalizedRoles,
    adoptedPetCount: normalizedRoles.includes("client") ? 1 : 0,
    city: "Madrid"
  };
}

export { passport };
