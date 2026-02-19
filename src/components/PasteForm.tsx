import { useState, FormEvent } from 'react';
import type { CreatePasteRequest } from '../api/types';

interface PasteFormProps {
  onSubmit: (data: CreatePasteRequest) => Promise<void>;
  isSubmitting?: boolean;
}

export function PasteForm({ onSubmit, isSubmitting = false }: PasteFormProps) {
  const [content, setContent] = useState('');
  const [maxViews, setMaxViews] = useState(1);
  const [password, setPassword] = useState('');
  const [expiresInSeconds, setExpiresInSeconds] = useState<number | ''>(300);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const expiresAt = expiresInSeconds 
      ? new Date(Date.now() + Number(expiresInSeconds) * 1000).toISOString()
      : undefined;

    await onSubmit({
      content,
      max_views: maxViews,
      ...(expiresAt && { expires_at: expiresAt }),
      ...(password && { password }),
    });

    // Clear password from memory
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="block w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
          placeholder="Paste something..."
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium text-slate-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="max_views" className="text-sm font-medium text-slate-700">
          Max Views
        </label>
        <input
          id="max_views"
          type="number"
          min="1"
          value={maxViews}
          onChange={(e) => setMaxViews(Number(e.target.value))}
          required
          className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Expiration
        </label>
        <select
          value={expiresInSeconds}
          onChange={(e) => setExpiresInSeconds(e.target.value === '' ? '' : Number(e.target.value))}
          className="block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <option value="">Never expire</option>
          <option value="300">5 minutes</option>
          <option value="900">15 minutes</option>
          <option value="3600">1 hour</option>
          <option value="21600">6 hours</option>
          <option value="86400">24 hours</option>
          <option value="604800">7 days</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:ring-slate-300"
      >
        {isSubmitting ? 'Creating…' : 'Create Paste'}
      </button>
    </form>
  );
}
