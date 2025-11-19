import { BookOpen, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const HeaderMobile = () => {
    const { logout } = useAuth();

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                        <h1 className="text-lg font-bold text-gray-900">LearnHub</h1>
                    </div>

                    <button
                        onClick={logout}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
};
