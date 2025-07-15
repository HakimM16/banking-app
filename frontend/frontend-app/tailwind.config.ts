// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/app/**/*.{js,ts,jsx,tsx}",
        "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gray: {
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
                blue: {
                    600: '#2563eb',
                },
            },
        },
    },
    plugins: [],
}

export default config