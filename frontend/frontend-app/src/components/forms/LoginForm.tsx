// src/components/forms/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useAlerts } from '@/hooks/useAlerts';
import { useRouter } from 'next/navigation';
import { LoginFormInputs } from '@/types'; // Import type

const LoginForm: React.FC = () => {
    const [loginForm, setLoginForm] = useState<LoginFormInputs>({ username: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const { addAlert } = useAlerts();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await login(loginForm.username, loginForm.password);
        if (result.success) {
            addAlert('Login successful!', 'success');
            router.push('/home'); // Redirect to home page after successful login
        } else {
            addAlert(result.message || 'Invalid credentials. Please try again.', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="text-white" size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">SecureBank</h1>
                    <p className="text-gray-600">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            value={loginForm.username}
                            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter username"
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
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Login
                    </button>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={() => router.push('/register')}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            Don't have an account? Register here
                        </button>
                    </div>
                </form>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
                    <p className="text-sm text-gray-800"><strong>Username:</strong> john_doe</p>
                    <p className="text-sm text-gray-800"><strong>Password:</strong> password123</p>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;