// src/components/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import {redirect, useRouter} from 'next/navigation';
import { LoginFormInputs } from '@/types'; // Import type
import LogoForForms from '@/components/ui/LogoForForms'; // Import your LogoForForms component
import { api } from '@/services/api'; // Import your API service

const LoginForm: React.FC = () => {
    const [loginForm, setLoginForm] = useState<LoginFormInputs>({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isValidated, setIsValidated] = useState(true); // This state is used to show an invalid message if the form is not validated
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login(loginForm); // Now this matches

        if (result.success) {
            console.log('Login successful!', 'success');
            router.push('/home');
        } else {
            console.log(result.message || 'Invalid credentials. Please try again.', 'error');
            setIsValidated(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <LogoForForms/>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Vesta</h1>
                    <p className="text-gray-600">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="text"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
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
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/register')}
                            className="text-indigo-600 hover:text-blue-800 text-sm cursor-pointer"
                        >
                            Don&#39;t have an account? Register here
                        </button>
                    </div>
                    {!isValidated ?
                    <div className="text-red-500 text-base font-semibold text-center mt-2">
                        Invalid email or password. Please try again.
                    </div>
                        : null
                    }
                </form>
            </div>
        </div>
    );
};

export default LoginForm;