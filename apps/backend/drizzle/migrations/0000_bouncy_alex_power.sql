CREATE TYPE "public"."chat_room_member_role" AS ENUM('HOST', 'MEMBER');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('ACTIVE', 'CLOSE', 'DELETED', 'HIDDEN', 'BLOCKED', 'DRAFT');--> statement-breakpoint
CREATE TYPE "public"."account_status" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."oauth_provider" AS ENUM('GOOGLE', 'KAKAO', 'NAVER');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."team" AS ENUM('DOOSAN', 'HANWHA', 'KIWOOM', 'KIA', 'KT', 'LG', 'LOTTE', 'NC', 'SAMSUNG', 'SSG');--> statement-breakpoint
CREATE TYPE "public"."recruitment_role" AS ENUM('HOST', 'PARTICIPANT');--> statement-breakpoint
CREATE TYPE "public"."post_type" AS ENUM('RECRUITMENT', 'TIPS');--> statement-breakpoint
CREATE TYPE "public"."prefer_gender" AS ENUM('MALE', 'FEMALE', 'ANY');--> statement-breakpoint
CREATE TYPE "public"."ticketing_type" AS ENUM('SEPARATE', 'TOGETHER', 'FLEXIBLE');--> statement-breakpoint
CREATE TYPE "public"."stadium" AS ENUM('JAMSIL', 'GOCHEOK', 'MUNHAK', 'SAJIK', 'DAEGU', 'GWANGJU', 'CHANGWON', 'DAEJEON', 'SUWON');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'FRAUD', 'VIOLATION_OF_RULES', 'OTHER');--> statement-breakpoint
CREATE TABLE "warn" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"reason" text NOT NULL,
	"member_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_message" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"content" text NOT NULL,
	"chat_room_id" integer NOT NULL,
	"sender_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_room_member" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"role" "chat_room_member_role" NOT NULL,
	"chat_room_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "chat_room_member_chat_room_id_member_id_unique" UNIQUE("chat_room_id","member_id")
);
--> statement-breakpoint
CREATE TABLE "chat_room" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"post_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"content" text NOT NULL,
	"post_status" "post_status" NOT NULL,
	"author_id" integer NOT NULL,
	"post_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "member" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"birth_date" text,
	"phone_number" text,
	"gender" "gender",
	"role" "role" NOT NULL,
	"oauth_provider" "oauth_provider" NOT NULL,
	"account_status" "account_status" DEFAULT 'ACTIVE' NOT NULL,
	"sign-up-status" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"nickname" text NOT NULL,
	"support_team" "team",
	"member_id" integer
);
--> statement-breakpoint
CREATE TABLE "participation" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"role" "recruitment_role" NOT NULL,
	"joined_at" timestamp NOT NULL,
	"member_id" integer NOT NULL,
	"recruitment_detail_id" integer NOT NULL,
	CONSTRAINT "participation_member_id_recruitment_detail_id_unique" UNIQUE("member_id","recruitment_detail_id")
);
--> statement-breakpoint
CREATE TABLE "post_image" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"image_url" text NOT NULL,
	"image_order" integer,
	"post_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"title" text NOT NULL,
	"post_type" "post_type" NOT NULL,
	"post_status" "post_status" NOT NULL,
	"author_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recruitment_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"game_date" timestamp NOT NULL,
	"game_time" timestamp NOT NULL,
	"stadium" text NOT NULL,
	"team_home" text NOT NULL,
	"team_away" text NOT NULL,
	"support_team" text,
	"recruitment_limit" integer DEFAULT 1 NOT NULL,
	"current_participants" integer DEFAULT 0 NOT NULL,
	"prefer_gender" "prefer_gender" DEFAULT 'ANY' NOT NULL,
	"message" text,
	"ticketing_type" "ticketing_type",
	"post_id" integer NOT NULL,
	CONSTRAINT "recruitment_detail_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "tips_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"stadium" "stadium" NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "tips_detail_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "report_count" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"reporting_count" integer DEFAULT 0 NOT NULL,
	"reported_count" integer DEFAULT 0 NOT NULL,
	"member_id" integer NOT NULL,
	CONSTRAINT "report_count_member_id_unique" UNIQUE("member_id")
);
--> statement-breakpoint
CREATE TABLE "report" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"report_type" "report_type",
	"content" text,
	"reporter_id" integer NOT NULL,
	"reported_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scrap" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted" boolean DEFAULT false,
	"member_id" integer NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "scrap_member_id_post_id_unique" UNIQUE("member_id","post_id")
);
--> statement-breakpoint
ALTER TABLE "warn" ADD CONSTRAINT "warn_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_chat_room_id_chat_room_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_message" ADD CONSTRAINT "chat_message_sender_id_member_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_member" ADD CONSTRAINT "chat_room_member_chat_room_id_chat_room_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_room"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_room_member" ADD CONSTRAINT "chat_room_member_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_author_id_member_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participation" ADD CONSTRAINT "participation_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "participation" ADD CONSTRAINT "participation_recruitment_detail_id_recruitment_detail_id_fk" FOREIGN KEY ("recruitment_detail_id") REFERENCES "public"."recruitment_detail"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_image" ADD CONSTRAINT "post_image_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_member_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recruitment_detail" ADD CONSTRAINT "recruitment_detail_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tips_detail" ADD CONSTRAINT "tips_detail_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_count" ADD CONSTRAINT "report_count_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reporter_id_member_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report" ADD CONSTRAINT "report_reported_id_member_id_fk" FOREIGN KEY ("reported_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scrap" ADD CONSTRAINT "scrap_member_id_member_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."member"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scrap" ADD CONSTRAINT "scrap_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;