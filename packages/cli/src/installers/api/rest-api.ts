import { PKG_ROOT } from "@/constants/index.js";
import { Installer } from "@/types/global.js";
import { addPackageDependency } from "@/utils/add-package-dependency.js";
import fs from "fs-extra";
import path from "path";

export const restApiInstaller: Installer = ({ targetDir, projectName, scopedAppName, empty }) => {
  const projectDir = targetDir ? path.join(targetDir, projectName) : projectName;

  if (!projectDir) {
    throw new Error("Project directory is required");
  }

  // Add rest api dependencies
  addPackageDependency({
    projectDir,
    dependencies: ["axios"],
    devMode: false,
  });

  if (!empty) {
    // Copy rest api specific files
    const extrasDir = path.join(PKG_ROOT, "template/extras/api");

    // route handler copy
    const restApiApiSrc = path.join(extrasDir, "rest-api/api/index.ts");
    const apiRouteContent = fs.readFileSync(restApiApiSrc, "utf-8");

    const restApiApiDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "app/api/test/route.ts");
    fs.mkdirSync(path.dirname(restApiApiDest), { recursive: true });
    fs.writeFileSync(restApiApiDest, apiRouteContent);

    fs.appendFileSync(path.join(projectDir, ".env"), "\n\nAPI_SECRET=replace-with-at-least-32-random-characters");
  }
};
