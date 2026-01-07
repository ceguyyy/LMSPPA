import { NextResponse } from 'next/server';
import { progressStore } from '@/lib/data';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    if (progressStore[id]) {
        return NextResponse.json(progressStore[id]);
    }
    return NextResponse.json({ message: 'not found' }, { status: 404 });
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id;
    const payload = await request.json();
    progressStore[id] = payload;
    return NextResponse.json({ ok: true });
}
