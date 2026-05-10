CREATE TYPE "public"."reaction_target_type" AS ENUM('POST', 'COMMENT');--> statement-breakpoint
ALTER TYPE "public"."post_type" ADD VALUE 'FEED';--> statement-breakpoint
CREATE TABLE "feed_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"content" text NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "feed_detail_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "like" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"member_id" integer NOT NULL,
	"target_type" "reaction_target_type" NOT NULL,
	"target_id" integer NOT NULL,
	CONSTRAINT "like_member_target_unique" UNIQUE("member_id","target_type","target_id")
);
--> statement-breakpoint
ALTER TABLE "comment" ADD COLUMN "parent_id" integer;--> statement-breakpoint
ALTER TABLE "feed_detail" ADD CONSTRAINT "feed_detail_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_parent_id_comment_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comment"("id") ON DELETE no action ON UPDATE no action;