import { config } from "dotenv";
import { z } from "zod";

// Load environment variables
config();

// Define environment variables schema
const envSchema = z.object({
    // Application
    NODE_ENV: z.enum(['development', 'production', 'staging', 'test']).default('development'),
    PORT: z.string().transform(Number).default(3000),
    API_VERSION: z.string().default('v1'),

    // Database
    DATABASE_URL: z.string().url(),
    DIRECT_URL: z.string().url().optional(),

    // Redis
    REDIS_URL: z.string().url(),
    REDIS_PASSWORD: z.string().optional(),

    // Supabase
    SUPABASE_URL: z.string().url(),
    SUPABASE_ANON_KEY: z.string().min(1),
    SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

    // JWT
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRATION_IN: z.string().default('1h'),
    JWT_REFRESH_SECRET_IN: z.string().default('7d'),

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default(15 * 60 * 1000),
    RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default(100),

    // Cors
    CORS_ORIGIN: z.string().default('*'),

    // Logging
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

    // Email (SendGrid)
    SENDGRID_API_KEY: z.string().min(1).optional(),
    FROM_EMAIL: z.string().email().optional(),

    // AI (Anthropic)
    ANTHROPIC_API_KEY: z.string().min(1).optional(),
    AI_ENABLED: z.string().transform((val) => val === 'true').default(true),

    // Feature Flags
    ENABLE_NOTIFICATIONS: z.string().transform((val) => val === 'true').default(true),
    ENABLE_ANALYTICS: z.string().transform((val) => val === 'true').default(true),
    ENABLE_AI_PRIORITY: z.string().transform((val) => val === 'true').default(true),
});

// Validate and parse environment variables
const parseEnv = () => {
    try {
        return envSchema.parse(process.env)
    } catch (error) {
        if (error instanceof z.ZodError) {
            console.error('❌ Invalid environment variables:');
            error.issues.forEach((err) => {
                console.error(`  - ${err.path.join('.')}: ${err.message}`);
            });
        }
        process.exit(1);
    }
}

export const env = parseEnv();

// Helper to check if in production,development,staging,test
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";
