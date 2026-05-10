import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

export const productStatusEnum = pgEnum('product_status', [
  'pending',
  'approved',
  'rejected',
]);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  tagLine: text('tag_line').notNull(),
  description: text('description').notNull(),
  webUrl: text('web_url').notNull(),
  tags: text('tags').array().notNull().default([]),
  voteCount: integer('vote_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  approvedAt: timestamp('approved_at'),
  status: productStatusEnum('status').notNull().default('pending'),
  submittedBy: text('submitted_by').notNull(),
  userId: text('user_id').notNull(),
  organizationId: text('organization_id'),
}, (table) => [
  uniqueIndex('products_slug_unique_idx').on(table.slug),
  index('products_status_idx').on(table.status),
  index('products_organization_id_idx').on(table.organizationId),
]);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
