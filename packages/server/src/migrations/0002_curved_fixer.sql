ALTER TABLE "goals" DROP CONSTRAINT "goals_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "steps" DROP CONSTRAINT "steps_goal_id_goals_id_fk";
--> statement-breakpoint
ALTER TABLE "substeps" DROP CONSTRAINT "substeps_step_id_steps_id_fk";
--> statement-breakpoint
ALTER TABLE "tasks" DROP CONSTRAINT "tasks_substep_id_substeps_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "is_admin" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "steps" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "substeps" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "user_id" uuid;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "steps" ADD CONSTRAINT "steps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "steps" ADD CONSTRAINT "steps_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substeps" ADD CONSTRAINT "substeps_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "substeps" ADD CONSTRAINT "substeps_step_id_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_substep_id_substeps_id_fk" FOREIGN KEY ("substep_id") REFERENCES "public"."substeps"("id") ON DELETE cascade ON UPDATE no action;