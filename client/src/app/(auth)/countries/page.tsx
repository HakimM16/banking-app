"use client";

import React from "react";

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

export default function CountriesPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Valid Countries</h1>
                        <p className="text-gray-600 mb-4">Countries supported by our service</p>
                    </div>

                    <ul className="space-y-2">
                        {countries.map((country) => (
                            <li key={country} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                {country}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
    );
}