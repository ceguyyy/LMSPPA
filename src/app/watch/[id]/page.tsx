'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLMS } from '../../../context/LMSContext';
import VideoPlayer from '../../../components/VideoPlayer';

export default function WatchPage() {
    const params = useParams();
    const router = useRouter();
    const { videos } = useLMS();

    const videoId = params.id as string;
    const video = videos.find(v => v.id === videoId);

    if (!video) {
        return (
            <div className="container">
                <h1>Video not found</h1>
                <button onClick={() => router.push('/courses')} className="btn btn-primary">Back to Courses</button>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="mb-4">
                <Link href="/courses" style={{ color: 'var(--accent-color)' }}>← Back to List</Link>
            </div>
            <VideoPlayer video={video} />
        </div>
    );
}
