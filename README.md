# Personal Portfolio Website

Personal portfolio built with **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **shadcn-ui**. The project now runs on the Bun toolchain.

## Tech Highlights

- Next.js 16 (pages router) with React 19
- Tailwind CSS 4 with shadcn-ui + Radix UI primitives
- TanStack Query, React Hook Form, Zod validation, Resend mail API
- Supabase client utilities
- Bun 1.3 for scripts, installs, and development workflow

## Prerequisites

- [Bun](https://bun.sh/) v1.3 or newer

## Install & Run

```bash
bun install
bun run dev   # starts Next.js on http://localhost:3000
```

## Useful Scripts

- `bun run dev` – start the Next.js dev server
- `bun run lint` – lint the project with ESLint
- `bun run test` – run unit tests with Vitest
- `bun run build` – create a production build
- `bun run start` – serve the production build locally

## Deployment Notes

- Build command: `bun run build`
- Output directory: `.next`
- Required env: `RESEND_API_KEY` (and optional `CONTACT_TO_EMAIL` / `CONTACT_FROM_EMAIL` for contact form delivery)
