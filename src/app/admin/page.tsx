"use client";

import React, { useEffect, useState } from 'react';

export default function AdminPage() {
    const [settings, setSettings] = useState<any>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fetch('/api/settings')
            .then(res => res.json())
            .then(setSettings);
    }, []);

    const handleSave = () => {
        if (!settings) return;
        fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        }).then(() => {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        });
    };

    if (!settings) return <div className="p-8 mt-16 ml-64">Loading...</div>;

    return (
        <div className="p-8 mt-16 ml-64 min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Configuration</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Video Settings</h2>

                <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            className="w-5 h-5 accent-blue-600 rounded"
                            checked={settings.preventSeeking}
                            onChange={(e) => setSettings({ ...settings, preventSeeking: e.target.checked })}
                        />
                        <span className="text-gray-700 font-medium">Prevent Video Seeking (Anti-cheating)</span>
                    </label>
                </div>
                <p className="text-sm text-gray-500 mb-6">If enabled, users cannot fast-forward videos beyond what they have already watched.</p>

                <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors"
                >
                    Save Changes
                </button>
                {success && <span className="ml-4 text-green-600 font-bold">Settings Saved!</span>}
            </div>
        </div>
    );
}
