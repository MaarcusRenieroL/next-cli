import path from "path";
import fs from "fs-extra";
import { Installer } from "@/types/global.js";
import { addPackageDependency } from "@/utils/add-package-dependency.js";
import { PKG_ROOT } from "@/constants/index.js";

export const tailwindInstaller: Installer = ({ projectDir, scopedAppName }) => {
  addPackageDependency({
    projectDir,
    dependencies: ["tailwindcss", "postcss", "prettier", "prettier-plugin-tailwindcss", "tailwindcss-animate"],
    devMode: true,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras/ui");
  const templateDir = path.join(PKG_ROOT, "template");

  const twCfgSrc = path.join(extrasDir, "tailwind/tailwind.config.ts");
  const twCfgDest = path.join(projectDir, "tailwind.config.ts");

  const postcssCfgSrc = path.join(extrasDir, "tailwind/postcss.config.cjs");
  const postcssCfgDest = path.join(projectDir, "postcss.config.cjs");

  const prettierSrc = path.join(extrasDir, "../config/_prettier.config.ts");
  const prettierDest = path.join(projectDir, "prettier.config.ts");

  const cssSrc = path.join(templateDir, "nextjs/styles/globals.css");
  const cssDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "styles/globals.css");

  fs.copySync(twCfgSrc, twCfgDest);
  fs.copySync(postcssCfgSrc, postcssCfgDest);
  fs.copySync(cssSrc, cssDest);
  fs.copySync(prettierSrc, prettierDest);
};
