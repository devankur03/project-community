# Launchpad

A community platform for discovering, submitting, and voting on developer projects and tools — built with Next.js 16 App Router.

---

## Features

- **Product Discovery** — Browse featured and recently launched products on the home page
- **Explore** — Filter all approved products by tag
- **Submit a Product** — Authenticated users can submit products for review
- **Voting** — Upvote/downvote products with optimistic UI updates
- **Admin Dashboard** — Admins can approve/reject pending submissions and manage all products
- **Organization Support** — Clerk organizations are auto-created for new users
- **Auth** — Sign in / sign up via Clerk with profile menu

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, React 19) |
| Auth | Clerk (`@clerk/nextjs` v7) |
| Database | Neon (serverless PostgreSQL) |
| ORM | Drizzle ORM |
| Validation | Zod v4 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Testing | Vitest + Testing Library |
| Package Manager | pnpm |

---

## Project Structure

```
app/
  page.tsx                  # Home — featured + recently launched
  explore/                  # Browse all approved products
  product/[productId]/      # Product detail page
  submit/                   # Submit a product form
  admin/                    # Admin dashboard (admin-only)
  organization-profile/     # Clerk org profile page

components/
  layout/                   # Header, Footer
  landing/                  # HeroSection, FeaturedProjects, RecentlyLaunched, StatsSection
  explore/                  # ProductGrid with tag filtering
  submit/                   # SubmitProductForm
  admin/                    # PendingProductsTable, AllProductsTable
  ui/                       # VoteButton, Skeleton, EmptyState, shadcn primitives

lib/
  products/
    product-select.ts       # All DB read queries
    product-actions.ts      # Server actions: addProduct, voteProduct, reviewProduct, deleteProduct

db/
  schema.ts                 # Drizzle schema (products table)
  seed.ts                   # Seed script
```

---

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Create a `.env.local` file:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Neon / PostgreSQL
DATABASE_URL=postgresql://...
```

### 3. Push the database schema

```bash
pnpm db:push
```

### 4. (Optional) Seed the database

```bash
pnpm db:seed
```

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database

### Schema

**`products`** table:

| Column | Type | Description |
|---|---|---|
| `id` | serial | Primary key |
| `name` | text | Product name |
| `slug` | text | Unique URL slug |
| `tagLine` | text | Short one-liner |
| `description` | text | Full description |
| `webUrl` | text | Product website |
| `tags` | text[] | Category tags |
| `voteCount` | integer | Total votes |
| `status` | enum | `pending` / `approved` / `rejected` |
| `createdAt` | timestamp | Submission date |
| `approvedAt` | timestamp | Approval date |
| `submittedBy` | text | Clerk user ID |
| `organizationId` | text | Clerk org ID |

### Useful commands

```bash
pnpm db:push       # Push schema changes to the database
pnpm db:studio     # Open Drizzle Studio (visual DB browser)
pnpm db:seed       # Seed with sample data
```

---

## Admin Setup

To grant a user admin access:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Users
2. Select the user → **Public metadata**
3. Set:
```json
{ "isAdmin": true }
```

Admin users will see an **Admin Dashboard** link in their profile menu, and the `/admin` route is protected at the middleware level.

---

## Scripts

```bash
pnpm dev           # Start development server
pnpm build         # Build for production
pnpm start         # Start production server
pnpm lint          # Run ESLint
pnpm test          # Run tests in watch mode
pnpm test:run      # Run tests once
```

---

## Testing

Tests are written with Vitest + Testing Library and cover:

- `VoteButton` — optimistic updates, pending state
- `SubmitProductForm` — form state, validation errors
- `ProductGrid` — filtering, empty state
- `Header` — active tab, auth state
- `Footer`, `Card`, `EmptyState` — UI snapshots

```bash
pnpm test:run
```
