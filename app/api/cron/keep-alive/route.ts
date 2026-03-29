import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  
  // Vercel Cron envia automaticamente o CRON_SECRET como Bearer token
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Executa uma query simples para "acordar" o banco de dados
    const userCount = await prisma.user.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database keep-alive ping successful', 
      timestamp: new Date().toISOString(),
      userCount 
    });
  } catch (error: any) {
    console.error('Keep-alive cron error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
