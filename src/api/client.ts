import type { CreatePasteRequest, ErrorResponse, PasteResponse } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData: ErrorResponse = await response.json().catch(() => ({
      error: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new ApiError(
      errorData.error || `HTTP ${response.status}: ${response.statusText}`,
      response.status
    );
  }
  return response.json();
}

export async function createPaste(body: CreatePasteRequest): Promise<PasteResponse> {
  const response = await fetch(`${API_BASE_URL}/pastes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return handleResponse<PasteResponse>(response);
}

export async function getPaste(id: string): Promise<PasteResponse> {
  const response = await fetch(`${API_BASE_URL}/pastes/${id}`);
  return handleResponse<PasteResponse>(response);
}
