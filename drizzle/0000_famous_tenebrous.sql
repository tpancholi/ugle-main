CREATE TYPE "public"."license_status" AS ENUM('trial', 'active', 'expired', 'suspended', 'revoked', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'paid', 'failed', 'refunded', 'dropped');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('trial', 'monthly', 'annual');--> statement-breakpoint
CREATE TABLE "customers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "licenses" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"keygen_license_id" text NOT NULL,
	"keygen_license_key" text NOT NULL,
	"plan" "plan" NOT NULL,
	"status" "license_status" DEFAULT 'trial' NOT NULL,
	"expires_at" timestamp with time zone,
	"cancel_at_period_end" boolean DEFAULT false NOT NULL,
	"trial_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manage_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" text PRIMARY KEY NOT NULL,
	"customer_id" text NOT NULL,
	"license_id" text,
	"plan" "plan" NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"cashfree_order_id" text NOT NULL,
	"payment_session_id" text,
	"cf_payment_id" text,
	"amount_base_inr" integer NOT NULL,
	"amount_gst_inr" integer NOT NULL,
	"amount_total_inr" integer NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"is_renewal" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" text PRIMARY KEY NOT NULL,
	"provider" text DEFAULT 'cashfree' NOT NULL,
	"event_type" text NOT NULL,
	"event_id" text,
	"payload" jsonb NOT NULL,
	"processed_at" timestamp with time zone,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manage_tokens" ADD CONSTRAINT "manage_tokens_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_license_id_licenses_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."licenses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "customers_email_uidx" ON "customers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "licenses_keygen_id_uidx" ON "licenses" USING btree ("keygen_license_id");--> statement-breakpoint
CREATE UNIQUE INDEX "licenses_keygen_key_uidx" ON "licenses" USING btree ("keygen_license_key");--> statement-breakpoint
CREATE UNIQUE INDEX "manage_tokens_hash_uidx" ON "manage_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE UNIQUE INDEX "orders_cashfree_order_uidx" ON "orders" USING btree ("cashfree_order_id");--> statement-breakpoint
CREATE UNIQUE INDEX "webhook_events_event_id_uidx" ON "webhook_events" USING btree ("event_id");