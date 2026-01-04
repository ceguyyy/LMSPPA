
import React, { useState } from 'react'
import { CheckCircle2, Lock, Circle, PlayCircle, FileText, ChevronDown, ChevronRight } from 'lucide-react'

export default function LearningJourney({ modules, currentStepId, completedStepIds, onSelectStep, embedded = false }) {
    // State to track expanded modules. Default to all expanded or logic can be added.
    // Let's default to expanding the module that has the current step, or the first one.
    // simpler: valid IDs in this set are expanded.
    const [expandedModuleIds, setExpandedModuleIds] = useState(() => {
        // Initial state: Expand all by default for better visibility, or just the first one?
        // User asked "can be collapse", implies they might be open by default or toggleable.
        // Let's expand all initially so they see content, then can collapse.
        if (modules && modules.length > 0) return modules.map(m => m.id)
        return []
    })

    const toggleModule = (id) => {
        setExpandedModuleIds(prev =>
            prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
        )
    }

    // Light Mode (Embedded) Styles variables
    const bgBase = embedded ? 'bg-white border-r border-gray-100' : 'bg-slate-900 border-l border-slate-800'

    // Step Colors
    const getStepClasses = (isCurrent, isCompleted, isLocked) => {
        if (embedded) {
            // Light Theme Logic
            if (isCurrent) return 'bg-blue-50'
            return 'hover:bg-gray-50'
        } else {
            // Dark Theme Logic
            if (isCurrent) return 'bg-indigo-900/20'
            return 'hover:bg-slate-800/50'
        }
    }

    return (
        <div className={`w-80 ${bgBase} overflow-y-auto flex-shrink-0`}>
            {!embedded && (
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-lg font-bold text-white">Learning Journey</h2>
                    <p className="text-xs text-slate-400 mt-1">Your path to mastery</p>
                </div>
            )}

            <div className="p-4 space-y-4">
                {modules.map((module, mIdx) => {
                    const isExpanded = expandedModuleIds.includes(module.id)

                    return (
                        <div key={module.id} className="relative">
                            {/* Module Header (Clickable for Collapse) */}
                            <div
                                onClick={() => toggleModule(module.id)}
                                className={`mb-2 flex items-center justify-between cursor-pointer group select-none ${embedded ? 'hover:bg-gray-50' : 'hover:bg-slate-800'} p-2 rounded transition-colors`}
                            >
                                <h3 className={`text-sm font-bold uppercase tracking-wider ${embedded ? 'text-gray-700' : 'text-slate-300'}`}>
                                    {module.title}
                                </h3>
                                <div className={embedded ? 'text-gray-400' : 'text-slate-500'}>
                                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </div>
                            </div>

                            {/* Steps Timeline (Collapsible) */}
                            {isExpanded && (
                                <div className={`space-y-0 relative border-l-2 ${embedded ? 'border-gray-200' : 'border-slate-800'} ml-3.5`}>
                                    {module.steps.map((step, sIdx) => {
                                        const isCompleted = completedStepIds.includes(step.id)
                                        const isCurrent = currentStepId === step.id
                                        // Simple visual logic: Locked if not completed and not current
                                        const isLocked = !isCompleted && !isCurrent

                                        let Icon = Circle
                                        if (isCompleted) Icon = CheckCircle2
                                        else if (isCurrent) Icon = PlayCircle
                                        else if (step.type === 'video') Icon = PlayCircle
                                        else if (step.type === 'assessment') Icon = FileText
                                        else Icon = Circle

                                        if (isLocked && !isCurrent && !isCompleted) Icon = Lock

                                        const stepBgClass = getStepClasses(isCurrent, isCompleted, isLocked)
                                        const dotColorClass = (embedded && isCompleted) ? 'border-green-500 text-green-500' :
                                            (embedded && isCurrent) ? 'border-blue-600 text-blue-600' :
                                                (embedded) ? 'border-gray-300 text-gray-300' :
                                                    (isCompleted ? 'border-green-500 text-green-500' : isCurrent ? 'border-indigo-500 text-indigo-500' : 'border-slate-600 text-slate-600')

                                        const dotFillClass = (embedded && isCompleted) ? 'bg-green-500' :
                                            (embedded && isCurrent) ? 'bg-blue-600' :
                                                (isCompleted ? 'bg-green-500' : isCurrent ? 'bg-indigo-500' : '')

                                        return (
                                            <div
                                                key={step.id}
                                                onClick={() => onSelectStep(step)}
                                                className={`group relative pl-8 py-3 cursor-pointer transition-colors rounded-lg mb-1
                                                    ${stepBgClass}
                                                    ${isLocked ? 'opacity-75 cursor-not-allowed' : ''}
                                                `}
                                            >
                                                {/* Connector Dot */}
                                                <div className={`absolute -left-[9px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${embedded ? 'bg-white' : 'bg-slate-900'}
                                                    ${dotColorClass}
                                                `}>
                                                    <div className={`w-2 h-2 rounded-full ${dotFillClass}`} />
                                                </div>

                                                <div className="">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`text-sm font-medium ${isCurrent ? (embedded ? 'text-blue-700' : 'text-white') : (embedded ? 'text-gray-600 group-hover:text-gray-900' : 'text-slate-400 group-hover:text-slate-200')}`}>
                                                            {step.title}
                                                        </span>
                                                        {step.type === 'video' && (
                                                            <span className={`text-[10px] px-1 rounded border ${embedded ? 'text-gray-400 border-gray-200' : 'text-slate-600 border-slate-700'}`}>
                                                                {step.duration}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className={`text-xs capitalize ${embedded ? 'text-gray-400' : 'text-slate-500'}`}>{step.type} {step.subtype ? `- ${step.subtype}` : ''}</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
