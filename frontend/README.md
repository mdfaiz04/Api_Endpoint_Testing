# Frontend

Dashboard for **API Endpoint Testing**, built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Recharts.

See the [project README](../README.md) for the full overview, architecture and setup.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server on http://localhost:3000 |
| `npm run build` | Create a type-checked production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | `http://127.0.0.1:8000` | Backend URL, inlined at build time. Copy `.env.example` to `.env.local` to change it. |

## Structure

```
app/          Routes: /dashboard, /dashboard/schedules, /dashboard/api-groups
components/   Dashboard, schedules, API groups and layout components
services/     Typed API clients (Axios) and the shared API base URL
hooks/        Data-loading hooks
types/        Shared TypeScript types
```
