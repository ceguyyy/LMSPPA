import { NextResponse } from 'next/server';
import { lessonsStore } from '@/lib/data';

export async function GET() {
    return NextResponse.json(lessonsStore);
}

export async function POST(request: Request) {
    const newLesson = await request.json();

    if (!newLesson.id) {
        newLesson.id = 'lesson-' + Date.now();
    }

    const idx = lessonsStore.findIndex((l: any) => l.id === newLesson.id);
    if (idx >= 0) {
        lessonsStore[idx] = newLesson;
    } else {
        lessonsStore.push(newLesson);
    }

    return NextResponse.json({ ok: true, lesson: newLesson });
}
