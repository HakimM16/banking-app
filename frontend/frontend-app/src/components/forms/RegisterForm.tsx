// src/components/forms/RegisterForm.tsx
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAlerts } from '@/hooks/useAlerts';
import { useRouter } from 'next/navigation';
import { registerNewUser } from '@/lib/data';
import { RegisterFormInputs } from '@/types'; // Import type
import LogoForForms from '@/components/ui/LogoForForms'; // Import your LogoForForms component

const RegisterForm: React.FC = () => {
    const [registerForm, setRegisterForm] = useState<RegisterFormInputs>({
        username: '',
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        address: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { addAlert } = useAlerts();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await registerNewUser(registerForm);
        if (result.success) {
            addAlert('Registration successful! Please login.', 'success');
            router.push('/login');
            setRegisterForm({ // Clear form
                username: '', email: '', password: '', firstName: '',
                lastName: '', phone: '', address: ''
            });
        } else {
            addAlert(result.message || 'Registration failed. Please try again.', 'error');
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
                                onChange={(e) => setRegisterForm({...registerForm, firstName: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="First name"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                            <input
                                type="text"
                                value={registerForm.lastName}
                                onChange={(e) => setRegisterForm({...registerForm, lastName: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Last name"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={registerForm.username}
                            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Choose username"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={registerForm.email}
                            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Email address"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                            type="tel"
                            value={registerForm.phone}
                            onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input
                            type="text"
                            value={registerForm.address}
                            onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Full address"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={registerForm.password}
                                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
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
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Register
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/login')}
                            className="text-indigo-600 hover:text-blue-800 text-sm"
                        >
                            Already have an account? Login here
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;