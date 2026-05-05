import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";

// Custom adapter wrapper pour contourner le fait que NextAuth passe des Strings alors que Prisma attend un Int
const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  getUser: (id: string) => prisma.user.findUnique({ where: { id: Number(id) } }),
  getUserByAccount: (provider_providerAccountId: { providerAccountId: string, provider: string }) => 
    prisma.account.findUnique({
      where: { provider_providerAccountId },
      select: { user: true },
    }).then(res => res?.user ?? null),
  updateUser: (user: any) => prisma.user.update({ where: { id: Number(user.id) }, data: user }),
  // Les sessions et verify tokens ne posent pas problème car ils utilisent des ID string natives dans notre schema
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter as any,
  session: {
    strategy: "jwt",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "smtp.example.com",
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "user",
          pass: process.env.EMAIL_SERVER_PASSWORD || "pass",
        },
      },
      from: process.env.EMAIL_FROM || "noreply@capsule-manufacturing.com",
      // Custom sendVerificationRequest pour afficher le lien dans la console en phase de test (sans SMTP)
      async sendVerificationRequest({ identifier: email, url }) {
        console.log(`\n\n======================================================`);
        console.log(`✉️ EMAIL MAGIQUE ENVOYÉ À : ${email}`);
        console.log(`🔗 LIEN DE CONNEXION : \n${url}`);
        console.log(`======================================================\n\n`);
      }
    }),
    // Provider temporaire pour l'accès Admin immédiat
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
            return {
              ...user,
              id: user.id.toString(),
            };
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
        token.id = user.id.toString();
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
