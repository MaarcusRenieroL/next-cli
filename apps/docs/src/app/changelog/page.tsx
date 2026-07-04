import { PageHeader, Prose, Callout } from "@/components/mdx";
import { DocFooter } from "@/components/mdx/doc-footer";
import { ChangelogList, type ChangelogEntry } from "./changelog-list";

export const metadata = { title: "Changelog" };

const changes: ChangelogEntry[] = [
  {
    version: "Unreleased",
    month: "July 2026",
    summary:
      "Security hardening, real shadcn/ui scaffolding, dependency upgrades, and changelog documentation.",
    groups: [
      {
        title: "Security",
        items: [
          "Hardened generated Stripe and Razorpay payment routes against client-controlled price or amount tampering.",
          "Added API secret checks to generated REST, tRPC, and GraphQL mutation examples.",
          "Restricted generated Hono CORS to the configured app origin.",
          "Removed automatic pnpm build-script approval from the CLI install flow.",
          "Added project path validation and protected-directory safeguards before scaffold overwrite or clear actions.",
        ],
      },
      {
        title: "Added",
        items: [
          "Implemented the shadcn/ui CLI option with components.json, starter Button and Card components, Tailwind theme tokens, CSS variables, and package dependencies.",
          "Added changelogs at the repository root and inside the published CLI package.",
          "Added template root resolution that works in both source/dev mode and bundled CLI mode.",
        ],
      },
      {
        title: "Changed",
        items: [
          "Upgraded the docs, web app, and generated template stack to Next.js 16.2.10 and React 19.2.7.",
          "Moved ts-node-dev out of the CLI runtime dependencies.",
          "Added generated env validation for payment and API secrets.",
        ],
      },
    ],
  },
  {
    version: "v1.0.1",
    date: "2026-07-03",
    month: "July 2026",
    summary:
      "A release focused on making project setup and package installation more reliable.",
    groups: [
      {
        title: "Fixed",
        items: [
          "Made CLI project setup install dependencies more reliably with a single install pass.",
          "Awaited async installers so generated files are written before later setup steps continue.",
          "Added package setup fixes for Google Analytics.",
        ],
      },
      {
        title: "Changed",
        items: [
          "Released the scoped npm package as @mxrcxs17/next-kit.",
          "Declared the CLI bin entry explicitly.",
          "Switched default site and docs URLs to production domains.",
        ],
      },
    ],
  },
  {
    version: "v1.0.0 and Earlier",
    month: "Before July 2026",
    summary:
      "The initial public history of the CLI, marketing site, docs app, and shared UI package.",
    groups: [
      {
        title: "Added",
        items: [
          "Built the initial interactive Nextkit CLI with Commander prompts, project scaffolding, package-manager selection, and installation messaging.",
          "Added installers for Tailwind CSS, ESLint, Prisma, Drizzle, Hono, tRPC, REST API, GraphQL, NextAuth, Clerk, Kinde, email providers, payments, and analytics.",
          "Added environment file generation and base utility/provider scaffolding for generated Next.js apps.",
          "Set up the monorepo with web, docs, and shared UI packages.",
          "Added the shared UI package with shadcn/ui component tooling.",
          "Added the marketing site, docs site, FAQ, quickstart, integrations content, and package documentation.",
        ],
      },
      {
        title: "Fixed",
        items: [
          "Ensured generated projects scaffold before installers run.",
          "Corrected Prisma provider generation per selected database.",
          "Fixed Hono template output and generated project build/lint issues.",
          "Removed the deprecated Lucia auth option from CLI prompts and types.",
          "Improved web metadata, accessibility, community links, and shared UI Tailwind config exports.",
        ],
      },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reference"
        title="Changelog"
        lead="A versioned history of notable changes across the CLI, docs, web app, generated templates, and shared UI package."
      />

      <Prose>
        <Callout type="note" title="Based on git history">
          This page follows the repository changelogs generated from commit
          history. The unreleased section reflects the current workspace
          changes.
        </Callout>
      </Prose>

      <ChangelogList changes={changes} />

      <DocFooter />
    </>
  );
}
