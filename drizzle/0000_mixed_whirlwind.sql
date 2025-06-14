CREATE TABLE "connections" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"pops" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"provider" text NOT NULL,
	"cable" text,
	"route" geometry(LineString) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exchanges" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pops" (
	"id" text PRIMARY KEY NOT NULL,
	"fac" integer NOT NULL,
	"name" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"location" text NOT NULL,
	"longitude" real NOT NULL,
	"latitude" real NOT NULL,
	"provider" text,
	"connections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"exchanges" jsonb DEFAULT '[]'::jsonb NOT NULL,
	CONSTRAINT "pops_fac_unique" UNIQUE("fac")
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"secretHash" text NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	"lastVerifiedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"githubId" integer NOT NULL,
	"username" text NOT NULL
);
