import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function AdminDashboard() {
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingLesson, setEditingLesson] = useState(null)

    useEffect(() => {
        fetch('/api/lessons')
            .then(res => res.json())
            .then(data => {
                setLessons(data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const handleSave = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/lessons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingLesson)
            })
            const data = await res.json()
            if (data.ok) {
                // Update local list
                const idx = lessons.findIndex(l => l.id === data.lesson.id)
                if (idx >= 0) {
                    const newLessons = [...lessons]
                    newLessons[idx] = data.lesson
                    setLessons(newLessons)
                } else {
                    setLessons([...lessons, data.lesson])
                }
                setEditingLesson(null)
            }
        } catch (err) {
            alert('Failed to save')
        }
    }

    const addNew = () => {
        setEditingLesson({
            id: 'lesson-' + Date.now(),
            title: 'New Lesson',
            src: '',
            duration: '00:00',
            description: '',
            config: {
                lockedSlider: false,
                lockedQuality: false,
                completionPercentage: 90
            }
        })
    }

    if (loading) return <div className="p-10 text-white">Loading...</div>

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
            <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
                <h1 className="text-2xl font-bold">LMS Admin Dashboard</h1>
                <Link to="/" className="text-indigo-400 hover:text-indigo-300">
                    &larr; Back to Course
                </Link>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* List */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Course Lessons</h2>
                        <button onClick={addNew} className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded text-sm text-white font-medium">
                            + Add New
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {lessons.map(lesson => (
                            <li key={lesson.id}
                                className="flex items-center justify-between p-3 bg-slate-800/50 rounded hover:bg-slate-800 cursor-pointer border border-transparent hover:border-indigo-500/30 transition-colors"
                                onClick={() => setEditingLesson(lesson)}
                            >
                                <div>
                                    <div className="font-medium text-white">{lesson.title}</div>
                                    <div className="text-xs text-slate-500">ID: {lesson.id}</div>
                                </div>
                                <div className="text-xs font-mono bg-black/30 px-2 py-1 rounded">
                                    {lesson.config?.completionPercentage}%
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Editor */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 sticky top-8">
                    {editingLesson ? (
                        <form onSubmit={handleSave} className="flex flex-col gap-4">
                            <h2 className="text-xl font-semibold border-b border-slate-800 pb-2">
                                Editing: {editingLesson.title}
                            </h2>

                            {/* Metadata */}
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Title</label>
                                    <input
                                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                                        value={editingLesson.title}
                                        onChange={e => setEditingLesson({ ...editingLesson, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Video URL</label>
                                    <input
                                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                                        value={editingLesson.src}
                                        onChange={e => setEditingLesson({ ...editingLesson, src: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Duration</label>
                                        <input
                                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                                            value={editingLesson.duration}
                                            onChange={e => setEditingLesson({ ...editingLesson, duration: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase text-slate-500 font-bold mb-1">ID (Read-only)</label>
                                        <input
                                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                                            value={editingLesson.id}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase text-slate-500 font-bold mb-1">Description</label>
                                    <textarea
                                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm focus:border-indigo-500 outline-none h-24"
                                        value={editingLesson.description || ''}
                                        onChange={e => setEditingLesson({ ...editingLesson, description: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Configs */}
                            <div className="border-t border-slate-800 pt-4 mt-2">
                                <h3 className="text-sm font-bold text-indigo-400 mb-3 uppercase tracking-wider">Player Configuration</h3>

                                <div className="space-y-3">
                                    <label className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800 cursor-pointer hover:border-slate-600">
                                        <div>
                                            <div className="font-medium text-sm">Lock Slider (No Seek Forward)</div>
                                            <div className="text-xs text-slate-500">Prevent users from scrubbing ahead</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-indigo-600"
                                            checked={editingLesson.config?.lockedSlider || false}
                                            onChange={e => setEditingLesson({
                                                ...editingLesson,
                                                config: { ...editingLesson.config, lockedSlider: e.target.checked }
                                            })}
                                        />
                                    </label>

                                    <label className="flex items-center justify-between p-3 bg-slate-950 rounded border border-slate-800 cursor-pointer hover:border-slate-600">
                                        <div>
                                            <div className="font-medium text-sm">Lock Quality</div>
                                            <div className="text-xs text-slate-500">Prevent changing resolution</div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-indigo-600"
                                            checked={editingLesson.config?.lockedQuality || false}
                                            onChange={e => setEditingLesson({
                                                ...editingLesson,
                                                config: { ...editingLesson.config, lockedQuality: e.target.checked }
                                            })}
                                        />
                                    </label>

                                    <div className="p-3 bg-slate-950 rounded border border-slate-800">
                                        <div className="flex justify-between mb-2">
                                            <div className="font-medium text-sm">Completion Threshold</div>
                                            <div className="font-mono text-indigo-400 font-bold">{editingLesson.config?.completionPercentage || 90}%</div>
                                        </div>
                                        <input
                                            type="range"
                                            min="10" max="100" step="5"
                                            className="w-full accent-indigo-600"
                                            value={editingLesson.config?.completionPercentage || 90}
                                            onChange={e => setEditingLesson({
                                                ...editingLesson,
                                                config: { ...editingLesson.config, completionPercentage: parseInt(e.target.value) }
                                            })}
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                                            <span>10%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                                <button type="button" onClick={() => setEditingLesson(null)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium shadow-lg shadow-indigo-500/20 transition-all">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 min-h-[400px]">
                            <p>Select a lesson to edit or create new.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
