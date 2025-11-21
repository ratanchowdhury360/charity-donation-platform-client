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
        
        // Simulate save operation
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

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-lg p-6 shadow-xl flex flex-col gap-2">
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <FaCog />
                        Admin Settings
                    </h1>
                    <p className="text-white/80">
                        Configure platform settings, notifications, security, and appearance preferences
                    </p>
                </div>

                {feedback.text && (
                    <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
                        {feedback.text}
                    </div>
                )}

                {/* Notifications Settings */}
                <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaBell className="text-2xl text-primary" />
                            <h2 className="card-title text-gray-900">Notification Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 hover:bg-primary/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Email Notifications</span>
                                    <p className="text-sm text-gray-600">Receive email alerts for important events</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={settings.notifications.emailNotifications}
                                    onChange={(e) => handleChange('notifications', 'emailNotifications', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20 hover:bg-secondary/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Campaign Approvals</span>
                                    <p className="text-sm text-gray-600">Get notified when new campaigns need approval</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-secondary"
                                    checked={settings.notifications.campaignApprovals}
                                    onChange={(e) => handleChange('notifications', 'campaignApprovals', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20 hover:bg-accent/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">New Messages</span>
                                    <p className="text-sm text-gray-600">Alert when users send support messages</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-accent"
                                    checked={settings.notifications.newMessages}
                                    onChange={(e) => handleChange('notifications', 'newMessages', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-info/10 to-info/5 rounded-lg border border-info/20 hover:bg-info/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Weekly Reports</span>
                                    <p className="text-sm text-gray-600">Receive weekly summary reports</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-info"
                                    checked={settings.notifications.weeklyReports}
                                    onChange={(e) => handleChange('notifications', 'weeklyReports', e.target.checked)}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Platform Settings */}
                <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaDatabase className="text-2xl text-primary" />
                            <h2 className="card-title text-gray-900">Platform Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg border border-warning/20 hover:bg-warning/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Maintenance Mode</span>
                                    <p className="text-sm text-gray-600">Temporarily disable public access</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-warning"
                                    checked={settings.platform.maintenanceMode}
                                    onChange={(e) => handleChange('platform', 'maintenanceMode', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg border border-success/20 hover:bg-success/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Allow New Registrations</span>
                                    <p className="text-sm text-gray-600">Enable new user and charity registrations</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-success"
                                    checked={settings.platform.allowNewRegistrations}
                                    onChange={(e) => handleChange('platform', 'allowNewRegistrations', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 hover:bg-primary/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Require Email Verification</span>
                                    <p className="text-sm text-gray-600">Users must verify email before access</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-primary"
                                    checked={settings.platform.requireEmailVerification}
                                    onChange={(e) => handleChange('platform', 'requireEmailVerification', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-info/10 to-info/5 rounded-lg border border-info/20 hover:bg-info/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Auto-Approve Charities</span>
                                    <p className="text-sm text-gray-600">Automatically approve new charity registrations</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-info"
                                    checked={settings.platform.autoApproveCharities}
                                    onChange={(e) => handleChange('platform', 'autoApproveCharities', e.target.checked)}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Security Settings */}
                <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaShieldAlt className="text-2xl text-primary" />
                            <h2 className="card-title text-gray-900">Security Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-900">Session Timeout (minutes)</span>
                                </label>
                                <input
                                    type="number"
                                    min="5"
                                    max="120"
                                    className="input input-bordered  border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900 w-full max-w-xs"
                                    value={settings.security.sessionTimeout}
                                    onChange={(e) => handleChange('security', 'sessionTimeout', parseInt(e.target.value))}
                                />
                            </div>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20 hover:bg-secondary/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Require Strong Passwords</span>
                                    <p className="text-sm text-gray-600">Enforce password complexity requirements</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-secondary"
                                    checked={settings.security.requireStrongPasswords}
                                    onChange={(e) => handleChange('security', 'requireStrongPasswords', e.target.checked)}
                                />
                            </label>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-accent/10 to-accent/5 rounded-lg border border-accent/20 hover:bg-accent/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Two-Factor Authentication</span>
                                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-accent"
                                    checked={settings.security.twoFactorAuth}
                                    onChange={(e) => handleChange('security', 'twoFactorAuth', e.target.checked)}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Appearance Settings */}
                <div className="card bg-gradient-to-br from-white via-primary/10 to-secondary/10 shadow-xl border-2 border-primary/20">
                    <div className="card-body">
                        <div className="flex items-center gap-3 mb-6">
                            <FaPalette className="text-2xl text-primary" />
                            <h2 className="card-title text-gray-900">Appearance Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                                <label className="label">
                                    <span className="label-text font-semibold text-gray-900">Theme</span>
                                </label>
                                <select
                                    className="select select-bordered  border-2 border-primary/30 focus:border-primary focus:ring-2 focus:ring-primary text-gray-900 w-full max-w-xs"
                                    value={settings.appearance.theme}
                                    onChange={(e) => handleChange('appearance', 'theme', e.target.value)}
                                >
                                    <option value="night">Night</option>
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>
                            <label className="flex items-center justify-between cursor-pointer p-4 bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-lg border border-secondary/20 hover:bg-secondary/15 transition-all">
                                <div>
                                    <span className="font-semibold text-gray-900">Show Banner</span>
                                    <p className="text-sm text-gray-600">Display announcement banner on homepage</p>
                                </div>
                                <input
                                    type="checkbox"
                                    className="toggle toggle-secondary"
                                    checked={settings.appearance.showBanner}
                                    onChange={(e) => handleChange('appearance', 'showBanner', e.target.checked)}
                                />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Info Card */}
                <div className="card bg-gradient-to-br from-info/20 via-primary/10 to-info/20 shadow-xl border-2 border-info/30">
                    <div className="card-body">
                        <div className="flex items-start gap-3">
                            <FaInfoCircle className="text-2xl text-info mt-1" />
                            <div>
                                <h3 className="font-bold text-white mb-2">About Settings</h3>
                                <p className="text-sm  leading-relaxed">
                                    These settings control the behavior and appearance of the platform. Changes take effect immediately after saving.
                                    Some settings may require a page refresh to see the changes.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        className="btn btn-primary btn-lg shadow-lg hover:shadow-xl"
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

