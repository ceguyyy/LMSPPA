import { NextResponse } from 'next/server';
import { selfLearningStore } from '@/lib/data';

export async function GET() {
    return NextResponse.json(selfLearningStore);
}
