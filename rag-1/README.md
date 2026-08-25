# Apollo RAG — frontend

Simple Horizon UI-style dashboard for the ApolloRAG app, built with Vite + React + TypeScript + Chakra UI.

## Pages

- **Dashboard** — stat cards + charts (queries over time, document status breakdown), backed by sample data until an analytics endpoint exists.
- **Ask** — chat-style query box that calls `POST /api/query` and renders the answer with its sources.
- **Documents** — upload/list/delete documents via `/api/documents`.

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if your API isn't on localhost:5000
npm run dev
```

## Stack

- Vite + React 18 + TypeScript
- Chakra UI (Horizon UI color palette: brand / navy / secondaryGray)
- react-apexcharts for charts
- react-router-dom for routing
- axios for API calls
