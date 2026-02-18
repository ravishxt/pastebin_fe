export type PasteStatus = 'ACTIVE' | 'VIEWED' | 'EXPIRED' | 'DELETED';

export interface PasteResponse {
  id: string;
  content: string;
  max_views: number;
  current_views: number;
  expires_at: string | null;
  status: PasteStatus;
  created_at: string;
  updated_at: string;
}

export interface CreatePasteRequest {
  content: string;
  max_views: number;
  expires_at?: string | null;
  password?: string | null;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
