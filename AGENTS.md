# AGENTS.md

## Commands
- `pnpm dev` - Start development server
- `pnpm build` - Build for production (also runs type checking)
- `pnpm lint` - Run ESLint

## Architecture
- **Framework**: Next.js 16 with App Router (React 19)
- **Auth**: next-auth v5 beta with credentials provider (`app/lib/auth.ts`)
- **Database**: MongoDB (`app/lib/mongodb.ts`) - database name: `ideasmarketplace`
- **Styling**: Tailwind CSS with custom CSS variables for theming (neobrutalism style)

## Project Structure
- `app/` - Next.js App Router pages and API routes
- `app/lib/` - Shared utilities (auth, db connections)
- `app/components/` - React components with barrel exports (`index.ts`)
- `app/api/` - API routes (auth endpoints)

## Code Style
- TypeScript with strict mode enabled
- Use `@/*` path alias for imports (maps to project root)
- Components use barrel exports via `index.ts` files
- UI components accept variant/size props with explicit type unions
- Use CSS variables for theme colors (e.g., `var(--hot-pink)`)
- Functional components with explicit prop interfaces
