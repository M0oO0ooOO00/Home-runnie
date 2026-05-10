CREATE INDEX "comment_parent_id_idx" ON "comment" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX "like_target_idx" ON "like" USING btree ("target_type","target_id");