"use client";

import React, { useState } from 'react';
import {useAlerts} from "@/hooks/useAlerts";
import {useRouter} from "next/navigation";
import {useAuth} from "@/providers/AuthProvider";
import LogoForForms from "@/components/ui/LogoForForms";
import {Eye, EyeOff, Shield} from "lucide-react";

interface AddressFormProps {
    id: number | null; // or number, depending on your id type
}

const AddressForm: React.FC<AddressFormProps> = ({ id }) => {
    const [addressForm, setAddressForm] = useState({
        street: '',
        city: '',
        county: '',
        postCode: '',
        country: ''
    });

    const { addAlert } = useAlerts();
    const [isValidated, setIsValidated] = useState(true); // This state is used to show an invalid message if the form is not validated
    const router = useRouter();
    const { createAddress} = useAuth();
    const [validPostcode, setValidPostcode] = useState<boolean>(true);
    const [validCountry, setValidCountry] = useState<boolean>(true);
    const [notCaptials, setNotCaptials] = useState(true); // This state is used to show an invalid message if the letters after the first letter are not capitalized

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await createAddress(addressForm, id);

        if (result.success) {
            addAlert('Registration successful! Please login.', 'success');
            // Make a page where you create the address
            router.push('/login');

        } else {
            addAlert(result.message || 'Registration failed. Please try again.', 'error');
            setIsValidated(false);
            router.push('/register');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <LogoForForms />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Vesta</h1>
                    <p className="text-gray-600">Complete your address</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                            type="text"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm({...addressForm, street: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. 123 Main St"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) => {
                                setAddressForm({...addressForm, city: e.target.value});
                                setNotCaptials(e.target.value.substring(1).match(/[A-Z]/) !== null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. London"
                        />
                        {/* Check if the first letter is capitalized and the rest are not*/}
                        {notCaptials && addressForm.city.length > 0 && (
                            <p className="text-red-600 mt-2">
                                The first letter must be capitalised, and the rest must not be.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
                        <input
                            type="text"
                            value={addressForm.county}
                            onChange={(e) => {
                                setAddressForm({...addressForm, county: e.target.value});
                                setNotCaptials(e.target.value.substring(1).match(/[A-Z]/) !== null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g. Hertfordshire"
                        />
                        {/* Check if the first letter is capitalized and the rest are not*/}
                        {notCaptials && addressForm.county.length > 0 && (
                            <p className="text-red-600 mt-2">
                                The first letter must be capitalised, and the rest must not be.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Postcode</label>
                        <input
                            type="text"
                            value={addressForm.postCode}
                            onChange={(e) => {
                                setAddressForm({...addressForm, postCode: e.target.value});
                                setValidPostcode(/^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]{5,7}$/.test(e.target.value)); // UK postcode regex - only uppercase letters and numbers, 5-7 characters, must contain both // UK postcode regex
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g LU40XX"
                        />
                        {!validPostcode && addressForm.postCode.length > 0 && (
                            <p className="text-red-600 mt-2">
                                Please enter a valid UK postcode.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                            type="text"
                            value={addressForm.country}
                            onChange={(e) => {
                                setAddressForm({...addressForm, country: e.target.value});
                                setValidCountry(countries.includes(e.target.value)); // Check if country is valid
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        <Shield size={20} className="inline-block mr-2" />
                        Submit
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="text-indigo-600 hover:text-blue-800 text-sm cursor-pointer"
                        >
                            Already have an account? Login here
                        </button>
                    </div>
                    <div className="text-center mt-2">
                        <button type="button" onClick={() => window.open('/countries', '_blank')} className="text-indigo-600 hover:text-blue-800 text-sm cursor-pointer" >
                            View available countries
                        </button>
                    </div>
                    {!isValidated ?
                        <div className="text-red-500 text-base font-semibold text-center mt-2">
                            Invalid credentials. Please try again.
                        </div>
                        : null
                    }
                </form>
            </div>
        </div>
    );
}

export default AddressForm;