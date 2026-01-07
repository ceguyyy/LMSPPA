import { NextResponse } from 'next/server';
import { settingsStore } from '@/lib/data';

export async function GET() {
    return NextResponse.json(settingsStore);
}

export async function POST(request: Request) {
    const body = await request.json();
    if (typeof body.preventSeeking === 'boolean') {
        settingsStore.preventSeeking = body.preventSeeking;
    }
    return NextResponse.json(settingsStore);
}
