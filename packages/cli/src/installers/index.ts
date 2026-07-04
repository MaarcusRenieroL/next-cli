import { AvailablePackages, PkgInstallerMap } from "@/types/global.js";
import { honoInstaller } from "@/installers/api/hono.js";
import { prismaInstaller } from "@/installers/orm/prisma.js";
import { drizzleInstaller } from "@/installers/orm/drizzle.js";
import { tailwindInstaller } from "@/installers/ui/tailwind.js";
import { shadcnInstaller } from "@/installers/ui/shadcn.js";
import { nextAuthInstaller } from "@/installers/auth/next-auth.js";
import { clerkInstaller } from "@/installers/auth/clerk.js";
import { kindeInstaller } from "@/installers/auth/kinde.js";
import { restApiInstaller } from "@/installers/api/rest-api.js";
import { trpcInstaller } from "./api/trpc.js";
import { graphqlInstaller } from "@/installers/api/graphql.js";
import { eslintInstaller } from "@/installers/config/eslint.js";
import { resendInstaller } from "./email/resend.js";
import { sendgridInstaller } from "@/installers/email/sendgrid.js";
import { mailgunInstaller } from "@/installers/email/mailgun.js";
import { postmarkInstaller } from "@/installers/email/postmark.js";
import { stripeInstaller } from "@/installers/payment/stripe.js";
import { paypalInstaller } from "@/installers/payment/paypal.js";
import { lemonSqueezyInstaller } from "@/installers/payment/lemon-squeezy.js";
import { razorpayInstaller } from "@/installers/payment/razorpay.js";
import { vercelAnalyticsInstaller } from "./analytics/vercel.js";
import { googleAnalyticsInstaller } from "./analytics/google.js";

export const buildPkgInstallerMap = (packages: AvailablePackages[]): PkgInstallerMap => ({
  prisma: {
    inUse: packages.includes("prisma"),
    installer: prismaInstaller,
  },
  drizzle: {
    inUse: packages.includes("drizzle"),
    installer: drizzleInstaller,
  },
  hono: {
    inUse: packages.includes("hono"),
    installer: honoInstaller,
  },
  tailwind: {
    inUse: packages.includes("tailwind"),
    installer: tailwindInstaller,
  },
  "shadcn-ui": {
    inUse: packages.includes("shadcn-ui"),
    installer: shadcnInstaller,
  },
  eslint: {
    inUse: packages.includes("eslint"),
    installer: eslintInstaller,
  },
  trpc: {
    inUse: packages.includes("trpc"),
    installer: trpcInstaller,
  },
  graphql: {
    inUse: packages.includes("graphql"),
    installer: graphqlInstaller,
  },
  "next-auth": {
    inUse: packages.includes("next-auth"),
    installer: nextAuthInstaller,
  },
  clerk: {
    inUse: packages.includes("clerk"),
    installer: clerkInstaller,
  },
  kinde: {
    inUse: packages.includes("kinde"),
    installer: kindeInstaller,
  },
  "rest-api": {
    inUse: packages.includes("rest-api"),
    installer: restApiInstaller,
  },
  resend: {
    inUse: packages.includes("resend"),
    installer: resendInstaller,
  },
  sendgrid: {
    inUse: packages.includes("sendgrid"),
    installer: sendgridInstaller,
  },
  mailgun: {
    inUse: packages.includes("mailgun"),
    installer: mailgunInstaller,
  },
  postmark: {
    inUse: packages.includes("postmark"),
    installer: postmarkInstaller,
  },
  stripe: {
    inUse: packages.includes("stripe"),
    installer: stripeInstaller,
  },
  paypal: {
    inUse: packages.includes("paypal"),
    installer: paypalInstaller,
  },
  "lemon-squeezy": {
    inUse: packages.includes("lemon-squeezy"),
    installer: lemonSqueezyInstaller,
  },
  razorpay: {
    inUse: packages.includes("razorpay"),
    installer: razorpayInstaller,
  },
  "vercel-analytics": {
    inUse: packages.includes("vercel-analytics"),
    installer: vercelAnalyticsInstaller,
  },
  "google-analytics": {
    inUse: packages.includes("google-analytics"),
    installer: googleAnalyticsInstaller,
  },
});
