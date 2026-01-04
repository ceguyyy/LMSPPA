
import React from 'react'
import { useNavigate } from 'react-router-dom' // Added import
import { Link, useLocation } from 'react-router-dom'
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    GraduationCap,
    Clock,
    FileText,
    Target,
    User // Assuming User icon is desired for Self Learning based on previous context, or use GraduationCap again
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Sidebar() {
    const { t } = useTranslation()
    const location = useLocation()
    const navigate = useNavigate()

    const navItems = [
        { icon: LayoutDashboard, label: t('nav.home'), path: '/' },
        { icon: BookOpen, label: t('nav.catalog'), path: '/catalog' },
        { icon: Calendar, label: t('nav.schedule'), path: '/schedule' },
        { icon: GraduationCap, label: t('nav.my_training'), path: '/my-training' },
        { icon: User, label: t('nav.selfLearning'), path: '/self-learning' },
        { icon: Clock, label: t('nav.history'), path: '/history' },
        { icon: FileText, label: "Evaluation Form", path: '/evaluation' },
        { icon: Target, label: "IDP", path: '/idp' },
    ]

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0 overflow-y-auto z-20">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">P</div>
                    <span className="font-bold text-gray-800 text-sm">Putra Perkasa Abadi</span>
                </div>
            </div>

            {/* Profile Summary (Optional based on screenshot, but Sidebar usually just Nav) */}
            <div className="px-6 py-6 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center text-xl font-bold mb-3">
                    AH
                </div>
                <div className="text-center">
                    <h3 className="text-xs font-bold text-gray-800">AHMAD IQBAL ZIMAMUL HAWA</h3>
                    <p className="text-[10px] text-blue-600 font-semibold mt-1">HCGA & EXTERNAL</p>
                    <p className="text-[10px] text-gray-500">HCM DEVELOPMENT STAFF</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item, idx) => {
                    const isActive = location.pathname === item.path
                    return (
                        <Link
                            key={idx}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                                ${isActive
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
    )
}
