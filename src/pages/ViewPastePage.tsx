import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getPaste, ApiError } from '../api/client';
import type { PasteResponse } from '../api/types';
import { ErrorMessage } from '../components/ErrorMessage';

export function ViewPastePage() {
  const { id } = useParams<{ id: string }>();
  const [paste, setPaste] = useState<PasteResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  
  // New state for password handling
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Invalid paste ID');
      setLoading(false);
      return;
    }

    // Initial fetch without password
    loadPaste(id);
  }, [id]);

  const loadPaste = async (pasteId: string, password?: string) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors (like invalid password)
      
      const data = await getPaste(pasteId, password);
      
      setPaste(data);
      setIsPasswordRequired(false); // Success! No longer need password
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 410) {
          setError('Paste expired or unavailable');
        } else if (err.status === 404) {
          setError('Paste not found');
        } else if (err.status === 401) {
          // 401 means password required or invalid
          setIsPasswordRequired(true);
          // If we already sent a password, it was wrong
          if (password) {
            setError('Invalid password');
          }
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
      setSubmittingPassword(false);
    }
  };


  const handleCopy = async () => {
    if (!paste?.content) return;
    setCopied(false);

    try {
      await navigator.clipboard.writeText(paste.content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      try {
        const input = document.createElement('input');
        input.value = paste.content;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
      } catch {
        // ignore
      }
    }
  };

  const handlePasswordSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    setSubmittingPassword(true);
    loadPaste(id, passwordInput);
  };

  if (loading && !submittingPassword) {
    return (
      <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">View paste</h1>
        <div className="mt-4 flex items-center justify-center py-8">
           <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-600"></div>
        </div>
      </div>
    );
  }

  // Render Password Form if required and we don't have the paste yet
  if (isPasswordRequired && !paste) {
    return (
      <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 flex items-center gap-2">
          🔒 Password Required
        </h1>
        <p className="mt-2 text-sm text-slate-600">This paste is protected. Please enter the password to view it.</p>
        
        <form onSubmit={handlePasswordSubmit} className="mt-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="block w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 font-mono text-sm leading-6 text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {error && <ErrorMessage message={error} />}

            <button
              type="submit"
              disabled={submittingPassword}
              className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 disabled:opacity-50"
            >
              {submittingPassword ? 'Unlocking...' : 'Unlock Paste'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Generic Error State (for non-401 errors like 404/500)
  if (error && !isPasswordRequired) {
    return (
      <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Error</h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!paste) {
    // Should generally be caught by loading or error states above
    return null;
  }

  // --- EXISTING RENDER LOGIC FOR SUCCESSFUL PASTE ---
  
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
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-700">Content</p>
            <button
              type="button"
              onClick={handleCopy}
              className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
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