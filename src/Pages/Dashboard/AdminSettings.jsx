import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaCog, FaSave, FaBell, FaShieldAlt, FaDatabase, FaPalette, FaInfoCircle } from 'react-icons/fa';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        notifications: {
            emailNotifications: true,
            campaignApprovals: true,
            newMessages: true,
            weeklyReports: false,
        },
        platform: {
            maintenanceMode: false,
            allowNewRegistrations: true,
            requireEmailVerification: false,
            autoApproveCharities: false,
        },
        appearance: {
            theme: 'night',
            primaryColor: 'blue',
            showBanner: true,
        },
        security: {
            sessionTimeout: 30,
            requireStrongPasswords: true,
            twoFactorAuth: false,
        },
    });

    const [saving, setSaving] = useState(false);
    const [feedback, setFeedback] = useState({ type: '', text: '' });

    const handleChange = (section, key, value) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setFeedback({ type: '', text: '' });

        setTimeout(() => {
            setFeedback({ type: 'success', text: 'Settings saved successfully!' });
            setSaving(false);
            setTimeout(() => setFeedback({ type: '', text: '' }), 3000);
        }, 1000);
    };

    return (
        <>
            <Helmet>
                <title>Admin Settings - Charity Platform</title>
            </Helmet>

            <div className="space-y-6 p-4 bg-black/70 backdrop-blur rounded-3xl text-white">

                {/* Header */}
                <div className="bg-black/80 backdrop-blur rounded-2xl p-6 shadow-xl border border-white/10 flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaCog />
                        Admin Settings
                    </h1>
                    <p className="text-gray-400">
                        Configure platform settings, notifications, security, and appearance preferences
                    </p>
                </div>

                {feedback.text && (
                    <div
                        className={`alert ${
                            feedback.type === 'success'
                                ? 'bg-green-500/10 border border-green-500/30 text-green-300'
                                : 'bg-red-500/10 border border-red-500/30 text-red-300'
                        } shadow-lg`}
                    >
                        {feedback.text}
                    </div>
                )}

                {/* Notifications */}
                <div className="card bg-black/70 backdrop-blur shadow-xl border border-white/10">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaBell className="text-2xl text-blue-400" />
                            <h2 className="card-title">Notification Settings</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                ['Email Notifications', 'Receive email alerts', 'emailNotifications'],
                                ['Campaign Approvals', 'New campaigns need approval', 'campaignApprovals'],
                                ['New Messages', 'User support messages', 'newMessages'],
                                ['Weekly Reports', 'Weekly summaries', 'weeklyReports'],
                            ].map(([title, desc, key]) => (
                                <label
                                    key={key}
                                    className="flex items-center justify-between cursor-pointer p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                                >
                                    <div>
                                        <span className="font-semibold">{title}</span>
                                        <p className="text-sm text-gray-400">{desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-primary"
                                        checked={settings.notifications[key]}
                                        onChange={(e) => handleChange('notifications', key, e.target.checked)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Platform */}
                <div className="card bg-black/70 backdrop-blur shadow-xl border border-white/10">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaDatabase className="text-2xl text-purple-400" />
                            <h2 className="card-title">Platform Settings</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                ['Maintenance Mode', 'Disable public access', 'maintenanceMode'],
                                ['Allow New Registrations', 'Enable signups', 'allowNewRegistrations'],
                                ['Require Email Verification', 'Verify emails', 'requireEmailVerification'],
                                ['Auto-Approve Charities', 'Skip manual approval', 'autoApproveCharities'],
                            ].map(([title, desc, key]) => (
                                <label
                                    key={key}
                                    className="flex items-center justify-between cursor-pointer p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                                >
                                    <div>
                                        <span className="font-semibold">{title}</span>
                                        <p className="text-sm text-gray-400">{desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-secondary"
                                        checked={settings.platform[key]}
                                        onChange={(e) => handleChange('platform', key, e.target.checked)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Security */}
                <div className="card bg-black/70 backdrop-blur shadow-xl border border-white/10">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaShieldAlt className="text-2xl text-red-400" />
                            <h2 className="card-title">Security Settings</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <label className="label">
                                    <span className="label-text text-gray-300 font-semibold">
                                        Session Timeout (minutes)
                                    </span>
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="120"
                                    className="input bg-black/60 border border-white/20 text-white w-full max-w-xs"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) =>
                                        handleChange('security', 'sessionTimeout', parseInt(e.target.value))
                                    }
                                />
                            </div>

                            {[
                                ['Require Strong Passwords', 'Enforce complexity', 'requireStrongPasswords'],
                                ['Two-Factor Authentication', 'Require 2FA', 'twoFactorAuth'],
                            ].map(([title, desc, key]) => (
                                <label
                                    key={key}
                                    className="flex items-center justify-between cursor-pointer p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                                >
                                    <div>
                                        <span className="font-semibold">{title}</span>
                                        <p className="text-sm text-gray-400">{desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="toggle toggle-accent"
                                        checked={settings.security[key]}
                                        onChange={(e) => handleChange('security', key, e.target.checked)}
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="card bg-black/70 backdrop-blur shadow-xl border border-white/10">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaPalette className="text-2xl text-pink-400" />
                            <h2 className="card-title">Appearance Settings</h2>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <label className="label">
                                    <span className="label-text text-gray-300 font-semibold">Theme</span>
                                </label>
                                <select
                                    className="select bg-black/60 border border-white/20 text-white w-full max-w-xs"
                                    value={settings.appearance.theme}
                                    onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                                >
                                    <option value="night">Night</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>

                            <label className="flex items-center justify-between cursor-pointer p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition">
                                <div>
                                    <span className="font-semibold">Show Banner</span>
                                    <p className="text-sm text-gray-400">Homepage announcement banner</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-secondary"
                                    checked={settings.appearance.showBanner}
                                    onChange={(e) =>
                                        handleChange('appearance', 'showBanner', e.target.checked)
                                    }
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="card bg-black/60 backdrop-blur shadow-xl border border-blue-500/20">
                    <div className="card-body flex gap-3">
                        <FaInfoCircle className="text-2xl text-blue-400 mt-1" />
                        <div>
                            <h3 className="font-bold mb-2">About Settings</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                These settings control platform behavior and appearance. Changes take effect immediately after saving.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Save */}
                <div className="flex justify-end">
                    <button
                        className="btn btn-primary btn-lg shadow-lg"
                        onClick={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <span className="loading loading-spinner"></span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <FaSave />
                                Save All Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
};

export default AdminSettings;
