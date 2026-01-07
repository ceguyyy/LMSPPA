import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search, Star, FileText, Download } from 'lucide-react'
import CoursePlayer from './CoursePlayer'

// --- Dashboard Component ---
export function SelfLearningDashboard() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    useEffect(() => {
        fetch('/api/self-learning')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div className="p-8 mt-16 ml-64 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Self Learning</h1>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by Course Name..."
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={20} />
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
                        <div className="h-40 bg-gray-200 relative">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-red-700 text-sm mb-1 uppercase tracking-wide">{course.title}</h3>
                            <p className="text-xs text-gray-500 mb-3 font-mono">{course.code}</p>

                            <p className="text-gray-600 text-xs mb-4 line-clamp-3 leading-relaxed flex-1">
                                {course.description}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-bold text-gray-500">Helpfulness</span>
                                    <div className="flex items-center gap-1 text-orange-400">
                                        {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < Math.floor(course.rating) ? "currentColor" : "none"} />)}
                                        <span className="text-xs text-gray-700 font-bold ml-1">{course.rating}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/self-learning/' + course.id)}
                                    className="w-full py-2 border border-gray-300 text-gray-700 font-bold text-xs rounded hover:bg-gray-50 transition-colors uppercase"
                                >
                                    View Course
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Detail Component with Top Tabs ---
export function SelfLearningCourseDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [course, setCourse] = useState(null)
    const [activeTab, setActiveTab] = useState(0) // Index of module
    const [previewFile, setPreviewFile] = useState(null)

    const [error, setError] = useState(null)

    useEffect(() => {
        fetch('/api/self-learning')
            .then(res => {
                if (!res.ok) throw new Error('API Failed')
                return res.json()
            })
            .then(data => {
                const found = data.find(c => c.id === id)
                if (!found) setError('Course not found')
                else setCourse(found)
            })
            .catch(err => setError(err.message))
    }, [id])

    if (error) return <div className="p-8 mt-16 ml-64 text-red-600 font-bold">Error: {error} (Try restarting the server)</div>
    if (!course) return <div className="p-8 mt-16 ml-64">Loading Course Data...</div>

    const currentModule = course.modules && course.modules[activeTab]

    return (
        <div className="mt-16 ml-64 min-h-screen bg-gray-50 flex flex-col relative">
            {/* File Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8">
                    <div className="bg-white w-full h-full max-w-5xl rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-red-100 text-red-600 p-2 rounded-lg">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">{previewFile.title}</h3>
                                    <p className="text-xs text-gray-500">Preview Mode</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setPreviewFile(null)}
                                className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-1 bg-gray-100 p-1">
                            {previewFile.url ? (
                                <iframe src={previewFile.url} className="w-full h-full rounded-b-lg" title="File Preview" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400 font-medium">
                                    No preview available for this file.
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-white flex justify-end">
                            <a
                                href={previewFile.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <Download size={16} /> Download File
                            </a>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Banner Course Info */}
            <div className="bg-white p-6 border-b border-gray-200 shadow-sm flex gap-6">
                <div className="w-1/3 rounded-xl overflow-hidden shadow-lg border border-gray-100">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 py-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{course.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                                <span className="font-bold text-gray-900">Training Code: <span className="font-mono font-normal">{course.code}</span></span>
                            </div>
                        </div>
                        <div className="bg-red-50 text-red-700 px-3 py-1 rounded text-xs font-bold">
                            Internal Training
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="font-bold text-sm text-gray-900 mb-2">About this Training</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
                    </div>

                    {/* Stars */}
                    <div className="mt-6 flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-700">Rate this course!</span>
                        <div className="flex gap-1 text-orange-400 cursor-pointer">
                            {[...Array(5)].map((_, i) => <Star key={i} size={18} />)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Tabs Navigation */}
            {course.modules && course.modules.length > 0 && (
                <div className="bg-white border-b border-gray-200 px-6 sticky top-16 z-20 shadow-sm">
                    <div className="flex gap-8 overflow-x-auto no-scrollbar">
                        {course.modules.map((mod, idx) => (
                            <button
                                key={mod.id}
                                onClick={() => setActiveTab(idx)}
                                className={`py-4 text-sm font-bold uppercase transition-colors whitespace-nowrap border-b-2
                                    ${activeTab === idx ? 'border-orange-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}
                                `}
                            >
                                {mod.title}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Content */}
            <div className="p-8 flex-1">
                {currentModule ? (
                    <div>
                        <div className="mb-6">
                            <h2 className="text-sm text-gray-500 font-mono mb-1">{course.code}</h2>
                            <h1 className="text-2xl font-bold text-gray-900">{currentModule.title}</h1>
                        </div>

                        <div className="flex gap-8 items-start">
                            {/* Left Content (Image or Video) */}
                            <div className="w-1/3 flex-shrink-0">
                                {currentModule.content.video ? (
                                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-md mb-4">
                                        <CoursePlayer
                                            lesson={currentModule.content.video}
                                            onComplete={() => console.log('Video completed')}
                                        />
                                    </div>
                                ) : (
                                    <img src={course.thumbnail} className="w-full rounded-lg shadow-md mb-4" />
                                )}
                            </div>

                            {/* Right Content (Description + Files) */}
                            <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{currentModule.title} (Description)</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{currentModule.content.description}</p>
                                </div>

                                {/* Vertical Journey Timeline */}
                                <div className="mt-8">
                                    <h4 className="text-sm font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <div className="w-2 h-6 bg-red-600 rounded-full" />
                                        Learning Journey
                                    </h4>

                                    <div className="relative border-l-2 border-gray-200 ml-3 pl-8 space-y-6 pb-2">
                                        {currentModule.content.files.map((file, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setPreviewFile(file)}
                                                className="relative group cursor-pointer"
                                            >
                                                {/* Timeline Dot */}
                                                <div className="absolute -left-[43px] top-6 w-5 h-5 bg-white border-4 border-gray-300 rounded-full group-hover:border-red-500 transition-colors z-10" />

                                                {/* Card Content */}
                                                <div className="flex gap-4 p-4 border border-gray-100 rounded-lg bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                                                    <div className="w-12 h-12 flex-shrink-0 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-red-500 shadow-sm">
                                                        <FileText size={24} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-gray-800 text-sm">{file.title}</h4>
                                                        <p className="text-gray-500 text-xs mt-1">{file.description}</p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <span className="bg-cyan-100 text-cyan-700 text-[10px] font-bold px-2 py-0.5 rounded">FILE</span>
                                                            <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded group-hover:bg-red-100 group-hover:text-red-600 transition-colors">PREVIEW</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center text-gray-300 group-hover:text-blue-600">
                                                        <Download size={20} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-500 italic">Select a module to view content.</div>
                )}
            </div>
        </div>
    )
}
