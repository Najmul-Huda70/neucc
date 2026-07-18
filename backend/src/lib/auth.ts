import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { getDb } from "../db.js";

// Better Auth needs a live Db instance up front — since our connection
// is async, we bootstrap it once here and reuse it for every request.
const db = await getDb();

const trustedOrigins = (process.env.TRUSTED_ORIGINS || "http://localhost:3000")
  .split(",")
  .map((origin) => origin.trim());

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },

  // Extra fields collected at registration, stored on the user document.
  user: {
    additionalFields: {
      studentId: { type: "string", required: true },
      batch: { type: "string", required: true },
      role: { type: "string", required: false, defaultValue: "user" },
    },
  },

  plugins: [
    // Issues short-lived JWTs (jose under the hood) that the Next.js
    // proxy.ts can verify locally without calling this server.
    jwt({
      jwt: {
         expirationTime: "7d", 
        definePayload: ({ user }) => ({
          sub: user.id,
          role: (user as { role?: string }).role ?? "user",
        }),
      },
    }),
  ],

  advanced: {
    // Different domains for frontend/backend in production (Vercel + Railway)
    // means cookies must be sent cross-site.
    crossSubDomainCookies: { enabled: false },
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
    },
  },
});
