'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Video } from '../types';
import { useLMS } from '../context/LMSContext';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
    video: Video;
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const { markComplete, getVideoProgress, updateProgress } = useLMS();
    const progress = getVideoProgress(video.id);

    const [currentQualityIndex, setCurrentQualityIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sessionWatchTime, setSessionWatchTime] = useState(0); // Time watched in this session logic could be complex, simplifying to "time elapsed since start" if continuous play?
    // Actually, simplest logic for "min duration" is tracking content time passed.
    // But reliable "watched" logic usually tracks intervals.
    // Let's rely on basic "currentTime" check vs "minDuration" for enabling the button,
    // BUT stricter logic would prevent seeking to the end.
    // For this MVP, let's track "max reached time" or just enforce they stay on page?
    // User Prompt says: "minimal duration to complete the video".
    // Interpretation: You can't click complete until you've actively watched X seconds.

    const [elapsedWatchTime, setElapsedWatchTime] = useState(0);
    const [canComplete, setCanComplete] = useState(false);

    useEffect(() => {
        // Reset when video changes
        setElapsedWatchTime(0);
        setCanComplete(false);
        if (videoRef.current) {
            videoRef.current.load();
        }
    }, [video.id, currentQualityIndex]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setElapsedWatchTime((prev) => {
                    const newVal = prev + 1;
                    if (newVal >= video.minDurationSeconds) {
                        setCanComplete(true);
                    }
                    return newVal;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, video.minDurationSeconds]);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const time = videoRef.current?.currentTime || 0;
        setCurrentQualityIndex(parseInt(e.target.value));
        // After render, we restore time.
        setTimeout(() => {
            if (videoRef.current) {
                videoRef.current.currentTime = time;
                if (isPlaying) videoRef.current.play();
            }
        }, 100);
    };

    const onComplete = () => {
        markComplete(video.id);
        alert('Video Completed!');
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.playerContainer}>
                <video
                    ref={videoRef}
                    className={styles.video}
                    src={video.qualities[currentQualityIndex].src}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onTimeUpdate={() => {
                        if (videoRef.current) {
                            updateProgress(video.id, videoRef.current.currentTime);
                        }
                    }}
                    controls
                />
            </div>

            <div className={`glass-panel ${styles.controls}`}>
                <div className="flex-between">
                    <h2 className="text-xl">{video.title}</h2>
                    <div className={styles.actions}>
                        <select
                            className={styles.qualitySelect}
                            value={currentQualityIndex}
                            onChange={handleQualityChange}
                        >
                            {video.qualities.map((q, idx) => (
                                <option key={idx} value={idx}>{q.label}</option>
                            ))}
                        </select>

                        <button
                            className={`btn ${progress?.completed ? 'btn-success' : 'btn-primary'}`}
                            onClick={onComplete}
                            disabled={!canComplete && !progress?.completed}
                        >
                            {progress?.completed ? 'Completed' : `Complete (${Math.max(0, video.minDurationSeconds - elapsedWatchTime)}s left)`}
                        </button>
                    </div>
                </div>
                <p className="text-secondary mt-4">{video.description}</p>
            </div>
        </div>
    );
}
