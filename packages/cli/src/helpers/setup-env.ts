import { API, AuthType, CLIOptions, DatabaseType, EmailType, Payment } from "@/types/global.js";
import { addPackageDependency } from "@/utils/add-package-dependency.js";
import fs from "fs-extra";
import path from "path";

type EnvOptions = {
  server: Record<string, string>;
  client: Record<string, string>;
  runtimeEnv: Record<string, string>;
  skipValidation: boolean;
  emptyStringAsUndefined: boolean;
};

interface EnvironmentConfigObject {
  server?: Record<string, string>;
  client?: object;
}

const authEnvironment: Record<Exclude<AuthType, "none" | undefined | null>, EnvironmentConfigObject> = {
  clerk: {
    client: {
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "z.string()",
      NEXT_PUBLIC_CLERK_SIGN_IN_URL: "z.string().optional()",
      NEXT_PUBLIC_CLERK_SIGN_UP_URL: "z.string().optional()",
      NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: "z.string().optional()",
      NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: "z.string().optional()",
    },
    server: {
      CLERK_SECRET_KEY: "z.string().min(1)",
    },
  },
  kinde: {
    server: {
      KINDE_CLIENT_ID: "z.string()",
      KINDE_CLIENT_SECRET: "z.string()",
      KINDE_ISSUER_URL: "z.string()",
      KINDE_SITE_URL: "z.string()",
      KINDE_POST_LOGOUT_REDIRECT_URL: "z.string()",
      KINDE_POST_LOGIN_REDIRECT_URL: "z.string()",
    },
  },
  "next-auth": {
    server: {
      NEXTAUTH_SECRET: "z.string()",
      GITHUB_CLIENT_ID: "z.string()",
      GITHUB_CLIENT_SECRET: "z.string()",
    },
  },
};

const dbEnvironment: Record<Exclude<DatabaseType, "none" | undefined | null>, { DATABASE_URL?: string; MONGO_URI?: string }> = {
  postgresql: { DATABASE_URL: "z.string().url()" },
  mysql: { DATABASE_URL: "z.string().url()" },
  sqlite: { DATABASE_URL: "z.string()" },
  mongodb: { MONGO_URI: "z.string().url()" },
};

const emailEnvironment: Record<Exclude<EmailType, "none" | undefined | null>, EnvironmentConfigObject> = {
  resend: {
    server: {
      RESEND_API_KEY: "z.string()",
    },
  },
  mailgun: {
    server: {
      MAILGUN_API_KEY: "z.string()",
      MAILGUN_DOMAIN: "z.string()",
      MAILGUN_FROM_EMAIL: "z.string()",
    },
  },
  sendgrid: {
    server: {
      SENDGRID_API_KEY: "z.string()",
      SENDGRID_FROM_EMAIL: "z.string()",
    },
  },
  postmark: {
    server: {
      POSTMARK_SERVER_TOKEN: "z.string()",
      POSTMARK_FROM_EMAIL: "z.string()",
    },
  },
};

const paymentEnvironment: Record<Exclude<Payment, "none" | undefined | null>, EnvironmentConfigObject> = {
  stripe: {
    server: {
      STRIPE_SECRET_KEY: "z.string().min(1)",
      STRIPE_WEBHOOK_SECRET: "z.string().min(1)",
      STRIPE_PRICE_IDS: "z.string().min(1)",
    },
    client: {
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "z.string().min(1)",
    },
  },
  paypal: {
    server: {
      PAYPAL_CLIENT_SECRET: "z.string().min(1)",
    },
    client: {
      NEXT_PUBLIC_PAYPAL_CLIENT_ID: "z.string().min(1)",
    },
  },
  "lemon-squeezy": {
    server: {
      LEMONSQUEEZY_API_KEY: "z.string().min(1)",
      LEMONSQUEEZY_STORE_ID: "z.string().min(1)",
      LEMONSQUEEZY_WEBHOOK_SECRET: "z.string().min(1)",
    },
  },
  razorpay: {
    server: {
      RAZORPAY_KEY_ID: "z.string().min(1)",
      RAZORPAY_KEY_SECRET: "z.string().min(1)",
    },
    client: {
      NEXT_PUBLIC_RAZORPAY_KEY_ID: "z.string().min(1)",
    },
  },
};

