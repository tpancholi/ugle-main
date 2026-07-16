import { randomUUID } from "crypto";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const planEnum = pgEnum("plan", ["trial", "monthly", "annual"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
  "dropped",
]);
export const licenseStatusEnum = pgEnum("license_status", [
  "trial",
  "active",
  "expired",
  "suspended",
  "revoked",
  "cancelled",
]);

export const customers = pgTable(
  "customers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    email: text("email").notNull(),
    phone: text("phone"),
    name: text("name"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("customers_email_uidx").on(t.email)],
);

export const licenses = pgTable(
  "licenses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    keygenLicenseId: text("keygen_license_id").notNull(),
    keygenLicenseKey: text("keygen_license_key").notNull(),
    plan: planEnum("plan").notNull(),
    status: licenseStatusEnum("status").notNull().default("trial"),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
    trialUsed: boolean("trial_used").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("licenses_keygen_id_uidx").on(t.keygenLicenseId),
    uniqueIndex("licenses_keygen_key_uidx").on(t.keygenLicenseKey),
  ],
);

export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    licenseId: text("license_id").references(() => licenses.id),
    plan: planEnum("plan").notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    cashfreeOrderId: text("cashfree_order_id").notNull(),
    paymentSessionId: text("payment_session_id"),
    cfPaymentId: text("cf_payment_id"),
    amountBaseInr: integer("amount_base_inr").notNull(),
    amountGstInr: integer("amount_gst_inr").notNull(),
    amountTotalInr: integer("amount_total_inr").notNull(),
    currency: text("currency").notNull().default("INR"),
    isRenewal: boolean("is_renewal").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("orders_cashfree_order_uidx").on(t.cashfreeOrderId)],
);

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    provider: text("provider").notNull().default("cashfree"),
    eventType: text("event_type").notNull(),
    eventId: text("event_id"),
    payload: jsonb("payload").notNull(),
    processedAt: timestamp("processed_at", { withTimezone: true }),
    error: text("error"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("webhook_events_event_id_uidx").on(t.eventId)],
);

export const manageTokens = pgTable(
  "manage_tokens",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    customerId: text("customer_id")
      .notNull()
      .references(() => customers.id),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("manage_tokens_hash_uidx").on(t.tokenHash)],
);

export type Customer = typeof customers.$inferSelect;
export type License = typeof licenses.$inferSelect;
export type Order = typeof orders.$inferSelect;
