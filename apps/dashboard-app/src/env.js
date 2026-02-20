import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
	/**
	 * Specify your server-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars.
	 */
	server: {
		// Database
		DATABASE_URL: z.string().url(),
		DATABASE_URL_UNPOOLED: z.string().url().optional(),
		DATABASE_NAME: z.string().optional(),
		DATABASE_PASSWORD: z.string().optional(),
		DATABASE_USERNAME: z.string().optional(),
		DATABASE_HOST: z.string().optional(),

		// Stripe
		STRIPE_SECRET_KEY: z.string().min(1),
		STRIPE_WEBHOOK_SECRET: z.string().min(1),
		AQA_BIOLOGY_COURSE_PRICE_ID: z.string().min(1),
		AQA_CHEMISTRY_COURSE_PRICE_ID: z.string().min(1),
		AQA_ECONOMICS_COURSE_PRICE_ID: z.string().min(1),
		AQA_MATHS_COURSE_PRICE_ID: z.string().min(1),
		AQA_PHYSICS_COURSE_PRICE_ID: z.string().min(1),
		AQA_PSYCHOLOGY_COURSE_PRICE_ID: z.string().min(1),
		EDEXCEL_BIOLOGY_COURSE_PRICE_ID: z.string().min(1),
		EDEXCEL_CHEMISTRY_COURSE_PRICE_ID: z.string().min(1),
		EDEXCEL_ECONOMICS_COURSE_PRICE_ID: z.string().min(1),
		EDEXCEL_MATHS_COURSE_PRICE_ID: z.string().min(1),
		EDEXCEL_PHYSICS_COURSE_PRICE_ID: z.string().min(1),
		EDEXCEL_PSYCHOLOGY_COURSE_PRICE_ID: z.string().min(1),
		OCR_BIOLOGY_COURSE_PRICE_ID: z.string().min(1),
		OCR_CHEMISTRY_COURSE_PRICE_ID: z.string().min(1),
		OCR_ECONOMICS_COURSE_PRICE_ID: z.string().min(1),
		OCR_MATHS_COURSE_PRICE_ID: z.string().min(1),
		OCR_PHYSICS_COURSE_PRICE_ID: z.string().min(1),
		OCR_PSYCHOLOGY_COURSE_PRICE_ID: z.string().min(1),
		BIOLOGY_PAPER_PRICE_ID: z.string().min(1),
		CHEMISTRY_PAPER_PRICE_ID: z.string().min(1),
		ECONOMICS_PAPER_PRICE_ID: z.string().min(1),
		MATHS_PAPER_PRICE_ID: z.string().min(1),
		PHYSICS_PAPER_PRICE_ID: z.string().min(1),
		PSYCHOLOGY_PAPER_PRICE_ID: z.string().min(1),

		// Clerk
		CLERK_SECRET_KEY: z.string().min(1),
		CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),

		// OpenAI
		OPENAI_API_KEY: z.string().min(1),

		// Sentry
		SENTRY_AUTH_TOKEN: z.string().optional(),
		SENTRY_DSN: z.string().optional(),
		SENTRY_ORG: z.string().optional(),
		SENTRY_PROJECT: z.string().optional(),

		// Axiom
		AXIOM_DATASET: z.string().optional(),
		AXIOM_ORG_ID: z.string().optional(),
		AXIOM_TOKEN: z.string().optional(),

		// Backend
		BACKEND_HOST: z.string().optional(),

		// Google OAuth
		GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
		GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),

		// Redis
		REDIS_HOST: z.string().optional(),
		REDIS_PASSWORD: z.string().optional(),
		REDIS_PORT: z.string().optional(),
		REDIS_URL: z.string().url().optional(),
		REDIS_USERNAME: z.string().optional(),

		// Doppler
		DOPPLER_CONFIG: z.string().optional(),
		DOPPLER_ENVIRONMENT: z.string().optional(),
		DOPPLER_PROJECT: z.string().optional(),

		// NX
		NX_CACHE_DIRECTORY: z.string().optional(),
		NX_SKIP_NX_CACHE: z.string().optional(),
		NX_VERBOSE_LOGGING: z.string().optional(),

		// App Base URL
		APP_BASE_URL: z.string().url(),
	},

	/**
	 * Specify your client-side environment variables schema here. This way you can ensure the app
	 * isn't built with invalid env vars. To expose them to the client, prefix them with
	 * `NEXT_PUBLIC_`.
	 */
	client: {
		NEXT_PUBLIC_AXIOM_DATASET: z.string().optional(),
		NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT: z.string().url().optional(),
		NEXT_PUBLIC_AXIOM_TOKEN: z.string().optional(),
		NEXT_PUBLIC_BACKEND_HOST: z.string().optional(),
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
		NEXT_PUBLIC_SENTRY_ENV: z.string().optional(),
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().optional(),
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
		NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: z.string().optional(),
		NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: z.string().optional(),
	},

	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		// Database
		DATABASE_URL: process.env.DATABASE_URL,
		DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED,
		DATABASE_NAME: process.env.DATABASE_NAME,
		DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
		DATABASE_USERNAME: process.env.DATABASE_USERNAME,
		DATABASE_HOST: process.env.DATABASE_HOST,

		// Stripe
		STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
		STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
		AQA_BIOLOGY_COURSE_PRICE_ID: process.env.AQA_BIOLOGY_COURSE_PRICE_ID,
		AQA_CHEMISTRY_COURSE_PRICE_ID: process.env.AQA_CHEMISTRY_COURSE_PRICE_ID,
		AQA_ECONOMICS_COURSE_PRICE_ID: process.env.AQA_ECONOMICS_COURSE_PRICE_ID,
		AQA_MATHS_COURSE_PRICE_ID: process.env.AQA_MATHS_COURSE_PRICE_ID,
		AQA_PHYSICS_COURSE_PRICE_ID: process.env.AQA_PHYSICS_COURSE_PRICE_ID,
		AQA_PSYCHOLOGY_COURSE_PRICE_ID: process.env.AQA_PSYCHOLOGY_COURSE_PRICE_ID,
		EDEXCEL_BIOLOGY_COURSE_PRICE_ID: process.env.EDEXCEL_BIOLOGY_COURSE_PRICE_ID,
		EDEXCEL_CHEMISTRY_COURSE_PRICE_ID: process.env.EDEXCEL_CHEMISTRY_COURSE_PRICE_ID,
		EDEXCEL_ECONOMICS_COURSE_PRICE_ID: process.env.EDEXCEL_ECONOMICS_COURSE_PRICE_ID,
		EDEXCEL_MATHS_COURSE_PRICE_ID: process.env.EDEXCEL_MATHS_COURSE_PRICE_ID,
		EDEXCEL_PHYSICS_COURSE_PRICE_ID: process.env.EDEXCEL_PHYSICS_COURSE_PRICE_ID,
		EDEXCEL_PSYCHOLOGY_COURSE_PRICE_ID: process.env.EDEXCEL_PSYCHOLOGY_COURSE_PRICE_ID,
		OCR_BIOLOGY_COURSE_PRICE_ID: process.env.OCR_BIOLOGY_COURSE_PRICE_ID,
		OCR_CHEMISTRY_COURSE_PRICE_ID: process.env.OCR_CHEMISTRY_COURSE_PRICE_ID,
		OCR_ECONOMICS_COURSE_PRICE_ID: process.env.OCR_ECONOMICS_COURSE_PRICE_ID,
		OCR_MATHS_COURSE_PRICE_ID: process.env.OCR_MATHS_COURSE_PRICE_ID,
		OCR_PHYSICS_COURSE_PRICE_ID: process.env.OCR_PHYSICS_COURSE_PRICE_ID,
		OCR_PSYCHOLOGY_COURSE_PRICE_ID: process.env.OCR_PSYCHOLOGY_COURSE_PRICE_ID,
		BIOLOGY_PAPER_PRICE_ID: process.env.BIOLOGY_PAPER_PRICE_ID,
		CHEMISTRY_PAPER_PRICE_ID: process.env.CHEMISTRY_PAPER_PRICE_ID,
		ECONOMICS_PAPER_PRICE_ID: process.env.ECONOMICS_PAPER_PRICE_ID,
		MATHS_PAPER_PRICE_ID: process.env.MATHS_PAPER_PRICE_ID,
		PHYSICS_PAPER_PRICE_ID: process.env.PHYSICS_PAPER_PRICE_ID,
		PSYCHOLOGY_PAPER_PRICE_ID: process.env.PSYCHOLOGY_PAPER_PRICE_ID,

		// Clerk
		CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
		CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,

		// OpenAI
		OPENAI_API_KEY: process.env.OPENAI_API_KEY,

		// Sentry
		SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
		SENTRY_DSN: process.env.SENTRY_DSN,
		SENTRY_ORG: process.env.SENTRY_ORG,
		SENTRY_PROJECT: process.env.SENTRY_PROJECT,

		// Axiom
		AXIOM_DATASET: process.env.AXIOM_DATASET,
		AXIOM_ORG_ID: process.env.AXIOM_ORG_ID,
		AXIOM_TOKEN: process.env.AXIOM_TOKEN,

		// Backend
		BACKEND_HOST: process.env.BACKEND_HOST,

		// Google OAuth
		GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
		GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,

		// Redis
		REDIS_HOST: process.env.REDIS_HOST,
		REDIS_PASSWORD: process.env.REDIS_PASSWORD,
		REDIS_PORT: process.env.REDIS_PORT,
		REDIS_URL: process.env.REDIS_URL,
		REDIS_USERNAME: process.env.REDIS_USERNAME,

		// Doppler
		DOPPLER_CONFIG: process.env.DOPPLER_CONFIG,
		DOPPLER_ENVIRONMENT: process.env.DOPPLER_ENVIRONMENT,
		DOPPLER_PROJECT: process.env.DOPPLER_PROJECT,

		// NX
		NX_CACHE_DIRECTORY: process.env.NX_CACHE_DIRECTORY,
		NX_SKIP_NX_CACHE: process.env.NX_SKIP_NX_CACHE,
		NX_VERBOSE_LOGGING: process.env.NX_VERBOSE_LOGGING,

		// App Base URL
		APP_BASE_URL: process.env.APP_BASE_URL,

		// Client
		NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
		NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT: process.env.NEXT_PUBLIC_AXIOM_INGEST_ENDPOINT,
		NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
		NEXT_PUBLIC_BACKEND_HOST: process.env.NEXT_PUBLIC_BACKEND_HOST,
		NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
		NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
		NEXT_PUBLIC_SENTRY_ENV: process.env.NEXT_PUBLIC_SENTRY_ENV,
		NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
		NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
		NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL,
		NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL,
	},
	/**
	 * Run `build` or `dev` with SKIP_ENV_VALIDATION to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
});


