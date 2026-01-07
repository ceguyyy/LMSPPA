"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CoursePlayer from '@/components/CoursePlayer';
import LearningJourney from '@/components/LearningJourney';

export default function CourseView() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();

    const [course, setCourse] = useState<any>(null);
    const [modules, setModules] = useState<any[]>([]);
    const [allSteps, setAllSteps] = useState<any[]>([]);
    const [currentStep, setCurrentStep] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('journey');

    // Helper to flatten steps from all modules (treating the API response as list of modules/lessons)
    const flattenSteps = (data: any[]) => data.flatMap(m => m.steps);

    useEffect(() => {
        const saved = localStorage.getItem('completed_steps');
        if (saved) try { setCompletedStepIds(JSON.parse(saved)); } catch (e) { }

        fetch('/api/lessons')
            .then(res => res.json())
            .then(data => {
                setModules(data);

                // In this mock, 'data' is the array of courses/modules.
                // We find the one that matches ID to display title, but we load ALL steps from ALL modules 
                // into the sidebar? 
                // Based on lmsppa logic: `const selectedCourse = data.find(m => m.id === id) || data[0]`
                // and `setAllSteps(flat)`. So it seems the sidebar shows EVERYTHING.

                const selectedCourse = data.find((m: any) => m.id === id) || data[0];
                setCourse(selectedCourse);

                const flat = flattenSteps(data);
                setAllSteps(flat);

                // Set initial step
                if (flat.length > 0) setCurrentStep(flat[0]);
                setLoading(false);
            })
            .catch(e => setLoading(false));
    }, [id]);

    const handleStepComplete = () => {
        if (!currentStep) return;
        if (!completedStepIds.includes(currentStep.id)) {
            const newCompleted = [...completedStepIds, currentStep.id];
            setCompletedStepIds(newCompleted);
            localStorage.setItem('completed_steps', JSON.stringify(newCompleted));

            // Should also persist to backend
            fetch(`/api/progress/${currentStep.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: true, timestamp: Date.now() })
            });
        }
    };

    const handleNext = () => {
        if (!currentStep) return;
        const idx = allSteps.findIndex(s => s.id === currentStep.id);
        if (idx >= 0 && idx < allSteps.length - 1) setCurrentStep(allSteps[idx + 1]);
    };

    const handleSelectStep = (step: any) => {
        const idx = allSteps.findIndex(s => s.id === step.id);
        // Simple sequential enforcement logic
        if (idx <= 0) { setCurrentStep(step); return; }
        const prevStep = allSteps[idx - 1];
        if (completedStepIds.includes(prevStep.id) || completedStepIds.includes(step.id)) {
            setCurrentStep(step);
        } else {
            alert("Please complete the previous step first.");
        }
    };

    // --- Tab Components ---
    const AttendanceView = () => (
        <div className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Class Attendance</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 font-bold">
                        <tr>
                            <th className="p-3 border-b">Session Date</th>
                            <th className="p-3 border-b">Topic</th>
                            <th className="p-3 border-b">Duration</th>
                            <th className="p-3 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        <tr className="border-b hover:bg-gray-50">
                            <td className="p-3">Oct 28, 2025</td>
                            <td className="p-3">Introduction to Maintenance</td>
                            <td className="p-3">2 Hours</td>
                            <td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Present</span></td>
                        </tr>
                        <tr className="border-b hover:bg-gray-50">
                            <td className="p-3">Oct 29, 2025</td>
                            <td className="p-3">Advanced Architecture</td>
                            <td className="p-3">4 Hours</td>
                            <td className="p-3"><span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs font-bold">Upcoming</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );

    const AssessmentsView = () => (
        <div className="p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Assignments & Exams</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 font-bold">
                        <tr>
                            <th className="p-3 border-b">Assessment Name</th>
                            <th className="p-3 border-b">Type</th>
                            <th className="p-3 border-b">Deadline</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Score</th>
                            <th className="p-3 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {allSteps.filter(s => s.type === 'assessment').map(s => {
                            const isDone = completedStepIds.includes(s.id);
                            return (
                                <tr key={s.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3 font-medium text-blue-700">{s.title}</td>
                                    <td className="p-3 capitalize">{s.subtype || 'Quiz'}</td>
                                    <td className="p-3">Oct 30, 2025</td>
                                    <td className="p-3">
                                        {isDone ? <span className="text-green-600 font-bold">Submitted</span> : <span className="text-orange-500">Pending</span>}
                                    </td>
                                    <td className="p-3">{isDone ? '80/100' : '-'}</td>
                                    <td className="p-3">
                                        <button
                                            onClick={() => { setActiveTab('journey'); handleSelectStep(s); }}
                                            className="text-gray-500 hover:text-blue-600"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) return <div className="p-8 mt-16 ml-64 text-gray-500">Loading...</div>;

    return (
        <div className="flex h-[calc(100vh-64px)] mt-16 ml-64 overflow-hidden bg-gray-50">
            <div className="flex-1 overflow-y-auto p-6">
                {/* Header Course Info */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{course ? course.title : 'Course Title'}</h2>
                    <p className="text-sm text-gray-500">Instructor: Muhammad Rizal Basith</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] flex flex-col overflow-hidden">
                    <div className="border-b border-gray-200 px-6 flex items-center gap-8 bg-white">
                        <button
                            onClick={() => setActiveTab('journey')}
                            className={`py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'journey' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                        >
                            Training Journey
                        </button>
                        <button
                            onClick={() => setActiveTab('attendance')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'attendance' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                        >
                            Attendance
                        </button>
                        <button
                            onClick={() => setActiveTab('assessments')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'assessments' ? 'text-blue-600 border-blue-600' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                        >
                            Assessments
                        </button>
                    </div>

                    <div className="flex flex-1 overflow-hidden bg-white">
                        {/* Tab Content */}
                        {activeTab === 'journey' && (
                            <>
                                <LearningJourney
                                    modules={modules}
                                    currentStepId={currentStep?.id}
                                    completedStepIds={completedStepIds}
                                    onSelectStep={handleSelectStep}
                                    embedded={true}
                                />
                                <div className="flex-1 bg-white p-6 overflow-y-auto border-l border-gray-100">
                                    {currentStep && (
                                        <>
                                            {currentStep.type === 'video' ? (
                                                <div className="w-full max-w-4xl mx-auto">
                                                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl mb-6">
                                                        <CoursePlayer
                                                            lesson={currentStep}
                                                            onComplete={handleStepComplete}
                                                            onNext={handleNext}
                                                        />
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-800">{currentStep.title}</h3>
                                                </div>
                                            ) : currentStep.type === 'assessment' ? (
                                                <div className="max-w-3xl mx-auto">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{currentStep.title}</h3>
                                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
                                                        {currentStep.questions?.map((q: any) => (
                                                            <div key={q.id} className="mb-6">
                                                                <p className="font-medium text-gray-800 mb-3">{q.text}</p>
                                                                {q.options.map((opt: string) => <div key={opt} className="ml-4 p-3 bg-white mb-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-blue-300 transition-colors cursor-pointer">{opt}</div>)}
                                                            </div>
                                                        ))}
                                                        <button onClick={() => { handleStepComplete(); handleNext(); }} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold mt-4 hover:bg-blue-700 transition-colors">Submit Answers</button>
                                                    </div>
                                                </div>
                                            ) : currentStep.type === 'evaluation' ? (
                                                <div className="max-w-3xl mx-auto">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{currentStep.title}</h3>
                                                    <div className="bg-white p-6 rounded-xl border border-gray-200">
                                                        <p className="text-gray-600 mb-4">{currentStep.description}</p>
                                                        {currentStep.questions?.map((q: any) => (
                                                            <div key={q.id} className="mb-4">
                                                                <p className="font-bold text-sm text-gray-700 mb-1">{q.text}</p>
                                                                <div className="flex gap-2">
                                                                    {q.options.map((opt: string) => (
                                                                        <span key={opt} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{opt}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <button onClick={() => { handleStepComplete(); handleNext(); }} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Submit Evaluation</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="max-w-3xl mx-auto">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{currentStep.title}</h3>
                                                    <div className="prose prose-blue text-gray-600">
                                                        <p>{currentStep.content}</p>
                                                    </div>
                                                    <button onClick={() => { handleStepComplete(); handleNext(); }} className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">Mark as Read</button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        )}

                        {activeTab === 'attendance' && <AttendanceView />}
                        {activeTab === 'assessments' && <AssessmentsView />}
                    </div>
                </div>
            </div>
        </div>
    );
}
