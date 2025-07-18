// src/app/(dashboard)/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { updateUserData } from '@/lib/data';
import { ProfileFormInputs } from '@/types'; // Import type

export default function ProfilePage() {
    const { currentUser, updateUserInContext } = useAuth();
    const { addAlert } = useAlerts();

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

        const { success, updatedUser, message } = await updateUserData(currentUser.id, profileForm);

        if (success && updatedUser) {
            updateUserInContext(updatedUser);
            addAlert('Profile updated successfully!', 'success');
        } else {
            addAlert(message || 'Failed to update profile.', 'error');
        }
    };

    if (!currentUser) {
        return <p>Loading user data...</p>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-50 mb-8 flex items-center gap-3">
                <User size={32} /> Profile Settings
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-md max-w-2xl mx-auto">
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <div className="rounded-full bg-gray-100 px-4 py-2 inline-block">
                                <p>{profileForm.firstName}</p>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <div className="rounded-full bg-gray-100 px-4 py-2 inline-block">
                                <p>{profileForm.firstName}</p>
                            </div>
                        </div>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <div className="rounded-full bg-gray-100 px-4 py-2 inline-block">
                            <p>{profileForm.email}</p>
                        </div>
                    </div>
                     <br/>
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <div className="rounded-full bg-gray-100 px-4 py-2 inline-block">
                            <p>{profileForm.phone}</p>
                        </div>
                    </div>
                    <br/>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <div className="rounded-full bg-gray-100 px-4 py-2 inline-block">
                            <p>{profileForm.address}</p>
                        </div>
                    </div>
                    <br/>

                    <button
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            onClick={() => window.location.href = '/update'}
                    >
                            <Settings size={20} />
                            Update Profile
                    </button>
            </div>
        </div>
    );
}