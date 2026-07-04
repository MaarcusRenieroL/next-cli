import { confirm, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "fs-extra";
import ora from "ora";
import path from "path";

import { PKG_ROOT } from "@/constants/index.js";
import { CLIOptions } from "@/types/global.js";
import { getProjectDir, isProtectedProjectDir } from "./project-path.js";

// This bootstraps the base Next.js application
export const scaffoldProject = async ({ projectName, targetDir, projectDir: configuredProjectDir, empty, scopedAppName }: CLIOptions) => {
  try {
    const projectDir = configuredProjectDir || getProjectDir(targetDir, projectName);
    const srcDir = path.join(PKG_ROOT, "template/base");

    const spinner = ora(`Scaffolding in: ${projectDir}...\n`).start();

    if (fs.existsSync(projectDir)) {
      if (fs.readdirSync(projectDir).length === 0) {
        if (projectName !== ".") spinner.info(`${chalk.cyan.bold(projectName)} exists but is empty, continuing...\n`);
      } else {
        spinner.stopAndPersist();
        const overwriteDir = await select({
          message: `${chalk.redBright.bold("Warning:")} ${chalk.cyan.bold(projectName)} already exists and isn't empty. How would you like to proceed?`,
          choices: [
            {
              name: "Abort installation (recommended)",
              value: "abort",
            },
            {
              name: "Clear the directory and continue installation",
              value: "clear",
            },
            {
              name: "Continue installation and overwrite conflicting files",
              value: "overwrite",
            },
          ],
          default: "abort",
        });
        if (overwriteDir === "abort") {
          spinner.fail("Aborting installation...");
          process.exit(1);
        }

        const overwriteAction = overwriteDir === "clear" ? `clear ${projectDir}` : "overwrite conflicting files";

        const confirmOverwriteDir = await confirm({
          message: `Are you sure you want to ${overwriteAction}?`,
          default: false,
        });

        if (!confirmOverwriteDir) {
          spinner.fail("Aborting installation...");
          process.exit(1);
        }

        if (overwriteDir === "clear") {
          if (isProtectedProjectDir(projectDir)) {
            spinner.fail(`Refusing to clear protected directory: ${projectDir}`);
            process.exit(1);
          }

          spinner.info(`Emptying ${chalk.cyan.bold(projectName)} and creating Nextkit app..\n`);
          fs.emptyDirSync(projectDir);
        }
      }
    }

    spinner.start();

    const setupEnvContents = `import createJiti from "jiti";
import { fileURLToPath } from "node:url";

const jiti = createJiti(fileURLToPath(import.meta.url));
jiti("./${scopedAppName === "src" ? "src/" : ""}env/index.ts");

    `;

    const nextConfigPath = path.join(srcDir, "next.config.js");
    let nextConfigContent = fs.readFileSync(nextConfigPath, "utf8");
    nextConfigContent = nextConfigContent.replace(/\/\/ @ts-nocheck\r?\n/, "");

    const typeLine = "/** @type {import('next').NextConfig} */";

    if (!empty) {
      if (nextConfigContent.includes(typeLine)) {
        nextConfigContent = nextConfigContent.replace(typeLine, `${typeLine}\n\n${setupEnvContents}`);
      }
    }

    fs.copySync(srcDir, projectDir);
    fs.renameSync(path.join(projectDir, "_gitignore"), path.join(projectDir, ".gitignore"));
    fs.writeFileSync(path.join(projectDir, "next.config.js"), nextConfigContent);
    fs.writeFileSync(path.join(projectDir, ".env"), "");

    // for the no-src ("app") layout, point the "@/*" alias at the project root.
    // the tsconfig has JSONC comments, so use a string replace rather than JSON.parse.
    if (scopedAppName !== "src") {
      const tsconfigPath = path.join(projectDir, "tsconfig.json");
      if (fs.existsSync(tsconfigPath)) {
        const tsconfigRaw = fs.readFileSync(tsconfigPath, "utf8");
        fs.writeFileSync(tsconfigPath, tsconfigRaw.replace(/"@\/\*":\s*\[\s*"\.\/src\/\*"\s*\]/, '"@/*": ["./*"]'));
      }
    }

    const scaffoldedName = projectName === "." ? "Nextkit App" : chalk.cyan.bold(projectName);

    spinner.succeed(`${scaffoldedName} ${chalk.green("scaffolded successfully!")}\n`);
  } catch (error) {
    console.log(error);
  }
};
