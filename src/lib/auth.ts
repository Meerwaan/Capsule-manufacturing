import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
// import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    /* 
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    */
    // Provider temporaire pour l'accès Admin immédiat (en attendant SMTP)
    {
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Tentative de connexion admin:", credentials?.email);
        if (credentials?.email === "merwanlaouini@gmail.com" && credentials?.password === "admin123") {
          try {
            let user = await prisma.user.findUnique({ where: { email: credentials.email } });
            if (!user) {
              console.log("Création du premier compte admin...");
              user = await prisma.user.create({
                data: {
                  email: credentials.email,
                  role: "ADMIN",
                  name: "Merwan Admin",
                  brandName: "CAPSULE HQ",
                  password: "ADMIN_PROTECTED", // Placeholder car on utilise authorize
                },
              });
            }
            console.log("Connexion admin réussie pour:", user.email);
            return user;
          } catch (error) {
            console.error("Erreur Prisma lors de la connexion admin:", error);
            throw new Error("Erreur base de données");
          }
        }
        console.warn("Échec de connexion: identifiants incorrects.");
        return null;
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.id = user.id;
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-request",
  },
};
