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

  const handleSubmit = async (data: CreatePasteRequest) => {
    setError(null);
    setIsSubmitting(true);
    
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

  return (
    <div className="page">
      <h1>Create New Paste</h1>
      
      {error && <ErrorMessage message={error} />}
      
      {shareUrl ? (
        <div className="success-section">
          <h2>Paste Created!</h2>
          <div className="info-group">
            <label>Share URL:</label>
            <div className="url-display">
              <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                {shareUrl}
              </a>
            </div>
          </div>
          <div className="info-group">
            <label>Status:</label>
            <span>{status}</span>
          </div>
          <button onClick={() => navigate(`/pastes/${pasteId}`)}>
            View Paste
          </button>
        </div>
      ) : (
        <PasteForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      )}
    </div>
  );
}
