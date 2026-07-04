import { PKG_ROOT } from "@/constants/index.js";
import { Installer } from "@/types/global.js";
import { addPackageDependency } from "@/utils/add-package-dependency.js";
import fs from "fs-extra";
import path from "path";

export const honoInstaller: Installer = ({ targetDir, projectName, scopedAppName, empty }) => {
  const projectDir = targetDir ? path.join(targetDir, projectName) : projectName;

  if (!projectDir) {
    throw new Error("Project directory is required");
  }

  // Add Hono dependencies
  addPackageDependency({
    projectDir,
    dependencies: ["hono", "@hono/zod-validator"],
    devMode: false,
  });

  if (!empty) {
    // Copy Hono-specific files
    const extrasDir = path.join(PKG_ROOT, "template/extras/api");
    const honoSrc = path.join(extrasDir, "hono/server");
    const honoDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "server");
    fs.copySync(honoSrc, honoDest);

    // Copy Hono-client files
    const honoClientSrc = path.join(extrasDir, "hono/client/index.ts");
    const honoClientDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "lib/hono.ts");
    fs.mkdirSync(path.dirname(honoClientDest), { recursive: true });
    fs.copySync(honoClientSrc, honoClientDest);

    // route handler copy
    const honoApiSrc = path.join(extrasDir, "hono/api/index.ts");
    const apiRouteContent = fs.readFileSync(honoApiSrc, "utf-8");

    const honoApiDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "app/api/[[...route]]/route.ts");
    fs.mkdirSync(path.dirname(honoApiDest), { recursive: true });
    fs.writeFileSync(honoApiDest, apiRouteContent);

    fs.appendFileSync(path.join(projectDir, ".env"), "\n\nAPI_SECRET=replace-with-at-least-32-random-characters");
  }
};
