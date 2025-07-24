// src/app/(dashboard)/update/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAlerts } from '@/hooks/useAlerts';
import {CustomiseAddressFormInputs, Email, ProfileFormInputs, UpdateUserFormInputs} from '@/types';
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
    const router = useRouter();
    const {currentUser, updateUser, updateAddress, emailExists} = useAuth();
    const {addAlert} = useAlerts();
    const [id, setId] = useState<string | null>(null);
    const [emailPresent, setEmailPresent] = useState<boolean>(false);
    const [validEmail, setValidEmail] = useState<boolean>(true);
    const [validPhone, setValidPhone] = useState<boolean>(true);
    const [validPostcode, setValidPostcode] = useState<boolean>(true);
    const [validCountry, setValidCountry] = useState<boolean>(true);

    // Valid countries
    const countries: string[] = [
        "United Kingdom",
        "United States",
        "Canada",
        "Australia",
        "Germany",
        "France",
        "Italy",
        "Spain",
        "Netherlands",
        "Sweden",
        "Norway",
        "Denmark",
        "Ireland",
        "Switzerland",
        "Belgium",
        "New Zealand",
        "Japan",
        "China",
        "India",
        "South Africa",
        "Brazil",
        "Mexico",
        "Singapore",
        "South Korea",
        "Portugal",
        "Thailand",
        "Turkey",
        "Indonesia",
        "United Arab Emirates",
        "Morocco",
        "Egypt",
        "Saudi Arabia",
    ];

    const [emailForm, setEmailForm] = useState<string>();

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

    // Access localStorage only on client side
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setId(localStorage.getItem('id'));
        }
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('authToken');
        // Set default Authorization header for axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const currentUserEmail = localStorage.getItem('currentUser');


        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        // Check if email already exists
        if (updateUserForm.email && currentUserEmail && updateUserForm.email !== currentUserEmail) {
            const emailCheck = await emailExists(updateUserForm.email);
            if (emailCheck.exists) {
                setEmailPresent(true);
                return;
            } else {
                if (id) {
                    const userId = parseInt(id, 10);
                    const user = await updateUser(userId, updateUserForm);
                    const address = await updateAddress(userId, addressForm);

                    if (user.success && address.success) {
                        addAlert('Profile updated successfully!', 'success');
                        // Update localStorage with new first name
                        localStorage.setItem('name', updateUserForm.firstName);
                        localStorage.setItem('currentUser', updateUserForm.email);

                        window.location.reload();
                    } else {
                        addAlert(user.message || 'Failed to update profile.', 'error');
                    }
                } else {
                    addAlert('User ID not found. Please log in again.', 'error');
                    return;
                }
            }
        } else {
            if (id) {
                const userId = parseInt(id, 10);
                const user = await updateUser(userId, updateUserForm);
                const address = await updateAddress(userId, addressForm);

                if (user.success && address.success) {
                    addAlert('Profile updated successfully!', 'success');
                    // Update localStorage with new first name
                    localStorage.setItem('name', updateUserForm.firstName);
                    localStorage.setItem('currentUser', updateUserForm.email);

                    window.location.reload();
                } else {
                    addAlert(user.message || 'Failed to update profile.', 'error');
                }
            } else {
                    addAlert('User ID not found. Please log in again.', 'error');
                    return;
                }
        }


    };

    if (!currentUser) {
        return (
            <div className="flex h-screen items-center justify-center bg-indigo-900">
                <div className="text-white text-xl">Loading data</div>
            </div>
        )
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
                            onChange={(e) => {
                                setUpdateUserForm({...updateUserForm, email: e.target.value});
                                setEmailForm(e.target.value);
                                setValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. john@gmail.com"
                        />
                        {!validEmail && (
                            <p className="text-red-600 mt-2">
                                Please enter a valid email address.
                            </p>
                        )}

                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone
                            Number</label>
                        <input
                            type="tel"
                            id="phone"
                            value={updateUserForm.phoneNumber}
                            onChange={(e) => {
                                setUpdateUserForm({...updateUserForm, phoneNumber: e.target.value});
                                setValidPhone(/^\d{11,15}$/.test(e.target.value)); // Adjust regex as needed
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. 01234567890"
                        />
                        {!validPhone && (
                            <p className="text-red-600 mt-2">
                                Please enter a valid phone number (11-15 digits).
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="street"
                               className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                            type="text"
                            id="street"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. 123 Main St"
                        />
                    </div>
                    <div>
                        <label htmlFor="city"
                               className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            id="city"
                            value={addressForm.city}
                            onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. London"
                        />
                    </div>
                    <div>
                        <label htmlFor="county"
                               className="block text-sm font-medium text-gray-700 mb-2">County</label>
                        <input
                            type="text"
                            id="county"
                            value={addressForm.county}
                            onChange={(e) => setAddressForm({...addressForm, county: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. Hertfordshire"
                        />
                    </div>
                    <div>
                        <label htmlFor="postCode"
                               className="block text-sm font-medium text-gray-700 mb-2">PostCode</label>
                        <input
                            type="text"
                            id="postCode"
                            value={addressForm.postCode}
                            onChange={(e) => {
                                setAddressForm({...addressForm, postCode: e.target.value});
                                setValidPostcode(/^[A-Z0-9]{5,7}$/.test(e.target.value)); // UK postcode regex
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g LU40XX"
                        />
                        {!validPostcode && (
                            <p className="text-red-600 mt-2">
                                Please enter a valid UK postcode.
                            </p>
                        )}
                    </div>
                    <div>
                        <label htmlFor="country"
                               className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            id="country"
                            value={addressForm.country}
                            onChange={(e) => {
                                setAddressForm({...addressForm, country: e.target.value});
                                setValidCountry(countries.includes(e.target.value)); // Check if country is valid
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            placeholder="e.g. United Kingdom"
                        />
                    </div>
                    {!validCountry && (
                        <p className="text-red-600 mt-2">
                            Please enter a valid country.
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Settings size={20}/>
                        Confirm Update
                    </button>
                    <div className="text-center mt-2">
                        <button type="button" onClick={() => window.open('/countries', '_blank')} className="text-indigo-600 hover:text-blue-800 text-sm cursor-pointer" >
                            View available countries
                        </button>
                    </div>
                </form>

                {emailPresent && (
                    <p className="text-red-600 mt-2">
                        Email already exists. Please use a different email address.
                    </p>
                )}
            </div>
        </div>
    );
}