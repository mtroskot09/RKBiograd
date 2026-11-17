import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import connectPg from "connect-pg-simple";
import type { Express, RequestHandler } from "express";
import { pool } from "./db";
import { storage } from "./storage";

// Admin login with Google (OpenID Connect).
//
// Required in production:
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET  – OAuth client from Google Cloud Console
//   ADMIN_EMAILS                            – comma-separated Google accounts allowed into the admin panel
//   SESSION_SECRET                          – random string used to sign the session cookie
//   PUBLIC_URL                              – e.g. https://rkbiograd.hr (on Render RENDER_EXTERNAL_URL is used if unset)
// The Google redirect URI must be <PUBLIC_URL>/api/callback.
//
// Without GOOGLE_CLIENT_ID (local development only) login is disabled and every
// request acts as a local admin.

const isLocalDev = !process.env.GOOGLE_CLIENT_ID;
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 1 week
const GOOGLE_ISSUER = new URL("https://accounts.google.com");
// Shown when someone logs in with an account that is not on the admin list (or the login fails).
const ACCESS_DENIED_PATH = "/pristup-odbijen";

const localDevUser = {
  claims: {
    sub: "local-dev-admin",
    email: "admin@localhost",
    first_name: "Local",
    last_name: "Admin",
  },
};

// Anyone with a Google account can sign in, so only these emails get admin access.
const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

const isAdminEmail = (email: unknown) =>
  typeof email === "string" && adminEmails.has(email.trim().toLowerCase());

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} must be set`);
  }
  return value;
}

async function upsertUser(claims: Record<string, any>) {
  await storage.upsertUser({
    id: claims.sub,
    email: claims.email,
    firstName: claims.first_name,
    lastName: claims.last_name,
    profileImageUrl: claims.profile_image_url,
  });
}

async function setupLocalDevAuth(app: Express) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("GOOGLE_CLIENT_ID must be set in production (admin login)");
  }
  console.warn("GOOGLE_CLIENT_ID not set: auth disabled, all requests act as a local admin");

  await upsertUser(localDevUser.claims);

  app.use((req, _res, next) => {
    req.user = localDevUser;
    next();
  });

  app.get("/api/login", (_req, res) => res.redirect("/admin"));
  app.get("/api/logout", (_req, res) => res.redirect("/"));
}

function getSession() {
  if (!pool) {
    throw new Error("DATABASE_URL must be set (sessions are stored in Postgres)");
  }
  const PgStore = connectPg(session);
  return session({
    secret: requireEnv("SESSION_SECRET"),
    // The "sessions" table is created by `npm run db:push` (see shared/schema.ts).
    store: new PgStore({ pool, tableName: "sessions", createTableIfMissing: false, ttl: SESSION_TTL_MS / 1000 }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "lax", // the browser must send the cookie when Google redirects back
      maxAge: SESSION_TTL_MS,
    },
  });
}

export async function setupAuth(app: Express) {
  if (isLocalDev) {
    return setupLocalDevAuth(app);
  }

  // `||` so an empty PUBLIC_URL (left blank in the Render dashboard) falls back to Render's address.
  const publicUrl = (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || "").replace(/\/+$/, "");
  if (!publicUrl) {
    throw new Error("PUBLIC_URL must be set (e.g. https://rkbiograd.onrender.com)");
  }
  if (adminEmails.size === 0) {
    console.warn("ADMIN_EMAILS is not set: nobody can log in to the admin panel");
  }

  // Behind Render's (or any) HTTPS proxy: needed for secure cookies and the correct protocol.
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  const config = await client.discovery(
    GOOGLE_ISSUER,
    requireEnv("GOOGLE_CLIENT_ID"),
    requireEnv("GOOGLE_CLIENT_SECRET"),
  );

  const verify: VerifyFunction = async (tokens, verified) => {
    const claims: Record<string, any> = tokens.claims() ?? {};
    const email = claims.email;
    if (claims.email_verified !== true || !isAdminEmail(email)) {
      console.warn(`Admin login refused for ${email ?? "an account without email"}`);
      return verified(null, false);
    }
    // Only the identity is kept in the session; Google's tokens are not needed after login.
    const user = {
      claims: {
        sub: `google:${claims.sub}`,
        email,
        first_name: claims.given_name,
        last_name: claims.family_name,
        profile_image_url: claims.picture,
      },
    };
    await upsertUser(user.claims);
    verified(null, user);
  };

  passport.use(
    "google",
    new Strategy(
      {
        config,
        scope: "openid email profile",
        callbackURL: `${publicUrl}/api/callback`,
      },
      verify,
    ),
  );

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", passport.authenticate("google", { prompt: "select_account" } as passport.AuthenticateOptions));

  app.get(
    "/api/callback",
    passport.authenticate("google", {
      successReturnToOrRedirect: "/admin",
      failureRedirect: ACCESS_DENIED_PATH,
    }),
  );

  app.get("/api/logout", (req, res, next) => {
    req.logout((error) => {
      if (error) return next(error);
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/");
      });
    });
  });
}

// Checked on every admin request, so removing someone from ADMIN_EMAILS takes effect at once.
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (isLocalDev) {
    return next();
  }
  const user = req.user as any;
  if (!req.isAuthenticated() || !isAdminEmail(user?.claims?.email)) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
