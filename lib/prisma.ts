import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let connectionString = process.env.POSTGRES_PRISMA_URL || '';

// Limpa a string de conexão para evitar conflitos de parâmetros SSL
if (connectionString.includes('sslmode=')) {
  // Remove sslmode=... e substitui por algo neutro, pois vamos configurar no objeto Pool
  connectionString = connectionString.replace(/sslmode=[^&]+/, 'sslmode=no-verify');
}

const pool = new Pool({ 
  connectionString,
  max: 10,
  ssl: {
    rejectUnauthorized: false // Aceita certificados do Supabase/Vercel
  }
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    // Deixando logs desativados em produção para evitar poluição
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
