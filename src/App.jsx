import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import CoursePlayer from './components/CoursePlayer'
import LearningJourney from './components/LearningJourney'
import { Star } from 'lucide-react'

import Home from './components/Home'

// --- Mock Components for Dashboard ---
function MyTraining() {
    const navigate = useNavigate()
    const [courses, setCourses] = useState([])

    useEffect(() => {
        fetch('/api/lessons')
            .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div className="p-8 mt-16 ml-64">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Training</h1>
            {/* Filter Tabs */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex gap-4">
                <label className="flex items-center gap-2 text-sm font-medium text-blue-600 cursor-pointer">
                    <input type="radio" name="status" defaultChecked className="text-blue-600" />
                    Ongoing
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer">
                    <input type="radio" name="status" className="text-gray-500" />
                    Completed
                </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {courses.length === 0 && <p className="text-gray-500">Loading courses...</p>}
                {courses.map((course, idx) => (
                    <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                        <div className="h-32 bg-gray-200 bg-cover bg-center relative" style={{ backgroundImage: `url(${course.thumbnail || 'https://via.placeholder.com/300'})` }}>
                            {/* Overlay or Badge */}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight line-clamp-2">{course.title}</h3>
                            <p className="text-xs text-gray-500 mb-4">{course.code || 'CODE-123'}</p>

                            <div className="mt-auto flex items-center justify-between text-[10px] text-gray-600 font-medium mb-4">
                                <div className="flex items-center gap-1">
                                    <span>📍</span> {course.location || 'Online'}
                                </div>
                                <div>{course.date || 'Flexible'}</div>
                            </div>

                            <button
                                onClick={() => navigate('/course/' + course.id)}
                                className="w-full py-2 bg-gray-900 text-white text-xs font-bold rounded hover:bg-red-600 transition-colors"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- Course View (The Player) ---
function CourseView() {
    const { id } = useParams()
    const navigate = useNavigate()

    // We need to fetch data. In a real app we might fetch specific ID.
    // For this simple mock, we fetch all and find the one matching URL param (or default to first).
    const [course, setCourse] = useState(null)
    const [modules, setModules] = useState([])
    const [allSteps, setAllSteps] = useState([])
    const [currentStep, setCurrentStep] = useState(null)
    const [loading, setLoading] = useState(true)
    const [completedStepIds, setCompletedStepIds] = useState([])
    const [activeTab, setActiveTab] = useState('journey')

    const flattenSteps = (modules) => modules.flatMap(m => m.steps)

    useEffect(() => {
        const saved = localStorage.getItem('completed_steps')
        if (saved) try { setCompletedStepIds(JSON.parse(saved)) } catch (e) { }

        fetch('/api/lessons')
            .then(res => res.json())
            .then(data => {
                setModules(data)

                // Find current course by URL logic would go here. 
                // Since our API returns a list of "modules" which are treated as courses in dashboard:
                // Let's assume the mapped 'id' in dashboard links to this.
                // NOTE: The previous structure had 'modules' as the top level array.
                // We will treat the entire array as the list of available modules/courses.

                const selectedCourse = data.find(m => m.id === id) || data[0]
                setCourse(selectedCourse)

                const flat = flattenSteps(data)
                setAllSteps(flat)
                if (flat.length > 0) setCurrentStep(flat[0])
                setLoading(false)
            })
            .catch(e => setLoading(false))
    }, [id])

    const handleStepComplete = () => {
        if (!currentStep) return
        if (!completedStepIds.includes(currentStep.id)) {
            const newCompleted = [...completedStepIds, currentStep.id]
            setCompletedStepIds(newCompleted)
            localStorage.setItem('completed_steps', JSON.stringify(newCompleted))
        }
    }

    const handleNext = () => {
        if (!currentStep) return
        const idx = allSteps.findIndex(s => s.id === currentStep.id)
        if (idx >= 0 && idx < allSteps.length - 1) setCurrentStep(allSteps[idx + 1])
    }

    const handleSelectStep = (step) => {
        const idx = allSteps.findIndex(s => s.id === step.id)
        if (idx <= 0) { setCurrentStep(step); return }
        const prevStep = allSteps[idx - 1]
        if (completedStepIds.includes(prevStep.id) || completedStepIds.includes(step.id)) {
            setCurrentStep(step)
        } else {
            alert("Please complete the previous step first.")
        }
    }

    // --- Tab Components ---
    const AttendanceView = () => (
        <div className="p-6">
            <h3 className="text-lg font-bold mb-4">Class Attendance</h3>
            <table className="w-full text-sm text-left border border-gray-200">
                <thead className="bg-gray-100 text-gray-700 font-bold">
                    <tr>
                        <th className="p-3 border-b">Session Date</th>
                        <th className="p-3 border-b">Topic</th>
                        <th className="p-3 border-b">Duration</th>
                        <th className="p-3 border-b">Status</th>
                    </tr>
                </thead>
                <tbody>
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
    )

    const AssessmentsView = () => (
        <div className="p-6">
            <h3 className="text-lg font-bold mb-4">Assignments & Exams</h3>
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
                <tbody>
                    {allSteps.filter(s => s.type === 'assessment').map(s => {
                        const isDone = completedStepIds.includes(s.id)
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
                                        onClick={() => { setActiveTab('journey'); handleSelectStep(s) }}
                                        className="text-gray-500 hover:text-blue-600"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )

    if (loading) return <div className="p-8 mt-16 ml-64">Loading...</div>

    return (
        <div className="flex h-[calc(100vh-64px)] mt-16 ml-64 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {/* Header Course Info */}
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">{course ? course.title : 'Course Title'}</h2>
                    <p className="text-sm text-gray-500">Instructor: Muhammad Rizal Basith</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px] flex flex-col">
                    <div className="border-b border-gray-200 px-6 flex items-center gap-8">
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

                    <div className="flex flex-1 overflow-hidden">
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
                                                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-4">
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
                                                    <div className="bg-gray-50 p-6 rounded border border-gray-200">
                                                        {currentStep.questions?.map(q => (
                                                            <div key={q.id} className="mb-4">
                                                                <p className="font-medium text-gray-800 mb-2">{q.text}</p>
                                                                {q.options.map(opt => <div key={opt} className="ml-4 p-2 bg-white mb-1 border rounded text-sm text-gray-600">{opt}</div>)}
                                                            </div>
                                                        ))}
                                                        <button onClick={() => { handleStepComplete(); handleNext() }} className="bg-blue-600 text-white px-6 py-2 rounded font-bold mt-4">Submit</button>
                                                    </div>
                                                </div>
                                            ) : currentStep.type === 'evaluation' ? (
                                                <div className="max-w-3xl mx-auto">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{currentStep.title}</h3>
                                                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                                        <h4 className="font-bold text-gray-700 mb-6">{currentStep.description}</h4>

                                                        <div className="space-y-8">
                                                            {currentStep.questions?.map(q => (
                                                                <div key={q.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                                                    <label className="block text-base font-bold text-gray-800 mb-4">{q.text} <span className="text-red-500">*</span></label>

                                                                    {q.type === 'multiple-choice' ? (
                                                                        <div className="space-y-3">
                                                                            {q.options.map((opt, idx) => (
                                                                                <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                                                                                    <div className="relative flex items-center">
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`q-${q.id}`}
                                                                                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-blue-600 checked:bg-blue-600 transition-all"
                                                                                        />
                                                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 peer-checked:opacity-100">
                                                                                            <span className="w-2 h-2 bg-white rounded-full block"></span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <span className="text-gray-700 group-hover:text-gray-900">{opt}</span>
                                                                                </label>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50" rows="3" placeholder="Type your answer..."></textarea>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>

                                                        <div className="mt-8 flex justify-end">
                                                            <button
                                                                onClick={() => { handleStepComplete(); handleNext() }}
                                                                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm"
                                                            >
                                                                Submit Evaluation
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="max-w-3xl mx-auto">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-4">{currentStep.title}</h3>
                                                    <p className="text-gray-600 leading-relaxed">{currentStep.content}</p>
                                                    <button onClick={() => { handleStepComplete(); handleNext() }} className="mt-8 bg-blue-600 text-white px-6 py-2 rounded font-bold">Mark as Read</button>
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
    )
}

import { SelfLearningDashboard, SelfLearningCourseDetail } from './components/SelfLearning'

export default function App() {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar />
            <TopNav />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/my-training" element={<MyTraining />} />
                <Route path="/course/:id" element={<CourseView />} />

                {/* Self Learning Routes */}
                <Route path="/self-learning" element={<SelfLearningDashboard />} />
                <Route path="/self-learning/:id" element={<SelfLearningCourseDetail />} />
            </Routes>
        </div>
    )
}
