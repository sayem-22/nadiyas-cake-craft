import { useState } from 'react';
import { supabase } from '../lib/supabase';

type ResetPasswordProps = {
  onCancel: () => void;
};

export function ResetPassword({ onCancel }: ResetPasswordProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    if (password.length < 8) {
      setMessage('পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('দুটি পাসওয়ার্ড মিলছে না।');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setMessage(
        'পাসওয়ার্ড পরিবর্তন হয়নি। রিসেট ইমেইলের লিংকটি মেয়াদোত্তীর্ণ হতে পারে। আবার নতুন লিংক নিন।'
      );
      return;
    }

    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );

    setMessage('পাসওয়ার্ড পরিবর্তন হয়েছে। এখন Admin Login করুন।');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <h2 className="text-2xl font-bold text-gray-800">
          নতুন পাসওয়ার্ড দিন
        </h2>

        <label className="block text-sm font-medium text-gray-700">
          নতুন পাসওয়ার্ড
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          আবার পাসওয়ার্ড লিখুন
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            autoComplete="new-password"
            required
            className="mt-1 w-full rounded-lg border p-3"
          />
        </label>

        {message && (
          <p role="status" className="text-sm text-pink-700">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-pink-600 p-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full rounded-lg border p-3 text-gray-700"
        >
          ফিরে যান
        </button>
      </form>
    </div>
  );
}
