'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Video } from '../types';

export default function AdminVideoForm() {
    const { addVideo } = useLMS();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [minDuration, setMinDuration] = useState(10);
    const [quality720, setQuality720] = useState('https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
    const [quality480, setQuality480] = useState('https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newVideo: Video = {
            id: Date.now().toString(),
            title,
            description: desc,
            minDurationSeconds: minDuration,
            qualities: [
                { label: '720p', src: quality720 },
                { label: '480p', src: quality480 }
            ]
        };
        addVideo(newVideo);
        alert('Video Added Successfully');
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="glass-panel">
            <h2 className="text-2xl mb-4">Add New Video</h2>

            <div className="mb-4">
                <label>Title</label>
                <input className="input-field" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>

            <div className="mb-4">
                <label>Description</label>
                <textarea className="input-field" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>

            <div className="mb-4">
                <label>Min Duration (seconds)</label>
                <input
                    type="number"
                    className="input-field"
                    value={minDuration}
                    onChange={e => setMinDuration(Number(e.target.value))}
                />
            </div>

            <div className="grid-cols-2 mb-4">
                <div>
                    <label>720p URL</label>
                    <input className="input-field" value={quality720} onChange={e => setQuality720(e.target.value)} required />
                </div>
                <div>
                    <label>480p URL</label>
                    <input className="input-field" value={quality480} onChange={e => setQuality480(e.target.value)} required />
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Add Video</button>
        </form>
    );
}
