import { useState, FormEvent } from 'react';
import type { CreatePasteRequest } from '../api/types';

interface PasteFormProps {
  onSubmit: (data: CreatePasteRequest) => Promise<void>;
  isSubmitting?: boolean;
}

export function PasteForm({ onSubmit, isSubmitting = false }: PasteFormProps) {
  const [content, setContent] = useState('');
  const [maxViews, setMaxViews] = useState(1);
  const [expiresInSeconds, setExpiresInSeconds] = useState<number | ''>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    const expiresAt = expiresInSeconds 
      ? new Date(Date.now() + Number(expiresInSeconds) * 1000).toISOString()
      : undefined;

    await onSubmit({
      content,
      max_views: maxViews,
      expires_at: expiresAt || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="paste-form">
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
        />
      </div>

      <div className="form-group">
        <label htmlFor="max_views">Max Views</label>
        <input
          id="max_views"
          type="number"
          min="1"
          value={maxViews}
          onChange={(e) => setMaxViews(Number(e.target.value))}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="expires_in_seconds">Expires In (seconds, optional)</label>
        <input
          id="expires_in_seconds"
          type="number"
          min="1"
          value={expiresInSeconds}
          onChange={(e) => setExpiresInSeconds(e.target.value === '' ? '' : Number(e.target.value))}
        />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Paste'}
      </button>
    </form>
  );
}
