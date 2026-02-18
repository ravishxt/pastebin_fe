import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPaste, ApiError } from '../api/client';
import type { PasteResponse } from '../api/types';
import { ErrorMessage } from '../components/ErrorMessage';

export function ViewPastePage() {
  const { id } = useParams<{ id: string }>();
  const [paste, setPaste] = useState<PasteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError('Invalid paste ID');
      setLoading(false);
      return;
    }

    const fetchPaste = async () => {
      try {
        const data = await getPaste(id);
        setPaste(data);
      } catch (err) {
        if (err instanceof ApiError) {
          if (err.status === 410) {
            setError('Paste expired or unavailable');
          } else if (err.status === 404) {
            setError('Paste not found');
          } else {
            setError(err.message);
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load paste');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPaste();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">View paste</h1>
        <p className="mt-2 text-sm text-slate-600">Loading paste…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Error</h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Paste not found</h1>
        <ErrorMessage message="Paste not found" />
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const statusStyles: Record<string, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    VIEWED: 'bg-blue-50 text-blue-800 ring-blue-200',
    EXPIRED: 'bg-slate-100 text-slate-700 ring-slate-200',
    DELETED: 'bg-slate-100 text-slate-700 ring-slate-200',
  };

  const statusClass = statusStyles[paste.status] ?? 'bg-slate-100 text-slate-700 ring-slate-200';

  return (
    <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">View paste</h1>
          <p className="mt-1 text-sm text-slate-600">Paste ID: <span className="font-mono text-slate-700">{paste.id}</span></p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusClass}`}>
          {paste.status}
        </span>
      </div>

      <div className="mt-6 space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Content</p>
          <pre className="max-h-[420px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-6 text-slate-900">
            {paste.content}
          </pre>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Views</p>
            <p className="mt-1 text-lg font-semibold text-slate-900">
              {paste.current_views} <span className="text-sm font-medium text-slate-500">/ {paste.max_views}</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Expires</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(paste.expires_at)}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Created</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(paste.created_at)}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-500">Updated</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{formatDate(paste.updated_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
