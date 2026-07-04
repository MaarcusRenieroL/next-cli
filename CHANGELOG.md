# Changelog

All notable changes to this repository are documented here based on the git commit history.

## v1.0.2 - 2026-07-04

### Security

- Hardened generated payment routes so Stripe checkout accepts only configured price IDs and Razorpay orders use server-defined plans.
- Added API secret protection to generated REST, tRPC, and GraphQL mutation-style examples.
- Restricted generated Hono CORS to the configured app origin.
- Removed automatic `pnpm approve-builds --all` from the CLI install flow.
- Added project-name and target-directory validation, plus protected-directory checks before clearing folders.

### Added

- Wired the CLI `shadcn-ui` option into real generated output with `components.json`, starter `Button` and `Card` components, Tailwind CSS variables, and required dependencies.
- Added source/dev-safe template root resolution so the CLI can scaffold from TypeScript source and bundled output.

### Changed

- Moved `ts-node-dev` out of the CLI package runtime dependencies.
- Added generated env validation for payment and API configuration.

## v1.0.1 - 2026-07-03

### Fixed

- Made CLI project setup install dependencies more reliably with a single install pass.
- Awaited async installers so generated files are written before later setup steps continue.
- Added package setup fixes for Google Analytics.

### Changed

- Released the scoped npm package as `@mxrcxs17/next-kit`.
- Declared the CLI `bin` entry explicitly.
- Switched default site and docs URLs to production domains.

## v1.0.0 and Earlier

### Added

- Built the initial interactive Nextkit CLI with Commander prompts, project scaffolding, package-manager selection, and installation messaging.
- Added installers for Tailwind CSS, ESLint, Prisma, Drizzle, Hono, tRPC, REST API, GraphQL, NextAuth, Clerk, Kinde, Resend, SendGrid, Mailgun, Postmark, Stripe, PayPal, Lemon Squeezy, Razorpay, Vercel Analytics, and Google Analytics.
- Added environment file generation and base utility/provider scaffolding for generated Next.js apps.
- Set up the monorepo with web, docs, and shared UI packages.
- Added the shared UI package with shadcn/ui component tooling.
- Added the marketing site, docs site, FAQ, quickstart, integrations content, and package documentation.

### Fixed

- Ensured generated projects scaffold before installers run.
- Corrected Prisma provider generation per selected database.
- Fixed Hono template output and generated project build/lint issues.
- Removed the deprecated Lucia auth option from CLI prompts and types.
- Improved web metadata, accessibility, community links, and shared UI Tailwind config exports.
