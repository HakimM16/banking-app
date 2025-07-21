// src/app/(dashboard)/profile/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { updateUserData } from '@/lib/data';
import {CustomiseAddressFormInputs, ProfileFormInputs, UpdateUserFormInputs} from '@/types';
import { useRouter } from "next/navigation";
import axios from "axios"; // Import type

export default function ProfilePage() {
    const router = useRouter(); // Initialize the router hook
    const {currentUser, updateUser, updateAddress} = useAuth();
    const {addAlert} = useAlerts();

    const [updateUserForm, setUpdateUserForm] = useState<UpdateUserFormInputs>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
    });

    const [addressForm, setAddressForm] = useState<CustomiseAddressFormInputs>({
        street: '',
        city: '',
        county: '',
        postCode: '',
        country: ''
    });

    const id = localStorage.getItem('id');

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem('authToken');
        // Set the default Authorization header for all future axios requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        if (id) {
            const userId = parseInt(id, 10);
            // Prepare the data to be sent
            const user = await updateUser(userId, updateUserForm);
            const address = await updateAddress(userId, addressForm);

            if (user.success && address.success) {
                addAlert('Profile updated successfully!', 'success');
                // Optionally, you can redirect or refresh the page
                await router.push('/profile');
            } else {
                addAlert(user.message || 'Failed to update profile.', 'error');
            }
        } else {
            addAlert('User ID not found. Please log in again.', 'error');
            return;
        }


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
                                value={updateUserForm.firstName}
                                onChange={(e) => setUpdateUserForm({...updateUserForm, firstName: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="e.g. John"
                            />
                        </div>
                        <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last
                                Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={updateUserForm.lastName}
                                onChange={(e) => setUpdateUserForm({...updateUserForm, lastName: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                                placeholder="e.g. Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email
                            Address</label>
                        <input
                            type="email"
                            id="email"
                            value={updateUserForm.email}
                            onChange={(e) => setUpdateUserForm({...updateUserForm, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. john@gmail.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone
                            Number</label>
                        <input
                            type="tel"
                            id="phone"
                            value={updateUserForm.phoneNumber}
                            onChange={(e) => setUpdateUserForm({...updateUserForm, phoneNumber: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. 01234 567890"
                        />
                    </div>

                    <div>
                        <label htmlFor="address"
                               className="block text-sm font-medium text-gray-700 mb-2">Street</label>
                        <input
                            type="text"
                            id="address"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. 123 Main St"
                        />
                    </div>
                    <div>
                        <label htmlFor="address"
                               className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            id="address"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. London"
                        />
                    </div>
                    <div>
                        <label htmlFor="address"
                               className="block text-sm font-medium text-gray-700 mb-2">County</label>
                        <input
                            type="text"
                            id="address"
                            value={addressForm.county}
                            onChange={(e) => setAddressForm({...addressForm, county: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. Hertfordshire"
                        />
                    </div>
                    <div>
                        <label htmlFor="address"
                               className="block text-sm font-medium text-gray-700 mb-2">PostCode</label>
                        <input
                            type="text"
                            id="address"
                            value={addressForm.postCode}
                            onChange={(e) => setAddressForm({...addressForm, postCode: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g LU40XX"
                        />
                    </div>
                    <div>
                        <label htmlFor="address"
                               className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            id="address"
                            value={addressForm.country}
                            onChange={(e) => setAddressForm({...addressForm, country: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. United Kingdom"
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