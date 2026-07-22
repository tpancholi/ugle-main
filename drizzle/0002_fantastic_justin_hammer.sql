-- Requires no duplicate (customer_id) rows with status in ('active','trial').
-- Dedup manually before migrate if any exist from prior races.
CREATE INDEX "licenses_customer_id_idx" ON "licenses" USING btree ("customer_id");--> statement-breakpoint
CREATE UNIQUE INDEX "licenses_customer_active_uidx" ON "licenses" USING btree ("customer_id") WHERE "licenses"."status" in ('active', 'trial');--> statement-breakpoint
CREATE INDEX "orders_license_id_idx" ON "orders" USING btree ("license_id");--> statement-breakpoint
CREATE INDEX "orders_customer_id_idx" ON "orders" USING btree ("customer_id");
