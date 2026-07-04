import { createProject } from "@/helpers/create-project.js";
import { buildPkgInstallerMap } from "@/installers/index.js";
import { input, select } from "@inquirer/prompts";
import chalk from "chalk";
import { AvailablePackages, CLIOptions, DatabaseProvider, PackageManager, PackageManagerX } from "../types/global.js";
import { exit, printSuccessMessage } from "../utils/message.js";
import { setImportAlias } from "@/helpers/set-import-alias.js";
import { removeTsNoCheck } from "@/helpers/remove-ts-no-check.js";
import ora from "ora";
import { execSync } from "child_process";
import { getInstallCommand } from "@/utils/index.js";
import { logger } from "@/utils/logger.js";
import { getProjectDir, validateProjectName, validateTargetDir } from "@/helpers/project-path.js";

const packageManagerXMap: Record<PackageManager, PackageManagerX> = {
  yarn: "yarn",
  npm: "npx",
  pnpm: "pnpx",
  bun: "bunx",
};

// Helper to handle common input logic
async function getInput<T extends any | boolean>(message: string, choices?: { name: string; value: T }[], defaultValue?: T): Promise<T> {
  if (choices) {
    return await select({ message, choices, default: defaultValue });
  } else {
    return (await input({
      message,
      default: String(defaultValue),
      validate: (value: string) => (value && value.trim() ? true : `${message} cannot be empty!`),
    })) as T;
  }
}

