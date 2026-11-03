# 05-notehub

GoIT React + TypeScript NoteHub homework. Create, search and delete notes with pagination via NoteHub API.

## Setup

1. Install Node.js 20.19+ or 22.12+.
2. From the project folder run `npm.cmd install` on Windows PowerShell.
3. Copy `.env.example` to `.env.local` and replace `YOUR_TOKEN_HERE` with the personal token generated at <https://notehub-public.goit.study/api/docs/>.
4. Run `npm.cmd run dev` for development; `npm.cmd run build` to verify the production build.

**Do not commit `.env.local` or share your token.** The Vite environment name must be `VITE_NOTEHUB_TOKEN`.

## Vercel

- Import the repository from GitHub at <https://vercel.com/new>.
- Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
- Under Project Settings → Environment Variables set `VITE_NOTEHUB_TOKEN` to your NoteHub token and select Production (and Preview if used).
- Redeploy after adding a variable, and check that creating, searching, paginating and deleting notes work on the production URL.
- Submit both the GitHub repository URL and Vercel production URL.

## Tech stack

React, TypeScript, Vite, Axios, TanStack Query, Formik, Yup, React Paginate, use-debounce, CSS Modules and modern-normalize.

## Notes

The CSS modules included in this archive implement the assignment's listed class names. If your instructor requires the *original* CSS exactly, replace them with corresponding files from <https://github.com/goitacademy/react-notehub-styles> without changing the TSX markup.
