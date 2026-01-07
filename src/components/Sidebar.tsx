"use client";

import React from 'react';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    GraduationCap,
    Clock,
    FileText,
    Target,
    User,
    PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../lib/i18n'; // Initialize i18n

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = useTranslation();

    const navItems = [
        { icon: LayoutDashboard, label: t('nav.home'), path: '/' },
        { icon: BookOpen, label: t('nav.catalog'), path: '/catalog' },
        { icon: Calendar, label: t('nav.schedule'), path: '/schedule' },
        { icon: GraduationCap, label: t('nav.my_training'), path: '/my-training' },
        { icon: User, label: t('nav.selfLearning'), path: '/self-learning' },
        { icon: Clock, label: t('nav.history'), path: '/history' },
        { icon: FileText, label: t('nav.evaluation'), path: '/evaluation' },
        { icon: Target, label: t('nav.idp'), path: '/idp' },
    ];

    const isActive = (path: string) => pathname === path || (path !== '/' && pathname.startsWith(path));

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100 min-h-[64px]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold text-sm">P</div>
                    <span className="font-bold text-gray-800 text-sm">Putra Perkasa Abadi</span>
                </div>
            </div>

            {/* Profile Summary */}
            <div className="px-6 py-6 flex flex-col items-center border-b border-gray-50 mb-2">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold mb-3 shadow-md">
                    AH
                </div>
                <div className="text-center">
                    <h3 className="text-xs font-bold text-gray-800">AHMAD IQBAL ZIMAMUL HAWA</h3>
                    <p className="text-[10px] text-blue-600 font-semibold mt-1">HCGA & EXTERNAL</p>
                    <p className="text-[10px] text-gray-500">HCM DEVELOPMENT STAFF</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 pb-6">
                {navItems.map((item, idx) => {
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={idx}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                                ${active
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }
                            `}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    );
}
