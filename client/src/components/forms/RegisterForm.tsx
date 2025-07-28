// src/components/forms/RegisterForm.tsx
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RegisterFormInputs } from '@/types'; // Import type
import LogoForForms from '@/components/ui/LogoForForms';
import {useAuth} from "@/providers/AuthProvider"; // Import your LogoForForms component

const RegisterForm: React.FC = () => {
    const [registerForm, setRegisterForm] = useState<RegisterFormInputs>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        password: '',
        role: 'USER'
    });
    const [validEmail, setValidEmail] = useState<boolean>(true);
    const [validPhone, setValidPhone] = useState<boolean>(true);
    const [validPassword, setValidPassword] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState(false);
    const [notCapitalized, setNotCapitalized] = useState(false);
    const [notCaptials, setNotCaptials] = useState(true); // This state is used to show an invalid message if the letters after the first letter are not capitalized
    const [isValidated, setIsValidated] = useState(true); // This state is used to show an invalid message if the form is not validated
    const router = useRouter();
    const { register, createAddress} = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await register(registerForm);

        if (result.success) {
            console.log('Registration successful! Please login.', 'success');
            console.log(result.id);

            // Store user ID in localStorage
            if (result.id) {
                localStorage.setItem('registeredUserId', result.id.toString());
            } else {
                console.error('Registration successful, but no ID was returned.');
            }
            // Navigate to the address page (without query params)
            router.push('/create_address');
        } else {
            console.log(result.message || 'Registration failed. Please try again.', 'error');
            setIsValidated(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <LogoForForms />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Vesta</h1>
                    <p className="text-gray-600">Create your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                            <input
                                type="text"
                                value={registerForm.firstName}
                                onChange={(e) => {
                                    setRegisterForm({...registerForm, firstName: e.target.value});
                                    setNotCaptials(e.target.value.substring(1).match(/[A-Z]/) !== null);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="First name"
                                required
                            />
                            {/* Check if the first letter is capitalized and the rest are not*/}
                            {notCaptials && registerForm.firstName.length > 0 && (
                                <p className="text-red-600 mt-2">
                                    The first letter must be capitalised, and the rest must not be.
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                value={registerForm.lastName}
                                onChange={(e) => {
                                    setRegisterForm({...registerForm, lastName: e.target.value});
                                    setNotCaptials(e.target.value.substring(1).match(/[A-Z]/) !== null);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Last name"
                                required
                            />
                            {/*Check if the first letter is capitalized and the rest are not*/}
                            {notCaptials && registerForm.lastName.length > 0 && (
                                <p className="text-red-600 mt-2">
                                    The first letter must be capitalised, and the rest must not be.
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => {
                                setRegisterForm({...registerForm, email: e.target.value});
                                setValidEmail(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value));
                                setNotCapitalized(/^[A-Z]/.test(e.target.value)); // Check if the first letter is capitalized
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email address"
                            required
                        />
                        {!validEmail && registerForm.email.length > 0 && (
                            <p className="text-red-600 mt-2">
                                Please enter a valid email address.
                            </p>
                        )}
                        {notCapitalized && registerForm.email.length > 0 && (
                            <p className="text-red-600 mt-2">
                                Email must not start with a capital letter.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            value={registerForm.phoneNumber}
                            onChange={(e) => {
                                setRegisterForm({...registerForm, phoneNumber: e.target.value});
                                setValidPhone(/^\d{11,15}$/.test(e.target.value));
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone number"
                        />
                        {!validPhone && registerForm.phoneNumber.length > 0 && (
                            <p className="text-red-600 mt-2">
                                Please enter a valid phone number (11-15 digits).
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={registerForm.password}
                                onChange={(e) => {
                                    setRegisterForm({...registerForm, password: e.target.value});
                                    setValidPassword(/^(?=.*\d).{6,}$/.test(e.target.value)); // At least 6 characters and at least one digit
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Create password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {!validPassword && registerForm.password && (
                            <p className="text-red-600 mt-2">
                                Password must be at least 6 characters long and contain at least one digit.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        <Shield size={20} className="inline-block mr-2" />
                        Enter Address
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
};

export default RegisterForm;