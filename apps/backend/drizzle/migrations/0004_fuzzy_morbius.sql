CREATE TYPE "public"."chat_message_type" AS ENUM('TEXT', 'IMAGE');--> statement-breakpoint
CREATE TABLE "chat_message_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"chat_message_id" integer NOT NULL,
	"object_key" text NOT NULL,
	"image_url" text NOT NULL,
	"mime_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"image_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "chat_message" ALTER COLUMN "content" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_message" ADD COLUMN "message_type" "chat_message_type" DEFAULT 'TEXT' NOT NULL;--> statement-breakpoint
ALTER TABLE "chat_message_image" ADD CONSTRAINT "chat_message_image_chat_message_id_chat_message_id_fk" FOREIGN KEY ("chat_message_id") REFERENCES "public"."chat_message"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_message_image_chat_message_id_idx" ON "chat_message_image" USING btree ("chat_message_id");