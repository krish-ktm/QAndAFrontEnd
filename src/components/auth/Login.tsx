import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AnimatedInput } from '../ui/AnimatedInput';
import { motion } from 'framer-motion';
import { mockUsers } from '../../data/mockData';

interface LoginProps {
  onToggle: () => void;
}

export const Login = ({ onToggle }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
      <p className="text-gray-600 mb-8">Sign in to continue your learning journey</p>

      <div className="mb-6 p-3 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Quick Login</h3>
        <div className="flex flex-wrap gap-2">
          {mockUsers.map(user => (
            <button
              key={user.id}
              type="button"
              onClick={() => {
                setEmail(user.email);
                setPassword(user.password);
              }}
              className="text-xs px-2 py-1 bg-white border border-blue-200 rounded hover:bg-blue-100 transition"
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatedInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          label="Email"
          placeholder="you@example.com"
        />

        <AnimatedInput
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          label="Password"
          placeholder="••••••••"
        />

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <motion.button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onToggle}
          className="text-blue-600 font-medium hover:text-blue-700 transition"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};
