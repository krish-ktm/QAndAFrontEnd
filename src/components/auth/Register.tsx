import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AnimatedInput } from '../ui/AnimatedInput';
import { motion } from 'framer-motion';

interface RegisterProps {
  onToggle: () => void;
}

export const Register = ({ onToggle }: RegisterProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      await register(email, password, name);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-2">Create account</h2>
      <p className="text-gray-600 mb-8">Start your learning journey today</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatedInput
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          label="Full Name"
          placeholder="John Doe"
        />

        <AnimatedInput
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          label="Email"
          placeholder="you@example.com"
        />

        <div>
          <AnimatedInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            label="Password"
            placeholder="••••••••"
          />
          <p className="mt-1 text-sm text-gray-500">Must be at least 6 characters</p>
        </div>

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
          {loading ? 'Creating account...' : 'Create account'}
        </motion.button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onToggle}
          className="text-blue-600 font-medium hover:text-blue-700 transition"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
