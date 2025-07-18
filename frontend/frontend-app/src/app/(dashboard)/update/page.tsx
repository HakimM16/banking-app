// src/app/(dashboard)/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { updateUserData } from '@/lib/data';
import { ProfileFormInputs } from '@/types'; // Import type

export default function ProfilePage() {
    const {currentUser, updateUserInContext} = useAuth();
    const {addAlert} = useAlerts();

    const [profileForm, setProfileForm] = useState<ProfileFormInputs>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (currentUser) {
            setProfileForm({
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                phone: currentUser.phone || '',
                address: currentUser.address || ''
            });
        }
    }, [currentUser]);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        const {success, updatedUser, message} = await updateUserData(currentUser.id, profileForm);

        if (success && updatedUser) {
            updateUserInContext(updatedUser);
            addAlert('Profile updated successfully!', 'success');
        } else {
            addAlert(message || 'Failed to update profile.', 'error');
        }

        // redirect to profile page after update
        window.location.href = '/profile';

    };

    if (!currentUser) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-50 mb-8 flex items-center gap-3">
                <User size={32}/> Profile Settings
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First
                                Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={profileForm.firstName}
                                onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last
                                Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={profileForm.lastName}
                                onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email
                            Address</label>
                        <input
                            type="email"
                            id="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone
                            Number</label>
                        <input
                            type="tel"
                            id="phone"
                            value={profileForm.phone}
                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="address"
                               className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            id="address"
                            value={profileForm.address}
                            onChange={(e) => setProfileForm({...profileForm, address: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Settings size={20}/>
                        Confirm Update
                    </button>
                </form>
            </div>
        </div>
    );
}