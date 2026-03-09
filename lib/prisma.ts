import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Desativa verificação de TLS se não estiver em produção para evitar erros de self-signed
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

let connectionString = process.env.POSTGRES_PRISMA_URL || '';

// No Vercel/Supabase, garantir que o Pool aceite a conexão
const pool = new Pool({ 
  connectionString,
  max: 10,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false }
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
