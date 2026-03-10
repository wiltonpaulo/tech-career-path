import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Solução agressiva para o erro de self-signed certificate em ambientes serverless (Vercel)
// Isso instrui o Node.js a ignorar a validação da cadeia de certificados para TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

let connectionString = process.env.POSTGRES_PRISMA_URL || '';

// Configuração robusta do Pool para o driver 'pg'
const pool = new Pool({ 
  connectionString,
  max: 10,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
