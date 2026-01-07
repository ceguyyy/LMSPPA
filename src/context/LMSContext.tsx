'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Video, UserProgress } from '../types';

interface LMSContextType {
    videos: Video[];
    progress: UserProgress[];
    addVideo: (video: Video) => void;
    markComplete: (videoId: string) => void;
    updateProgress: (videoId: string, seconds: number) => void;
    getVideoProgress: (videoId: string) => UserProgress | undefined;
}

const LMSContext = createContext<LMSContextType | undefined>(undefined);

export const useLMS = () => {
    const context = useContext(LMSContext);
    if (!context) {
        throw new Error('useLMS must be used within an LMSProvider');
    }
    return context;
};

// Initial Mock Data
const INITIAL_VIDEOS: Video[] = [
    {
        id: '1',
        title: 'Introduction to React',
        description: 'Learn the basics of React components and state.',
        minDurationSeconds: 5, // Short for testing
        qualities: [
            { label: '720p', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
            { label: '480p', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }, // Just using diff videos to simulate quality change visual
        ],
    },
];

export const LMSProvider = ({ children }: { children: React.ReactNode }) => {
    const [videos, setVideos] = useState<Video[]>([]);
    const [progress, setProgress] = useState<UserProgress[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const storedVideos = localStorage.getItem('lms_videos');
        const storedProgress = localStorage.getItem('lms_progress');

        if (storedVideos) {
            setVideos(JSON.parse(storedVideos));
        } else {
            setVideos(INITIAL_VIDEOS);
        }

        if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
        }
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (videos.length > 0) localStorage.setItem('lms_videos', JSON.stringify(videos));
    }, [videos]);

    useEffect(() => {
        if (progress.length > 0) localStorage.setItem('lms_progress', JSON.stringify(progress));
    }, [progress]);

    const addVideo = (video: Video) => {
        setVideos((prev) => [...prev, video]);
    };

    const markComplete = (videoId: string) => {
        setProgress((prev) => {
            const existing = prev.find((p) => p.videoId === videoId);
            if (existing) {
                return prev.map((p) => (p.videoId === videoId ? { ...p, completed: true } : p));
            }
            return [...prev, { videoId, completed: true, watchedSeconds: 0 }];
        });
    };

    const updateProgress = (videoId: string, seconds: number) => {
        setProgress((prev) => {
            const existing = prev.find((p) => p.videoId === videoId);
            if (existing) {
                // Keep max watched time or just current? Let's track max watched for now or just current position?
                // Usually LMS tracks "furthest watched".
                // Here we just track "last known position" for resume, but for completion logic we rely on active watching.
                return prev.map((p) => (p.videoId === videoId ? { ...p, watchedSeconds: seconds } : p));
            }
            return [...prev, { videoId, completed: false, watchedSeconds: seconds }];
        });
    };

    const getVideoProgress = (videoId: string) => {
        return progress.find((p) => p.videoId === videoId);
    };

    return (
        <LMSContext.Provider value={{ videos, progress, addVideo, markComplete, updateProgress, getVideoProgress }}>
            {children}
        </LMSContext.Provider>
    );
};
