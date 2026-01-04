
import React from 'react'
import { LayoutList, User, FileText } from 'lucide-react'

export default function Home() {
    return (
        <div className="p-8 mt-16 ml-64 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Home</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Column 1 */}
                <div className="space-y-6">
                    {/* Upcoming Training */}
                    <Card title="Upcoming Training">
                        <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                            No item
                        </div>
                    </Card>

                    {/* On Going Training */}
                    <Card title="On Going Training">
                        <div className="space-y-4">
                            <TrainingCard
                                title="PREVENTIVE MAINTENANCE WHEEL LOADER WA200"
                                code="TRN3-ABP-PLT-032025"
                                date="Mar 19, 2025"
                                location="Jakarta"
                            />
                            <TrainingCard
                                title="E-GLDP LEADERSHIP SKILL"
                                code="TRN8-HO-HCG-092025"
                                date="Sep 16, 2025"
                                location="Online"
                            />
                            <TrainingCard
                                title="E-GLDP LEADERSHIP SKILL"
                                code="TRN26-HO-HCG-092025"
                                date="Sep 26, 2025"
                                location="LMS"
                            />
                        </div>
                    </Card>
                </div>

                {/* Column 2 */}
                <div className="space-y-6">
                    {/* Upcoming Certification */}
                    <Card title="Upcoming Certification">
                        <div className="h-32 flex items-center justify-center text-gray-400 text-sm">
                            No item
                        </div>
                    </Card>

                    {/* Expiring Certifications */}
                    <Card title="Expiring Certifications">
                        <div className="bg-red-100 border-l-4 border-red-400 p-4 rounded-r shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-800 text-sm leading-tight">IMPLEMENTASI SISTEM MANAJEMEN KESELAMATAN PERTAMBANGAN - SMKP</h4>
                                <FileText size={16} className="text-gray-600" />
                            </div>
                            <div className="mt-4 space-y-1 text-xs text-gray-600">
                                <div className="flex justify-between">
                                    <span>Release Date</span>
                                    <span>Oct 29, 2025</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Expiry Date</span>
                                    <span>Dec 31, 2025</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Column 3 */}
                <div className="space-y-6">
                    {/* Reminder */}
                    <Card title="Reminder">
                        <div className="bg-blue-200 p-4 rounded shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-900 text-sm">PREVENTIVE MAINTENANCE WHEEL LOADER WA200</h4>
                                <User size={16} className="text-gray-700" />
                            </div>
                            <div className="text-xs text-gray-600 space-y-1 mb-3">
                                <p>ASSESSMENT</p>
                                <p>Attendance</p>
                            </div>
                            <div className="border-t border-blue-300 pt-2">
                                <p className="text-xs text-gray-500 mb-1">Description</p>
                                <p className="text-xs text-gray-700 font-medium">LEARNING PATH FHN</p>
                            </div>
                        </div>
                    </Card>
                </div>

            </div>
        </div>
    )
}

function Card({ title, children }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">{title}</h3>
                <LayoutList size={18} className="text-gray-400" />
            </div>
            {children}
        </div>
    )
}

function TrainingCard({ title, code, date, location }) {
    return (
        <div className="bg-blue-200 p-3 rounded shadow-sm">
            <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 text-xs">{title}</h4>
                <User size={14} className="text-gray-700" />
            </div>
            <p className="text-[10px] text-gray-600 mb-3">{code}</p>

            <div className="border-t border-blue-300 pt-2 flex justify-between text-[10px] text-gray-700">
                <div className="space-y-1">
                    <p className="text-gray-500">Start Date</p>
                    <p className="text-gray-500">Location</p>
                </div>
                <div className="space-y-1 text-right">
                    <p className="font-medium">{date}</p>
                    <p className="font-medium">{location}</p>
                </div>
            </div>
        </div>
    )
}
