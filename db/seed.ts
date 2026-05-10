import 'dotenv/config';
import { db } from './index';
import { products } from './schema';

const seedProducts = [
  {
    name: 'Linear',
    slug: 'linear',
    tagLine: 'The issue tracking tool you will enjoy using',
    description:
      'Linear is a purpose-built tool for planning and building products. Streamline issues, sprints, and product roadmaps with a tool that makes it easy to stay on track.',
    webUrl: 'https://linear.app',
    tags: ['productivity', 'project-management', 'saas'],
    voteCount: 128,
    status: 'approved' as const,
    approvedAt: new Date('2024-03-01'),
    submittedBy: 'Alice Johnson',
    userId: 'user_seed_001',
    organizationId: 'org_seed_001',
  },
  {
    name: 'Vercel',
    slug: 'vercel',
    tagLine: 'Deploy and scale your web projects instantly',
    description:
      'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration.',
    webUrl: 'https://vercel.com',
    tags: ['deployment', 'cloud', 'developer-tools'],
    voteCount: 245,
    status: 'approved' as const,
    approvedAt: new Date('2024-02-15'),
    submittedBy: 'Bob Smith',
    userId: 'user_seed_002',
    organizationId: null,
  },
  {
    name: 'Notion AI',
    slug: 'notion-ai',
    tagLine: 'AI-powered workspace for notes, docs, and projects',
    description:
      'Notion AI helps you write better, brainstorm ideas, summarize documents, and automate repetitive tasks—right inside Notion.',
    webUrl: 'https://notion.so',
    tags: ['ai', 'productivity', 'notes'],
    voteCount: 312,
    status: 'approved' as const,
    approvedAt: new Date('2024-01-20'),
    submittedBy: 'Carol Davis',
    userId: 'user_seed_003',
    organizationId: 'org_seed_002',
  },
  {
    name: 'Resend',
    slug: 'resend',
    tagLine: 'Email for developers',
    description:
      'Resend is the email platform for developers. Build, test, and deliver transactional emails at scale.',
    webUrl: 'https://resend.com',
    tags: ['email', 'developer-tools', 'saas'],
    voteCount: 87,
    status: 'pending' as const,
    approvedAt: null,
    submittedBy: 'David Lee',
    userId: 'user_seed_004',
    organizationId: null,
  },
  {
    name: 'Supabase',
    slug: 'supabase',
    tagLine: 'The open source Firebase alternative',
    description:
      'Supabase is an open source Firebase alternative providing all the backend features you need to build a product: a Postgres database, authentication, instant APIs, and realtime subscriptions.',
    webUrl: 'https://supabase.com',
    tags: ['database', 'backend', 'open-source'],
    voteCount: 410,
    status: 'approved' as const,
    approvedAt: new Date('2024-04-05'),
    submittedBy: 'Eva Martinez',
    userId: 'user_seed_005',
    organizationId: 'org_seed_003',
  },
  // Recently launched — within the last 7 days
  {
    name: 'Mintlify',
    slug: 'mintlify',
    tagLine: 'Beautiful docs that convert users',
    description:
      'Mintlify is a modern documentation platform that helps developer-focused companies build beautiful, interactive docs.',
    webUrl: 'https://mintlify.com',
    tags: ['documentation', 'developer-tools', 'saas'],
    voteCount: 42,
    status: 'approved' as const,
    approvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    submittedBy: 'Frank Wu',
    userId: 'user_seed_006',
    organizationId: null,
  },
  {
    name: 'Trigger.dev',
    slug: 'trigger-dev',
    tagLine: 'Background jobs built for modern TypeScript apps',
    description:
      'Trigger.dev is an open-source platform for creating and running background jobs, scheduled tasks, and workflows in your TypeScript codebase.',
    webUrl: 'https://trigger.dev',
    tags: ['backend', 'developer-tools', 'open-source'],
    voteCount: 29,
    status: 'approved' as const,
    approvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    submittedBy: 'Grace Kim',
    userId: 'user_seed_007',
    organizationId: 'org_seed_004',
  },
  {
    name: 'Outerbase',
    slug: 'outerbase',
    tagLine: 'The interface for your database',
    description:
      'Outerbase lets you view, query, and edit your database with a beautiful spreadsheet-like interface and AI-powered SQL generation.',
    webUrl: 'https://outerbase.com',
    tags: ['database', 'developer-tools', 'ai'],
    voteCount: 61,
    status: 'approved' as const,
    approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    submittedBy: 'Henry Patel',
    userId: 'user_seed_008',
    organizationId: null,
  },
];

async function seed() {
  console.log('Seeding database...');

  await db.delete(products);
  console.log('Cleared existing products.');

  const inserted = await db.insert(products).values(seedProducts).returning();
  console.log(`Inserted ${inserted.length} products.`);

  console.log('Seed completed successfully.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