export async function init(options: CLIOptions) {
  try {
    options.projectName ??= await getInput("What is your project name? ›", undefined, "cli-app");
    options.targetDir ??= await getInput("Where do you want to create the project? (path) ›", undefined, process.cwd());
    options.projectName = validateProjectName(options.projectName);
    options.targetDir = validateTargetDir(options.targetDir);

    options.eslint ??= await getInput(
      `Would you like to ${chalk.blueBright("ESLint")}? ›`,
      [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
      true
    );

    options.tailwind ??= await getInput(
      `Would you like to ${chalk.blueBright("Tailwind CSS")}? ›`,
      [
        { name: "Yes", value: true },
        { name: "No", value: false },
      ],
      true
    );

    options.scopedAppName ??= await getInput(
      `Would you like to ${chalk.blueBright("`src/` directory")}? ›`,
      [
        { name: "Yes", value: "src" },
        { name: "No", value: "app" },
      ],
      "src"
    );

    options.alias ??= await getInput("What alias pattern would you like to use? ›", undefined, "@/*");

    options.packageManager ??= await getInput("Which package manager would you like to use? ›", [
      { name: "Npm", value: "npm" },
      { name: "Yarn", value: "yarn" },
      { name: "Pnpm", value: "pnpm" },
      { name: "Bun", value: "bun" },
    ]);

    options.packageManagerX ??= packageManagerXMap[options.packageManager];

    options.uiLibrary ??= await getInput(
      "Which UI library would you like to use? ›",
      [
        { name: "No UI Library", value: "none" },
        { name: "ShadCN UI", value: "shadcn-ui" },
      ],
      "shadcn-ui"
    );

    options.database ??= await getInput(
      "Which database would you like to use? ›",
      [
        { name: "PostgreSQL", value: "postgresql" },
        { name: "MongoDB", value: "mongodb" },
        { name: "MySQL", value: "mysql" },
        { name: "SQLite", value: "sqlite" },
        { name: "No Database", value: "none" },
      ],
      "postgresql"
    );

    if (options.database !== "none") {
      options.orm ??= await getInput(
        "Which ORM would you like to use? ›",
        [
          { name: "Prisma", value: "prisma" },
          { name: "Drizzle", value: "drizzle" },
          { name: "No ORM", value: "none" },
        ],
        "prisma"
      );

      options.auth ??= await getInput(
        "Which authentication package would you like to use? ›",
        [
          { name: "Next Auth", value: "next-auth" },
          { name: "Clerk", value: "clerk" },
          { name: "Kinde", value: "kinde" },
          { name: "No Authentication", value: "none" },
        ],
        "next-auth"
      );

      options.payment ??= await getInput("Which payment service would you like to use? ›", [
        { name: "No Payment Service", value: "none" },
        { name: "Stripe", value: "stripe" },
        { name: "Paypal", value: "paypal" },
        { name: "Lemon Squeezy", value: "lemon-squeezy" },
        { name: "Razorpay", value: "razorpay" },
      ]);
    } else {
      options.auth ??= await getInput("Which authentication package would you like to use? ›", [
        { name: "No Authentication", value: "none" },
        { name: "Clerk", value: "clerk" },
        { name: "Kinde", value: "kinde" },
      ]);
    }

    options.email ??= await getInput(
      "Which email package would you like to use? ›",
      [
        { name: "Resend", value: "resend" },
        { name: "Mailgun", value: "mailgun" },
        { name: "Sendgrid", value: "sendgrid" },
        { name: "Postmark", value: "postmark" },
        { name: "No Email Package", value: "none" },
      ],
      "resend"
    );

    options.api ??= await getInput("How do you want to write your APIs", [
      { name: "Hono", value: "hono" },
      { name: "tRPC", value: "trpc" },
      { name: "Rest API", value: "rest" },
      { name: "GraphQL", value: "graphql" },
      { name: "No APIs", value: "none" },
    ]);

    options.analytics ??= await getInput("Which analytics service would you like to use? ›", [
      { name: "No Analytics", value: "none" },
      { name: "Vercel Analytics", value: "vercel-analytics" },
      { name: "Google Analytics", value: "google-analytics" },
    ]);

    options.empty ??= await getInput("Would you like to generate an empty project structure? ›", [
      { name: "No", value: false },
      { name: "Yes", value: true },
    ]);

    options.skipInstall ??= await getInput(`Would you like to skip running ${options.packageManager} install? ›`, [
      { name: "No", value: false },
      { name: "Yes", value: true },
    ]);

    if (options.uiLibrary === "shadcn-ui" && !options.tailwind) {
      logger.info("shadcn/ui requires Tailwind CSS, so Tailwind has been enabled.");
      options.tailwind = true;
    }

    // setup the project
    options.projectDir = getProjectDir(options.targetDir, options.projectName);

    const packages: AvailablePackages[] = [];

    if (options.eslint) packages.push("eslint");
    if (options.tailwind) packages.push("tailwind");
    if (options.uiLibrary === "shadcn-ui") packages.push("shadcn-ui");

    if (options.database !== "none") {
      switch (options.orm) {
        case "prisma":
          packages.push("prisma");
          break;
        case "drizzle":
          packages.push("drizzle");
          break;
        default:
          break;
      }
    }

    switch (options.api) {
      case "hono":
        packages.push("hono");
        break;
      case "trpc":
        packages.push("trpc");
        break;
      case "rest":
        packages.push("rest-api");
        break;
      case "graphql":
        packages.push("graphql");
        break;
      default:
        break;
    }

    switch (options.auth) {
      case "next-auth":
        packages.push("next-auth");
        break;
      case "clerk":
        packages.push("clerk");
        break;
      case "kinde":
        packages.push("kinde");
        break;
      default:
        break;
    }

    switch (options.email) {
      case "resend":
        packages.push("resend");
        break;
      case "sendgrid":
        packages.push("sendgrid");
        break;
      case "mailgun":
        packages.push("mailgun");
        break;
      case "postmark":
        packages.push("postmark");
        break;
      default:
        break;
    }

    switch (options.payment) {
      case "stripe":
        packages.push("stripe");
        break;
      case "paypal":
        packages.push("paypal");
        break;
      case "lemon-squeezy":
        packages.push("lemon-squeezy");
        break;
      case "razorpay":
        packages.push("razorpay");
        break;
      default:
        break;
    }

    switch (options.analytics) {
      case "vercel-analytics":
        packages.push("vercel-analytics");
        break;
      case "google-analytics":
        packages.push("google-analytics");
        break;
      default:
        break;
    }

    const usePackages = buildPkgInstallerMap(packages);

    const databaseProvider: DatabaseProvider = options.database && options.database !== "none" ? options.database : "postgresql";

    // always scaffold the project, regardless of whether a database was chosen
    await createProject({ ...options, databaseProvider, packages: usePackages, packageList: packages });

    // update import alias in any generated files if not using the default
    if (options.alias !== "@/*") {
      setImportAlias(options.projectDir, options.alias);
    }

    removeTsNoCheck(options.projectDir);

    if (!options.skipInstall) {
      // The generated package.json already lists every selected dependency, so a
      // single install resolves the whole tree at once instead of running the
      // package manager once per package (which is slow and prone to spurious
      // peer-dependency failures).
      const command = getInstallCommand(options.packageManager);
      const spinner = ora(`Installing dependencies (${command})...`).start();

      try {
        execSync(command, { stdio: "ignore", cwd: options.projectDir });
        spinner.succeed(chalk.green("Successfully installed dependencies"));
      } catch (error) {
        spinner.fail(chalk.red("Failed to install dependencies"));
        logger.error(`Try running "${command}" manually inside ${options.projectDir}.`);
        if (options.packageManager === "pnpm") {
          logger.info("If pnpm asks to approve build scripts, review the package list before approving them.");
        }
        if (error instanceof Error) {
          logger.error(error.message);
        }
      }
    }

    printSuccessMessage(options.packageManager, options.projectName);
  } catch (error) {
    console.log(error);
    exit();
  }
}
