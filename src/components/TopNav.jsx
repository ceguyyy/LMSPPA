
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Bell } from 'lucide-react'

export default function TopNav() {
    const { i18n } = useTranslation()

    const toggleLang = () => {
        const newLang = i18n.language === 'en' ? 'id' : 'en'
        i18n.changeLanguage(newLang)
    }

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-10">
            <h1 className="text-lg font-bold text-gray-800">My Training</h1>

            <div className="flex items-center gap-6">
                {/* Language Toggle */}
                <button
                    onClick={toggleLang}
                    className="text-xs font-semibold text-gray-600 hover:text-red-600 bg-gray-100 px-3 py-1 rounded"
                >
                    {i18n.language === 'en' ? 'EN' : 'ID'}
                </button>

                <button className="text-gray-400 hover:text-gray-600 relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-bold">
                        AH
                    </div>
                    <span className="text-xs font-semibold text-gray-700">AHMAD IQBAL...</span>
                </div>
            </div>
        </header>
    )
}
