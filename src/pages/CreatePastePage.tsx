import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPaste } from '../api/client';
import type { CreatePasteRequest } from '../api/types';
import { PasteForm } from '../components/PasteForm';
import { ErrorMessage } from '../components/ErrorMessage';

export function CreatePastePage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pasteId, setPasteId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (data: CreatePasteRequest) => {
    setError(null);
    setIsSubmitting(true);
    setCopied(false);
    
    try {
      const response = await createPaste(data);
      setPasteId(response.id);
      setStatus(response.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create paste');
    } finally {
      setIsSubmitting(false);
    }
  };

  const shareUrl = pasteId 
    ? `${window.location.origin}/pastes/${pasteId}`
    : null;

  const handleCopy = async () => {
    if (!shareUrl) return;
    setCopied(false);

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      try {
        const input = document.createElement('input');
        input.value = shareUrl;
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

  return (
    <div className="mx-auto w-full max-w-[640px] rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create new paste
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Share content with an expiration policy.
        </p>
      </div>
      
      {error && <ErrorMessage message={error} />}
      
      {shareUrl ? (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Paste created</h2>
                <p className="mt-1 text-sm text-emerald-800/80">
                  Your share link is ready.
                </p>
              </div>
              {status && (
                <span className="inline-flex items-center rounded-full bg-white/60 px-2.5 py-1 text-xs font-semibold text-emerald-900 ring-1 ring-inset ring-emerald-200">
                  {status}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-700">Share URL</p>
              <button
                type="button"
                onClick={handleCopy}
                className="cursor-pointer inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <a
                href={shareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block break-all text-sm font-medium text-blue-700 hover:text-blue-800"
              >
                {shareUrl}
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(`/pastes/${pasteId}`)}
              className="cursor-pointer inline-flex flex-1 items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              View paste
            </button>
            <button
              type="button"
              onClick={() => {
                setPasteId(null);
                setStatus(null);
                setCopied(false);
              }}
              className="cursor-pointer inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Create another
            </button>
          </div>
        </div>
      ) : (
        <PasteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}
