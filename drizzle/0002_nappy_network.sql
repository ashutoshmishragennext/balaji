CREATE TYPE "public"."project_status" AS ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED');--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"logo" text,
	"status" "project_status" DEFAULT 'DRAFT' NOT NULL,
	"cover_image" text,
	"user_id" uuid NOT NULL,
	"content_json" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "document_search_keywords" CASCADE;--> statement-breakpoint
DROP TABLE "document_tags" CASCADE;--> statement-breakpoint
DROP TABLE "document_type_metadata" CASCADE;--> statement-breakpoint
DROP TABLE "document_types" CASCADE;--> statement-breakpoint
DROP TABLE "documents" CASCADE;--> statement-breakpoint
DROP TABLE "search_history" CASCADE;--> statement-breakpoint
DROP TABLE "tags" CASCADE;--> statement-breakpoint
DROP TABLE "verification_history" CASCADE;--> statement-breakpoint
CREATE INDEX "projects_user_idx" ON "projects" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "projects_name_idx" ON "projects" USING btree ("name");--> statement-breakpoint
CREATE INDEX "projects_status_idx" ON "projects" USING btree ("status");--> statement-breakpoint
CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");