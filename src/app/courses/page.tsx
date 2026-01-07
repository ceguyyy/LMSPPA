'use client';

import React from 'react';
import Link from 'next/link';
import { useLMS } from '../../context/LMSContext';

export default function CoursesPage() {
    const { videos, progress } = useLMS();

    return (
        <div className="container">
            <div className="flex-between mb-4">
                <h1 className="text-2xl">Available Courses</h1>
                <Link href="/" className="btn btn-primary">Go Home</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {videos.map(v => {
                    const isCompleted = progress.find(p => p.videoId === v.id)?.completed;

                    return (
                        <div key={v.id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <div style={{ aspectRatio: '16/9', background: '#000', marginBottom: '1rem', borderRadius: '8px' }}>
                                {/* Placeholder for thumbnail */}
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
                                    Thumbnail
                                </div>
                            </div>
                            <h3 className="text-xl">{v.title}</h3>
                            <p className="text-secondary" style={{ flex: 1 }}>{v.description}</p>

                            <div className="flex-between mt-4">
                                <span className={`text-sm ${isCompleted ? 'text-success' : 'text-secondary'}`} style={{ color: isCompleted ? 'var(--success)' : '' }}>
                                    {isCompleted ? 'Completed' : 'Not Completed'}
                                </span>
                                <Link href={`/watch/${v.id}`} className="btn btn-primary">
                                    Watch Now
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
