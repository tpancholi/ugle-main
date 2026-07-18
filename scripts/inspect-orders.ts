import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const orders = await sql`
  SELECT id, plan, status, cashfree_order_id, cf_payment_id, license_id,
         amount_total_inr, is_renewal, created_at, updated_at
  FROM orders ORDER BY created_at DESC LIMIT 8`;
console.log("=== ORDERS ===");
console.table(orders);

const licenses = await sql`
  SELECT id, customer_id, keygen_license_key, plan, status, expires_at, created_at, updated_at
  FROM licenses ORDER BY created_at DESC LIMIT 8`;
console.log("=== LICENSES ===");
console.table(licenses);

const events = await sql`
  SELECT id, event_type, event_id, processed_at, error, created_at
  FROM webhook_events ORDER BY created_at DESC LIMIT 12`;
console.log("=== WEBHOOK EVENTS ===");
console.table(events);

const customers = await sql`
  SELECT id, email, phone, name, created_at FROM customers ORDER BY created_at DESC LIMIT 8`;
console.log("=== CUSTOMERS ===");
console.table(customers);
