"use client";

import React, { useEffect, useState } from 'react';
import { Search, Filter, BookOpen, Clock, Star, ChevronLeft, Download, FileText, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import CoursePlayer from '../CoursePlayer';

// --- Types ---
interface SelfLearningModule {
    id: string;
    title: string;
    code: string;
    instructor?: string;
    rating: number;
    thumbnail: string;
    description: string;
    modules: any[];
}

// --- Dashboard Component ---
export function SelfLearningDashboard() {
    const router = useRouter();
    const [courses, setCourses] = useState<SelfLearningModule[]>([]);

    useEffect(() => {
        fetch('/api/self-learning')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8 mt-16 ml-64 min-h-screen bg-gray-50">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Self Learning</h1>
                    <p className="text-gray-500 mt-1">Enhance your skills with our self-paced courses.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-white transition-colors text-sm font-medium bg-white">
                        <Filter size={18} /> Filter
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {courses.map(course => (
                    <div
                        key={course.id}
                        onClick={() => router.push(`/self-learning/${course.id}`)}
                        className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col overflow-hidden" // flex col for uniform height
                    >
                        <div className="relative h-40 bg-gray-200 overflow-hidden">
                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-gray-800 flex items-center gap-1 shadow-sm">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" /> {course.rating}
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-800 mb-2 line-clamp-2 min-h-[40px]">{course.title}</h3>
                            <p className="text-xs text-blue-600 font-medium mb-3">{course.code}</p>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>

                            <div className="mt-auto flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-1"><BookOpen size={14} /> {course.modules.length} Modules</div>
                                <div className="flex items-center gap-1"><Clock size={14} /> Flexible</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Detail Component ---
export function SelfLearningCourseDetail({ id }: { id: string }) {
    const router = useRouter();
    const [course, setCourse] = useState<SelfLearningModule | null>(null);
    const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
    const [previewFile, setPreviewFile] = useState<any>(null); // State for preview

    useEffect(() => {
        fetch('/api/self-learning')
            .then(res => res.json())
            .then((data: SelfLearningModule[]) => {
                const found = data.find(c => c.id === id);
                if (found) {
                    setCourse(found);
                    if (found.modules.length > 0) setActiveModuleId(found.modules[0].id);
                }
            })
            .catch(err => console.error(err));
    }, [id]);

    if (!course) return <div className="p-8 mt-16 ml-64">Loading...</div>;

    const activeModule = course.modules.find(m => m.id === activeModuleId);

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50 relative">
            {/* File Preview Modal */}
            {previewFile && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 transition-all">
                    <div className="bg-white w-full h-full max-w-5xl rounded-xl shadow-2xl flex flex-col overflow-hidden">
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
                                X
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

            {/* Header */}
            <div className="fixed top-16 left-64 right-0 h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">{course.title}</h2>
                        <p className="text-xs text-gray-500">{course.code} • {course.instructor}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 mt-32 ml-64 overflow-hidden">
                {/* Sidebar List */}
                <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
                    <div className="p-6">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Course Content</h3>
                        <div className="space-y-2">
                            {course.modules.length === 0 && <p className="text-sm text-gray-400 italic">No content available.</p>}
                            {course.modules.map((mod, idx) => (
                                <button
                                    key={mod.id}
                                    onClick={() => setActiveModuleId(mod.id)}
                                    className={`w-full text-left p-3 rounded-lg text-sm font-medium transition-all flex gap-3 ${activeModuleId === mod.id ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                                >
                                    <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${activeModuleId === mod.id ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {idx + 1}
                                    </div>
                                    <span className="line-clamp-2">{mod.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    {activeModule ? (
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-8 border-b border-gray-100">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-4">{activeModule.title}</h1>
                                    <p className="text-gray-600 leading-relaxed">{activeModule.content?.description}</p>
                                </div>

                                <div className="p-8 bg-gray-50/50 space-y-8">
                                    {/* Video Section */}
                                    {activeModule.content?.video && (
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                <PlayCircle size={18} className="text-blue-600" /> Video Lesson
                                            </h4>
                                            <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                                                <CoursePlayer
                                                    lesson={activeModule.content.video}
                                                    onComplete={() => console.log('Video completed')}
                                                    onNext={() => { }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Files Section */}
                                    {activeModule.content?.files && activeModule.content.files.length > 0 && (
                                        <div className="space-y-4">
                                            <h4 className="flex items-center gap-2 font-bold text-gray-800 text-sm uppercase tracking-wide">
                                                <FileText size={18} className="text-orange-500" /> Learning Materials
                                            </h4>
                                            <div className="grid grid-cols-1 gap-3">
                                                {activeModule.content.files.map((file: any, idx: number) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setPreviewFile(file)}
                                                        className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center justify-between group cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500">
                                                                <FileText size={20} />
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-gray-800 text-sm">{file.title}</h5>
                                                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{file.description}</p>
                                                            </div>
                                                        </div>
                                                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                                                            <Download size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <BookOpen size={48} className="mb-4 opacity-20" />
                            <p>Select a module to start learning</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
