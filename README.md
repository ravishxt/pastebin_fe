# RelayText Frontend

Minimal React + TypeScript frontend for the RelayText Ephemeral Paste API.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your API base URL:
```
VITE_API_BASE_URL=http://localhost:5000
```

## Development

Run the development server:
```bash
npm run dev
```

## Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Project Structure

```
src/
  api/
    client.ts      # API client functions
    types.ts       # TypeScript interfaces
  pages/
    CreatePastePage.tsx
    ViewPastePage.tsx
  components/
    ErrorMessage.tsx
    PasteForm.tsx
  App.tsx          # Main app with routing
  main.tsx         # Entry point
  index.css        # Minimal styling
```
