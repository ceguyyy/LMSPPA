"use client";

import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, RotateCcw, MonitorPlay, SkipForward, SkipBack } from 'lucide-react';

interface CoursePlayerProps {
    lesson: any;
    onComplete: () => void;
    onNext: () => void;
}

export default function CoursePlayer({ lesson, onComplete, onNext }: CoursePlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [qualityLevels, setQualityLevels] = useState<any[]>([]);
    const [currentQuality, setCurrentQuality] = useState(-1);
    const [showControls, setShowControls] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [showQualityMenu, setShowQualityMenu] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

    // New Feature States
    const [maxWatchedTime, setMaxWatchedTime] = useState(0);
    const maxWatchedRef = useRef(0);
    const [preventSeeking, setPreventSeeking] = useState(false);
    const [activeQuiz, setActiveQuiz] = useState<any>(null);
    const [quizTimer, setQuizTimer] = useState(0);

    // Fetch settings on mount
    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.preventSeeking) setPreventSeeking(true);
            })
            .catch(console.error);
    }, []);

    // Quiz Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeQuiz && quizTimer > 0) {
            interval = setInterval(() => {
                setQuizTimer((prev) => {
                    if (prev <= 1) {
                        // Time's up
                        clearInterval(interval);
                        handleQuizSubmit(null); // Auto submit with null/timeout
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeQuiz, quizTimer]);

    const handleQuizSubmit = (answer: string | null) => {
        if (!activeQuiz) return;

        // Log answer or handle verification
        console.log("Quiz submitted:", answer, "Time left:", quizTimer);

        // Mark completed
        activeQuiz.completed = true;

        // Close quiz
        setActiveQuiz(null);
        setQuizTimer(0);

        // Resume video
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    // Initial load
    useEffect(() => {
        // Reset state for new lesson
        setMaxWatchedTime(0);
        maxWatchedRef.current = 0;
        setQuizTimer(0);
        setActiveQuiz(null);

        if (!videoRef.current) return;
        const video = videoRef.current;
        let hls: Hls;

        const src = lesson.src;
        const isHls = src.includes('.m3u8');

        if (isHls && Hls.isSupported()) {
            hls = new Hls({
                autoStartLoad: true,
                startLevel: -1,
                capLevelToPlayerSize: true,
                debug: false
            });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                setQualityLevels(hls.levels);
                setDuration(video.duration || 0);
            });

            hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
                setCurrentQuality(data.level);
            });

        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            video.src = src;
        } else {
            // Fallback standard video (MP4)
            video.src = src;
        }

        const handleTimeUpdate = () => {
            const ct = video.currentTime;
            setCurrentTime(ct);

            // Track Max Watched Time
            // Only update if we are essentially at the leading edge
            if (ct > maxWatchedRef.current) {
                maxWatchedRef.current = ct;
                setMaxWatchedTime(ct);
            }

            // Check popup quizzes
            const quizzes = lesson.quizzes || lesson.config?.popupQuizzes;
            if (quizzes) {
                const quiz = quizzes.find((q: any) => Math.abs(q.time - ct) < 0.5 && !q.completed);
                if (quiz) {
                    video.pause();
                    setIsPlaying(false);
                    // Open quiz modal logic here
                    // Ideally set an overlay state
                    console.log("Quiz trigger!", quiz);
                    setActiveQuiz(quiz);
                    setQuizTimer(quiz.duration || 15); // Default 15s if not set
                }
            }

            // Check completion
            if (lesson.config?.completionPercentage) {
                const percent = (ct / video.duration) * 100;
                if (percent >= lesson.config.completionPercentage) {
                    // Mark complete logic could trigger once
                }
            }
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setHasEnded(true);
            setIsPlaying(false);
            onComplete();
        };

        const onSeeking = () => {
            if (preventSeeking && video.currentTime > maxWatchedRef.current + 1.5) {
                video.currentTime = maxWatchedRef.current;
            }
        };

        const onSeeked = () => {
            if (preventSeeking && video.currentTime > maxWatchedRef.current + 1.5) {
                video.currentTime = maxWatchedRef.current;
            }
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('ended', handleEnded);
        video.addEventListener('seeking', onSeeking);
        video.addEventListener('seeked', onSeeked);

        return () => {
            if (hls) hls.destroy();
            hlsRef.current = null;
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('ended', handleEnded);
            video.removeEventListener('seeking', onSeeking);
            video.removeEventListener('seeked', onSeeked);
        };
    }, [lesson, preventSeeking]); // Added preventSeeking to dependency to ensure event listeners have fresh state if needed, though mostly using refs

    // Keyboard controls blocking
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!preventSeeking) return;
            // Block ArrowRight, ArrowLeft, J, L
            if (['ArrowRight', 'ArrowLeft', 'j', 'l', 'J', 'L'].includes(e.key)) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        window.addEventListener('keydown', handleKeyDown, true); // Capture phase
        return () => window.removeEventListener('keydown', handleKeyDown, true);
    }, [preventSeeking]);

    // Format Time
    const formatTime = (time: number) => {
        if (isNaN(time)) return "00:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const togglePlay = () => {
        if (activeQuiz) return; // Prevent play if quiz active
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (activeQuiz) return;
        const time = parseFloat(e.target.value);

        // Prevent Seeking Logic
        if (preventSeeking && time > maxWatchedTime && time > currentTime) {
            // Block seek
            alert("Seeking forward is disabled.");
            return;
        }

        if (videoRef.current) videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const handleQualityChange = (levelIndex: number) => {
        if (hlsRef.current) {
            hlsRef.current.currentLevel = levelIndex;
            setCurrentQuality(levelIndex);
            setShowQualityMenu(false);
        }
    };

    return (
        <div ref={containerRef} className="relative bg-black w-full h-full group" onMouseEnter={() => setShowControls(true)} onMouseLeave={() => isPlaying && setShowControls(false)}>
            <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onClick={togglePlay}
            />

            {/* Quiz Overlay */}
            {activeQuiz && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-30 p-8">
                    <div className="bg-white rounded-xl p-6 max-w-lg w-full relative">
                        {/* Timer Display */}
                        <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className={`text-sm font-bold px-3 py-1 rounded-full ${quizTimer <= 5 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                ⏱ {quizTimer}s
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-gray-900 mb-4 pr-16">{activeQuiz.question}</h3>
                        <div className="space-y-3">
                            {activeQuiz.options?.map((opt: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuizSubmit(opt)}
                                    className="w-full text-left p-3 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-colors text-gray-700"
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Watermark */}
            <div className="absolute top-4 right-4 z-10 opacity-30 pointer-events-none select-none">
                <span className="text-white text-2xl font-bold uppercase tracking-widest drop-shadow-md">
                    Christian Gunawan
                </span>
            </div>

            {/* Play Overlay when paused */}
            {!isPlaying && !hasEnded && !activeQuiz && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer" onClick={togglePlay}>
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center pl-1 text-white shadow-lg transform hover:scale-110 transition-transform">
                        <Play fill="currentColor" size={32} />
                    </div>
                </div>
            )}

            {hasEnded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                    <h3 className="text-white text-xl font-bold mb-4">Lesson Completed!</h3>
                    <div className="flex gap-4">
                        <button onClick={() => { if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.play(); setIsPlaying(true); setHasEnded(false); } }} className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors">
                            <RotateCcw size={18} /> Replay
                        </button>
                        <button onClick={onNext} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors">
                            Next Lesson <SkipForward size={18} />
                        </button>
                    </div>
                </div>
            )}

            {/* Controls Bar */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-12 pb-4 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    disabled={preventSeeking}
                    className={`w-full h-1 bg-gray-600 rounded-lg appearance-none mb-4 accent-blue-500 hover:h-1.5 transition-all ${preventSeeking ? 'cursor-not-allowed opacity-80 pointer-events-none' : 'cursor-pointer'}`}
                />

                <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="hover:text-blue-400">
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                        </button>

                        <div className="flex items-center gap-1 text-xs font-medium font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span className="text-gray-400">/</span>
                            <span>{formatTime(duration)}</span>
                        </div>

                        <div className="flex items-center gap-2 group/volume relative ml-2">
                            <button onClick={() => setIsMuted(!isMuted)}>
                                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                            </button>
                            <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => { setVolume(parseFloat(e.target.value)); if (videoRef.current) videoRef.current.volume = parseFloat(e.target.value); setIsMuted(false); }}
                                    className="h-1 w-20 bg-gray-600 rounded-lg accent-white ml-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Quality Selector */}
                        {qualityLevels.length > 0 && (
                            <div className="relative">
                                <button onClick={() => setShowQualityMenu(!showQualityMenu)} className="flex items-center gap-1 hover:text-blue-400 font-bold text-xs bg-gray-800/80 px-2 py-1 rounded border border-gray-700">
                                    <Settings size={14} />
                                    {currentQuality === -1 ? 'Auto' : `${qualityLevels[currentQuality]?.height}p`}
                                </button>
                                {showQualityMenu && (
                                    <div className="absolute bottom-full right-0 mb-2 bg-gray-900 border border-gray-800 rounded shadow-xl overflow-hidden min-w-[120px]">
                                        <button
                                            className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-800 ${currentQuality === -1 ? 'text-blue-500 font-bold' : 'text-gray-300'}`}
                                            onClick={() => handleQualityChange(-1)}
                                        >
                                            Auto
                                        </button>
                                        {qualityLevels.map((level, idx) => (
                                            <button
                                                key={idx}
                                                className={`block w-full text-left px-4 py-2 text-xs hover:bg-gray-800 ${currentQuality === idx ? 'text-blue-500 font-bold' : 'text-gray-300'}`}
                                                onClick={() => handleQualityChange(idx)}
                                            >
                                                {level.height}p
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        <button onClick={toggleFullScreen} className="hover:text-blue-400">
                            <Maximize size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

