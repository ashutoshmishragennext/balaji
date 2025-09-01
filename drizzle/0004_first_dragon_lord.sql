CREATE TABLE "form" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company_name" text NOT NULL,
	"person_name" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"make" text,
	"model" text,
	"technical_support" text[] DEFAULT '{}',
	"new_machine_model" text,
	"event_name" text,
	"remarks" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
