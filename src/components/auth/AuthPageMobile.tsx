import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Login } from './Login';
import { Register } from './Register';

export const AuthPageMobile = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center p-4">
            <div className="w-full">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <BookOpen className="w-10 h-10 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-900">LearnHub</h1>
                    </div>
                    <p className="text-sm text-gray-600">Your complete learning platform</p>
                </div>

                <div className="bg-white p-4">
                    {isLogin ? (
                        <Login onToggle={() => setIsLogin(false)} />
                    ) : (
                        <Register onToggle={() => setIsLogin(true)} />
                    )}
                </div>
            </div>
        </div>
    );
};
