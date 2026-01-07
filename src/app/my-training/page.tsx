"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyTraining() {
    const router = useRouter();
    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/lessons')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-8 mt-16 ml-64 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Training</h1>
            {/* Filter Tabs */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4 border border-gray-100">
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer">
                    <input type="radio" name="status" defaultChecked className="accent-blue-600" />
                    Ongoing
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer">
                    <input type="radio" name="status" className="accent-gray-500" />
                    Completed
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.length === 0 && <p className="text-gray-500">Loading courses...</p>}
                {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all">
                        <div className="h-32 bg-gray-200 bg-cover bg-center relative group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${course.thumbnail || 'https://via.placeholder.com/300'})` }}>
                            {/* Overlay */}
                        </div>
                        <div className="p-4 flex-1 flex flex-col relative bg-white">
                            <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight line-clamp-2 min-h-[40px]">{course.title}</h3>
                            <p className="text-xs text-gray-500 mb-4 font-mono">{course.code || 'CODE-123'}</p>

                            <div className="mt-auto flex items-center justify-between text-[10px] text-gray-600 font-medium mb-4">
                                <div className="flex items-center gap-1">
                                    <span>📍</span> {course.location || 'Online'}
                                </div>
                                <div>{course.date || 'Flexible'}</div>
                            </div>

                            <button
                                onClick={() => router.push('/course/' + course.id)}
                                className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
