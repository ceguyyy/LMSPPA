import React from 'react'

export default function CoursePlaylist({ lessons, currentLessonId, completedLessonIds, onSelectLesson }) {

    // Helper to check status
    const getStatus = (lesson, index) => {
        const isCompleted = completedLessonIds.includes(lesson.id)
        const isCurrent = lesson.id === currentLessonId

        // Logic: First lesson always unlocked. Others unlocked if previous is completed.
        let isLocked = false
        if (index > 0) {
            const prevLesson = lessons[index - 1]
            if (!completedLessonIds.includes(prevLesson.id)) {
                isLocked = true
            }
        }

        return { isCompleted, isCurrent, isLocked }
    }

    return (
        <aside className="bg-slate-900 border-l border-slate-800 w-full lg:w-80 flex flex-col h-full">
            <div className="p-5 border-b border-slate-800">
                <h3 className="text-white font-semibold text-lg">Course Content</h3>
                <div className="text-slate-400 text-xs mt-1">
                    {completedLessonIds.length} / {lessons.length} Completed
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <ul className="flex flex-col">
                    {lessons.map((lesson, index) => {
                        const { isCompleted, isCurrent, isLocked } = getStatus(lesson, index)

                        return (
                            <li key={lesson.id}>
                                <button
                                    disabled={isLocked}
                                    onClick={() => onSelectLesson(lesson)}
                                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors duration-200 border-b border-slate-800/50
                                        ${isCurrent ? 'bg-indigo-600/10 border-indigo-600/50' : 'hover:bg-slate-800/50'}
                                        ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                    `}
                                >
                                    <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border
                                        ${isCompleted ? 'bg-green-500 border-green-500 text-slate-900' :
                                            isLocked ? 'border-slate-600 text-slate-600' :
                                                'border-slate-400 text-slate-400'}
                                    `}>
                                        {isCompleted ? (
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : isLocked ? (
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        ) : (
                                            // Play icon or simple circle
                                            <div className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-indigo-400' : 'bg-slate-400'}`} />
                                        )}
                                    </div>

                                    <div>
                                        <div className={`text-sm font-medium ${isCurrent ? 'text-indigo-400' : 'text-slate-200'}`}>
                                            {lesson.title}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            {lesson.duration || 'Video'}
                                        </div>
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </aside>
    )
}
