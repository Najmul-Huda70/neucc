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
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // Extra fields collected at registration, stored on the user document.
  user: {
    additionalFields: {
      studentId: { type: "string", required: false, defaultValue: "" },
      batch: { type: "string", required: false, defaultValue: "" },
      profileComplete: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      role: { type: "string", required: false, defaultValue: "user" },
    },
  },

  plugins: [
   jwt({
  jwt: {
    expirationTime: "7d",
    definePayload: ({ user }) => ({
      sub: user.id,
      role: (user as { role?: string }).role ?? "user",
      profileComplete: (user as { profileComplete?: boolean }).profileComplete ?? false,
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
