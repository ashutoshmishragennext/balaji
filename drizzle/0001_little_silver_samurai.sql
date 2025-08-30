ALTER TABLE "folder_tags" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "folders" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "organizations" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "students" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "folder_tags" CASCADE;--> statement-breakpoint
DROP TABLE "folders" CASCADE;--> statement-breakpoint
DROP TABLE "organizations" CASCADE;--> statement-breakpoint
DROP TABLE "students" CASCADE;--> statement-breakpoint
ALTER TABLE "document_search_keywords" DROP CONSTRAINT "document_search_keywords_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "document_types" DROP CONSTRAINT "document_types_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_student_id_students_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_folder_id_folders_id_fk";
--> statement-breakpoint
ALTER TABLE "documents" DROP CONSTRAINT "documents_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "search_history" DROP CONSTRAINT "search_history_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "tags" DROP CONSTRAINT "tags_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_organization_id_organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "verification_history" DROP CONSTRAINT "verification_history_organization_id_organizations_id_fk";
--> statement-breakpoint
DROP INDEX "document_search_student_idx";--> statement-breakpoint
DROP INDEX "documents_folder_idx";--> statement-breakpoint
DROP INDEX "search_history_organization_idx";--> statement-breakpoint
DROP INDEX "verification_history_organization_idx";--> statement-breakpoint
ALTER TABLE "document_types" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "student_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "documents" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "tags" ALTER COLUMN "organization_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "document_search_keywords" DROP COLUMN "student_id";--> statement-breakpoint
ALTER TABLE "documents" DROP COLUMN "folder_id";--> statement-breakpoint
ALTER TABLE "search_history" DROP COLUMN "organization_id";--> statement-breakpoint
ALTER TABLE "verification_history" DROP COLUMN "organization_id";