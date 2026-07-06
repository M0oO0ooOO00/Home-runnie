CREATE TYPE "public"."chat_join_request_status" AS ENUM('PENDING', 'ACCEPTED', 'REJECTED');--> statement-breakpoint
CREATE TABLE "chat_join_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"status" "chat_join_request_status" NOT NULL,
	"chat_room_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "chat_join_request_chat_room_id_member_id_unique" UNIQUE("chat_room_id","member_id")
);
--> statement-breakpoint
ALTER TABLE "recruitment_detail" ALTER COLUMN "ticketing_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."ticketing_type";--> statement-breakpoint
CREATE TYPE "public"."ticketing_type" AS ENUM('SEPARATE', 'TOGETHER');--> statement-breakpoint
ALTER TABLE "recruitment_detail" ALTER COLUMN "ticketing_type" SET DATA TYPE "public"."ticketing_type" USING "ticketing_type"::"public"."ticketing_type";--> statement-breakpoint
ALTER TABLE "recruitment_detail" ADD COLUMN "picked" text[];--> statement-breakpoint
ALTER TABLE "chat_join_request" ADD CONSTRAINT "chat_join_request_chat_room_id_chat_room_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_join_request" ADD CONSTRAINT "chat_join_request_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;