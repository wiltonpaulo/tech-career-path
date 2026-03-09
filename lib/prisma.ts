import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Força a aceitação de certificados em desenvolvimento em nível global do processo
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

let connectionString = process.env.POSTGRES_PRISMA_URL || '';

// Remove parâmetros de SSL da string para evitar conflitos com a config do Pool
if (connectionString.includes('sslmode=')) {
  connectionString = connectionString.replace(/sslmode=[^&]+/, 'sslmode=no-verify');
}

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
    // log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