const apiEnvironment: Record<Exclude<API, "none" | undefined | null>, EnvironmentConfigObject> = {
  hono: {
    server: {
      API_SECRET: "z.string().min(32)",
    },
  },
  rest: {
    server: {
      API_SECRET: "z.string().min(32)",
    },
  },
  trpc: {
    server: {
      API_SECRET: "z.string().min(32)",
    },
  },
  graphql: {
    server: {
      API_SECRET: "z.string().min(32)",
    },
  },
};

export const setupEnv = ({ projectDir, scopedAppName, ...options }: CLIOptions) => {
  const envDir = path.join(projectDir, scopedAppName === "src" ? "src" : "", "env");

  // Ensure required dependencies are installed
  addPackageDependency({
    projectDir,
    dependencies: ["dotenv", "dotenv-expand", "@t3-oss/env-nextjs", "zod"],
    devMode: false,
  });

  if (!options.empty) {
    // Ensure the `env` directory exists
    if (!fs.existsSync(envDir)) {
      fs.mkdirSync(envDir, { recursive: true });
    }

    // Define basic env options
    const envOptions: EnvOptions = {
      server: {
        NODE_ENV: 'z.enum(["development", "test", "production"]).default("development")',
      },
      client: {
        NEXT_PUBLIC_NODE_ENV: 'z.enum(["development", "test", "production"]).default("development")',
        NEXT_PUBLIC_APP_URL: 'z.string().url().default(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")',
        NEXT_PUBLIC_VERCEL_URL: "z.string().optional()",
      },
      runtimeEnv: {},
      skipValidation: !!process.env.SKIP_ENV_VALIDATION,
      emptyStringAsUndefined: true,
    };

    // Add database config if specified
    if (options.database && options.database !== "none") {
      Object.assign(envOptions.server, dbEnvironment[options.database as keyof typeof dbEnvironment] || {});
    }

    // Add auth config if specified
    if (options.auth && options.auth !== "none") {
      const authVars = authEnvironment[options.auth as keyof typeof authEnvironment] || {};
      Object.assign(envOptions.client, authVars.client || {});
      Object.assign(envOptions.server, authVars.server || {});
    }

    // Add email config if specified
    if (options.email && options.email !== "none") {
      const emailVars = emailEnvironment[options.email as keyof typeof emailEnvironment] || {};
      Object.assign(envOptions.client, emailVars.client || {});
      Object.assign(envOptions.server, emailVars.server || {});
    }

    if (options.payment && options.payment !== "none") {
      const paymentVars = paymentEnvironment[options.payment as keyof typeof paymentEnvironment] || {};
      Object.assign(envOptions.client, paymentVars.client || {});
      Object.assign(envOptions.server, paymentVars.server || {});
    }

    if (options.api && options.api !== "none") {
      const apiVars = apiEnvironment[options.api as keyof typeof apiEnvironment] || {};
      Object.assign(envOptions.client, apiVars.client || {});
      Object.assign(envOptions.server, apiVars.server || {});
    }

    // Populate runtimeEnv dynamically
    for (const [key] of Object.entries({ ...envOptions.server, ...envOptions.client })) {
      envOptions.runtimeEnv[key] = `process.env.${key}`;
    }

    // Generate environment file content without quotes around keys
    const envFileContent = `
import { createEnv } from "@t3-oss/env-nextjs";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { ZodError, z } from "zod";

expand(config());

export const env = createEnv({
    server: {
    ${Object.entries(envOptions.server)
      .map(([key, value]) => `${key}: ${value}`)
      .join(",\n        ")},
    },
    client: {
    ${Object.entries(envOptions.client)
      .map(([key, value]) => `${key}: ${value}`)
      .join(",\n        ")},
    },
    runtimeEnv: {
    ${Object.entries(envOptions.runtimeEnv)
      .map(([key, value]) => `${key}: ${value}`)
      .join(",\n        ")},
    },
    skipValidation: ${envOptions.skipValidation},
    emptyStringAsUndefined: ${envOptions.emptyStringAsUndefined},
    onValidationError: (error: ZodError) => {
    console.error("❌ Invalid Environment Variables:", error.flatten().fieldErrors);
    process.exit(1);
    },
});
  `;

    // Write the environment configuration to the index.ts file
    fs.writeFileSync(path.join(envDir, "index.ts"), envFileContent.trim());
  }
};
