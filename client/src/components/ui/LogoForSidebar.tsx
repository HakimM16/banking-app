import React from 'react';

import { Shield } from 'lucide-react';

const Logo: React.FC = () => {
    return (
        <div className="bg-indigo-600 w-10 h-10 rounded-full flex items-center justify-center">
            <Shield size={24} />
        </div>
    );
};

export default Logo;