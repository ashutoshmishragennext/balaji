ALTER TABLE "projects" ADD COLUMN "website_url" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "slug" text;--> statement-breakpoint
CREATE UNIQUE INDEX "projects_slug_key" ON "projects" USING btree ("slug");