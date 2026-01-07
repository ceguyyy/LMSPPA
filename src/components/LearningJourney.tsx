"use client";

import React from 'react';
import { CheckCircle, Circle, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import clsx from 'clsx';

interface Step {
    id: string;
    title: string;
    type: 'video' | 'assessment' | 'overview' | 'evaluation';
}

interface LearningJourneyProps {
    modules: any[]; // The top-level array is modules/courses
    currentStepId?: string;
    completedStepIds: string[];
    onSelectStep: (step: Step) => void;
    embedded?: boolean;
}

export default function LearningJourney({ modules, currentStepId, completedStepIds, onSelectStep, embedded = false }: LearningJourneyProps) {
    const flattenSteps = modules.flatMap(m => m.steps);

    const getIcon = (type: string, status: 'completed' | 'current' | 'locked') => {
        if (status === 'completed') return <CheckCircle className="text-green-500" size={20} />;
        if (type === 'video') return <PlayCircle size={20} className={status === 'current' ? 'text-blue-600' : 'text-gray-400'} />;
        if (type === 'assessment') return <HelpCircle size={20} className={status === 'current' ? 'text-blue-600' : 'text-gray-400'} />;
        return <FileText size={20} className={status === 'current' ? 'text-blue-600' : 'text-gray-400'} />;
    };

    return (
        <div className={clsx("flex flex-col h-full bg-white", embedded ? "w-80 border-r border-gray-200" : "w-full")}>
            {embedded && (
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800">Your Journey</h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {Math.round((completedStepIds.length / flattenSteps.length) * 100)}% Completed
                    </p>
                    <div className="w-full bg-gray-200 h-1.5 mt-2 rounded-full overflow-hidden">
                        <div
                            className="bg-green-500 h-full transition-all duration-500"
                            style={{ width: `${(completedStepIds.length / flattenSteps.length) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {modules.map((module, mIdx) => (
                    <div key={module.id} className="relative">
                        <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white z-10 py-2">
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
                                {mIdx + 1}
                            </div>
                            <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{module.title}</h4>
                        </div>

                        <div className="space-y-1 ml-3 border-l-2 border-gray-100 pl-4 py-2">
                            {module.steps.map((step: Step, sIdx: number) => {
                                const isCompleted = completedStepIds.includes(step.id);
                                const isCurrent = currentStepId === step.id;
                                const isLocked = false; // Implement locking logic if needed

                                return (
                                    <div
                                        key={step.id}
                                        onClick={() => !isLocked && onSelectStep(step)}
                                        className={clsx(
                                            "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border",
                                            isCurrent
                                                ? "bg-blue-50 border-blue-200 shadow-sm"
                                                : "hover:bg-gray-50 border-transparent text-gray-600"
                                        )}
                                    >
                                        <div className="shrink-0">
                                            {getIcon(step.type, isCompleted ? 'completed' : isCurrent ? 'current' : 'locked')}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={clsx("text-sm font-medium truncate", isCurrent ? "text-blue-700" : isCompleted ? "text-gray-700" : "text-gray-500")}>
                                                {step.title}
                                            </p>
                                            <p className="text-[10px] text-gray-400 capitalize">{step.type}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
