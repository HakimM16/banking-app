import React from 'react';

import { Shield } from 'lucide-react';

const LogoForForms: React.FC = () => {
    return (
        <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="text-white" size={32} />
        </div>
    );
};

export default LogoForForms;