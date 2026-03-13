import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Cascade deletes the associated report due to schema onDelete: Cascade
    await prisma.assessment.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json({ error: 'Failed to delete assessment' }, { status: 500 });
  }
}
