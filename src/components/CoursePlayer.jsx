import React, { useRef, useState, useEffect } from 'react'
import Hls from 'hls.js'

export default function CoursePlayer({ lesson, onComplete, onNext }) {
    const videoRef = useRef(null)
    const [duration, setDuration] = useState(0)
    const [currentTime, setCurrentTime] = useState(0)
    const [playing, setPlaying] = useState(false)
    const [completedTriggered, setCompletedTriggered] = useState(false)

    // Feature: Seek Locking
    const [maxWatched, setMaxWatched] = useState(0)

    // Feature: ABR (HLS)
    const [hlsInstance, setHlsInstance] = useState(null)
    const [qualities, setQualities] = useState([])
    const [currentQuality, setCurrentQuality] = useState(-1) // -1 is Auto
    const [showResMenu, setShowResMenu] = useState(false)

    // Feature: Pop-up Quiz
    const [activeQuiz, setActiveQuiz] = useState(null)
    const [quizTimer, setQuizTimer] = useState(null)
    const [timeLeft, setTimeLeft] = useState(0)
    const [quizAnswered, setQuizAnswered] = useState(false)

    // Config from lesson or defaults
    const config = lesson.config || {
        lockedSlider: false,
        lockedQuality: false,
        completionPercentage: 90,
        popupQuizzes: []
    }

    const quizzes = config.popupQuizzes || []

    const STORAGE_KEY = 'course-progress:' + lesson.id

    // Reset state on lesson change
    useEffect(() => {
        setCompletedTriggered(false)
        setPlaying(false)
        setCurrentTime(0)
        setMaxWatched(0)
        setDuration(0)
        setActiveQuiz(null)
        setQuizAnswered(false)

        // HLS Cleanup and Setup
        if (Hls.isSupported() && lesson.src.endsWith('.m3u8')) {
            if (hlsInstance) hlsInstance.destroy()
            const hls = new Hls()
            hls.loadSource(lesson.src)
            hls.attachMedia(videoRef.current)

            hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                const levels = data.levels.map((l, idx) => ({
                    id: idx,
                    label: l.height + 'p',
                    bitrate: l.bitrate
                }))
                setQualities([{ id: -1, label: 'Auto' }, ...levels])
            })
            setHlsInstance(hls)
        } else if (videoRef.current) {
            // Native HLS (Safari) or MP4
            videoRef.current.src = lesson.src
            setQualities([]) // No explicit quality control for MP4/Native yet
        }

        // Load saved progress
        async function load() {
            try {
                const res = await fetch('/api/progress/' + lesson.id)
                if (res.ok) {
                    const json = await res.json()
                    if (json && typeof json.currentTime === 'number') {
                        const savedTime = json.currentTime
                        setCurrentTime(savedTime)
                        setMaxWatched(savedTime)
                        if (videoRef.current) videoRef.current.currentTime = savedTime
                    }
                }
            } catch (e) { console.error(e) }
        }
        load()

        return () => {
            if (hlsInstance) hlsInstance.destroy()
        }
    }, [lesson.id])

    // Timer Logic for Quiz
    useEffect(() => {
        if (activeQuiz && !quizAnswered) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        // Time run out logic (auto-fail or auto-close? Assuming pause)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            setQuizTimer(timer)
            return () => clearInterval(timer)
        }
    }, [activeQuiz, quizAnswered])

    const onLoadedMetadata = () => {
        const v = videoRef.current
        if (!v) return
        setDuration(v.duration)
    }

    const onTimeUpdate = () => {
        const v = videoRef.current
        if (!v) return
        const ct = v.currentTime
        setCurrentTime(ct)

        if (ct > maxWatched) setMaxWatched(ct)

        // Check for Pop-up Quizzes
        if (quizzes.length > 0 && !activeQuiz && !quizAnswered) {
            const hitQuiz = quizzes.find(q => Math.abs(q.time - ct) < 1 && !q.completed)
            if (hitQuiz) {
                v.pause()
                setPlaying(false)
                setActiveQuiz(hitQuiz)
                setTimeLeft(30) // Default 30s timer
                // Mark local copy as triggered so we don't loop? 
                // In real app, we'd track 'triggerQuizzes' state.
                // For now, simple object mutation in state or better:
                // We need a state "triggeredQuizTimes"
            }
        }

        const pct = (ct / v.duration) * 100
        const threshold = config.completionPercentage || 90

        if (!completedTriggered && pct > threshold) {
            setCompletedTriggered(true)
            onComplete && onComplete()
            persistProgress(ct, true)
        }
    }

    const handleSeek = (e) => {
        e.stopPropagation()
        if (activeQuiz) return

        const targetTime = parseFloat(e.target.value)

        if (completedTriggered) {
            if (videoRef.current) videoRef.current.currentTime = targetTime
            return
        }

        if (!config.lockedSlider) {
            if (videoRef.current) videoRef.current.currentTime = targetTime
            if (targetTime > maxWatched) setMaxWatched(targetTime)
            return
        }

        // Locked Logic
        if (targetTime <= maxWatched) {
            if (videoRef.current) videoRef.current.currentTime = targetTime
            setCurrentTime(targetTime) // Update UI immediately
        } else {
            // Snap back to max limit
            if (videoRef.current) videoRef.current.currentTime = maxWatched
            setCurrentTime(maxWatched) // Force slider back
        }
    }

    const persistProgress = async (ct, isCompleted = false) => {
        try {
            await fetch('/api/progress/' + lesson.id, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    videoId: lesson.id,
                    currentTime: ct,
                    duration: videoRef.current?.duration || 0,
                    completed: isCompleted,
                    savedAt: Date.now()
                })
            })
        } catch (e) { }
    }

    const togglePlay = () => {
        if (activeQuiz) return
        const v = videoRef.current
        if (!v) return
        if (v.paused) {
            v.play()
            setPlaying(true)
        } else {
            v.pause()
            setPlaying(false)
            persistProgress(v.currentTime, completedTriggered)
        }
    }

    const handleQualityChange = (levelId) => {
        if (hlsInstance) {
            hlsInstance.currentLevel = levelId // -1 for auto
            setCurrentQuality(levelId)
            setShowResMenu(false)
        }
    }

    // Quiz Handling
    const handleQuizSubmit = (optionIndex) => {
        if (!activeQuiz) return
        setQuizAnswered(true)
        clearInterval(quizTimer)

        const isCorrect = optionIndex === activeQuiz.correct

        if (isCorrect) {
            // Allow continue
            setTimeout(() => {
                setActiveQuiz(null)
                setQuizAnswered(false)
                // Mark quiz as done to avoid re-trigger
                activeQuiz.completed = true

                videoRef.current.play()
                setPlaying(true)
            }, 1000) // Brief delay to show success
        } else {
            // Retry? logic
            alert("Incorrect. Try again.")
            setQuizAnswered(false) // Reset purely for retry UI
        }
    }

    const fmt = (s) => {
        if (!s) return '00:00'
        const sec = Math.floor(s)
        const m = Math.floor(sec / 60)
        const ss = sec % 60
        return `${m}:${String(ss).padStart(2, '0')}`
    }

    const progressPct = duration ? (currentTime / duration) * 100 : 0
    const allowedPct = (!config.lockedSlider || completedTriggered) ? 100 : (duration ? (maxWatched / duration) * 100 : 0)

    return (
        <div className="flex flex-col h-full bg-black rounded-xl overflow-hidden shadow-2xl relative group select-none">

            {/* Watermark */}
            <div className="absolute top-4 right-4 z-10 opacity-30 pointer-events-none">
                <p className="text-white text-xs font-bold uppercase tracking-widest">Student Name • ID: 12345</p>
            </div>

            {/* Pop-up Quiz Overlay */}
            {activeQuiz && (
                <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-gray-900">Pop-up Quiz</h3>
                            <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-bold font-mono">
                                {timeLeft}s
                            </div>
                        </div>
                        <p className="text-gray-700 mb-6 font-medium">{activeQuiz.question}</p>
                        <div className="space-y-3">
                            {activeQuiz.options.map((opt, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleQuizSubmit(idx)}
                                    disabled={quizAnswered && idx !== activeQuiz.correct}
                                    className={`w-full text-left p-3 rounded-lg border transition-all
                                         ${quizAnswered && idx === activeQuiz.correct ? 'bg-green-100 border-green-500 text-green-700' : 'hover:bg-blue-50 border-gray-200 hover:border-blue-300'}
                                     `}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <video
                ref={videoRef}
                className="w-full h-full object-contain bg-black"
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
                onEnded={() => setPlaying(false)}
                onClick={togglePlay}
                disablePictureInPicture
                controlsList="nodownload"
                onError={(e) => console.error("Video Error", e)}
            />

            {/* Custom Controls Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 transition-opacity duration-300 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>

                {/* Progress Bar Container */}
                {/* Progress Bar (Range Input for Dragging) */}
                <div className="relative w-full h-4 mb-4 flex items-center group/progress">
                    {/* Background Tracks */}
                    <div className="absolute inset-x-0 h-1 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                        {/* Buffered / Allowed Range */}
                        {!completedTriggered && config.lockedSlider && (
                            <div className="h-full bg-white/30 transition-all duration-300" style={{ width: `${allowedPct}%` }} />
                        )}
                        {/* Played Progress (Visual only, behind thumb) */}
                        <div className={`h-full ${completedTriggered ? 'bg-green-500' : 'bg-red-600'}`} style={{ width: `${progressPct}%` }} />
                    </div>

                    <input
                        type="range"
                        min="0"
                        max={duration || 100} // Avoid NaN
                        step="0.1"
                        value={currentTime}
                        onInput={handleSeek}
                        disabled={config.lockedSlider && !completedTriggered && maxWatched < duration} // Native disable if strictly locked? No, we want to allow scrubbing up to maxWatched.
                        className={`
                            absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10
                            ${(!config.lockedSlider || completedTriggered) ? '' : '' /* If strictly locked, maybe styling changes? */}
                        `}
                    />

                    {/* Custom Thumb Visual (follows progress) */}
                    <div
                        className="absolute h-4 w-4 bg-white rounded-full shadow-md top-1/2 -translate-y-1/2 -ml-2 pointer-events-none scale-0 group-hover/progress:scale-100 transition-transform"
                        style={{ left: `${progressPct}%` }}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition-colors">
                            {playing ? (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            )}
                        </button>

                        <div className="text-white font-medium text-sm">
                            {fmt(currentTime)} <span className="text-white/50 mx-1">/</span> {fmt(duration)}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Resolution Selector (ABR) */}
                        {!config.lockedQuality && qualities.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowResMenu(!showResMenu)}
                                    className="text-xs font-bold text-white bg-white/10 hover:bg-white/20 px-2 py-1 rounded border border-white/20 transition-colors uppercase"
                                >
                                    {currentQuality === -1 ? 'Auto' : qualities.find(q => q.id === currentQuality)?.label || 'HD'}
                                </button>
                                {showResMenu && (
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden min-w-[80px]">
                                        {qualities.map(q => (
                                            <button
                                                key={q.id}
                                                className={`block w-full text-left px-3 py-2 text-xs hover:bg-slate-800 ${currentQuality === q.id ? 'text-red-500 font-bold' : 'text-slate-300'}`}
                                                onClick={() => handleQualityChange(q.id)}
                                            >
                                                {q.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {completedTriggered && (
                            <div className="flex items-center gap-2 text-green-400 text-sm font-semibold animate-pulse">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>Completed</span>
                            </div>
                        )}

                        {completedTriggered && onNext && (
                            <button onClick={onNext} className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                                Next &rarr;
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Center Play Button (only when paused) */}
            {!playing && !activeQuiz && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20">
                        <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                </div>
            )}
        </div>
    )
}
