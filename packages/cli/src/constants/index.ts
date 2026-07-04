import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

// With the move to TSUP as a build tool, this keeps path routes in other files (installers, loaders, etc) in check more easily.
// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url);
const distPath = path.dirname(__filename);
const packageRoot = path.join(distPath, "../");
const sourcePackageRoot = path.join(distPath, "../../");

export const PKG_ROOT = existsSync(path.join(packageRoot, "template")) ? packageRoot : sourcePackageRoot;
