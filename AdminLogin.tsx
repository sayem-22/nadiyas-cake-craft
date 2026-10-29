import { useState } from 'react';
import { supabase } from '../lib/supabase';

type AdminLoginProps = {
  onLoginSuccess: () => void;
  onCancel: () => void;
};

export function AdminLogin({
  onLoginSuccess,
  onCancel,
}: AdminLoginProps) {
  const [email, setEmail] = useState('mdsayemshekh850@gmail.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setLoading(false);

    if (error) {
      setError('লগইন হয়নি। ইমেইল ও পাসওয়ার্ড পরীক্ষা করুন।');
      return;
    }

    onLoginSuccess();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          Admin Login
        </h2>

        <p className="text-sm text-gray-600">
          শুধু ওয়েবসাইটের মালিক এখানে লগইন করবেন।
        </p>

        <label className="block text-sm font-medium text-gray-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border p-3"
            autoComplete="username"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border p-3"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-pink-600 p-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border p-3 text-gray-700"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
