# Changelog

All notable changes to `@mxrcxs17/next-kit` are documented here based on the git commit history.

## v1.0.2 - 2026-07-04

### Security

- Hardened generated Stripe and Razorpay payment routes against client-controlled price or amount tampering.
- Added API secret checks to generated REST, tRPC, and GraphQL mutation examples.
- Restricted generated Hono CORS to the configured app origin.
- Removed automatic `pnpm approve-builds --all`; users must review dependency build-script approvals themselves.
- Added project path validation and protected-directory safeguards before scaffold overwrite/clear actions.

### Added

- Implemented the `shadcn-ui` CLI option with generated `components.json`, starter UI components, Tailwind theme tokens, CSS variables, and package dependencies.
- Added template root resolution that works in both source/dev mode and bundled CLI mode.

### Changed

- Moved `ts-node-dev` from runtime dependencies to dev dependencies.
- Added generated env validation for payment and API secrets.
- Defaulted `NEXT_PUBLIC_APP_URL` validation to `http://localhost:3000` for fresh generated apps.

## v1.0.1 - 2026-07-03

### Fixed

- Made project setup dependency installation more reliable.
- Awaited async installers before continuing setup.
- Added a Google Analytics dependency setup fix.

### Changed

- Released package version `1.0.1`.
- Published under the scoped package name `@mxrcxs17/next-kit`.
- Declared the executable `bin` field explicitly.

## v1.0.0 and Earlier

### Added

- Created the interactive Nextkit CLI for scaffolding Next.js projects.
- Added prompt-driven selection for project structure, package manager, Tailwind, ESLint, UI library, database, ORM, auth, email, payments, analytics, and API style.
- Added installers for Prisma, Drizzle, Hono, tRPC, REST API, GraphQL, NextAuth, Clerk, Kinde, Resend, SendGrid, Mailgun, Postmark, Stripe, PayPal, Lemon Squeezy, Razorpay, Vercel Analytics, and Google Analytics.
- Added base Next.js templates, provider scaffolding, utility libraries, env generation, and empty-project generation.

### Fixed

- Ensured base projects scaffold before feature installers run.
- Corrected Prisma provider generation per selected database.
- Fixed generated Hono output and generated app build/lint issues.
- Removed Lucia auth from CLI prompts and types.
