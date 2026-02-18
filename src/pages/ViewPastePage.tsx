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
      <div className="page">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <h1>Error</h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!paste) {
    return (
      <div className="page">
        <h1>Paste Not Found</h1>
        <ErrorMessage message="Paste not found" />
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="page">
      <h1>View Paste</h1>
      
      <div className="paste-info">
        <div className="info-group">
          <label>Content:</label>
          <pre className="paste-content">{paste.content}</pre>
        </div>

        <div className="info-group">
          <label>Current Views:</label>
          <span>{paste.current_views}</span>
        </div>

        <div className="info-group">
          <label>Max Views:</label>
          <span>{paste.max_views}</span>
        </div>

        <div className="info-group">
          <label>Status:</label>
          <span>{paste.status}</span>
        </div>

        <div className="info-group">
          <label>Expires At:</label>
          <span>{formatDate(paste.expires_at)}</span>
        </div>

        <div className="info-group">
          <label>Created At:</label>
          <span>{formatDate(paste.created_at)}</span>
        </div>
      </div>
    </div>
  );
}
