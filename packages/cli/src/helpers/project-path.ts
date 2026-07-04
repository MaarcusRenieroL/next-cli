import path from "path";
import os from "os";

const WINDOWS_RESERVED_NAMES = /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i;

export const validateProjectName = (projectName: string): string => {
  const name = projectName.trim();

  if (!name) {
    throw new Error("Project name cannot be empty.");
  }

  if (name === ".") {
    return name;
  }

  if (name === ".." || name.includes("/") || name.includes("\\") || path.isAbsolute(name)) {
    throw new Error("Project name must be a folder name, not a path.");
  }

  if (WINDOWS_RESERVED_NAMES.test(name) || /[<>:"|?*\0]/.test(name)) {
    throw new Error("Project name contains characters that are not safe for a folder name.");
  }

  return name;
};

export const validateTargetDir = (targetDir: string): string => {
  const dir = targetDir.trim();

  if (!dir) {
    throw new Error("Target directory cannot be empty.");
  }

  if (dir.includes("\0")) {
    throw new Error("Target directory contains an invalid character.");
  }

  return dir;
};

export const getProjectDir = (targetDir: string | undefined, projectName: string): string => {
  const safeProjectName = validateProjectName(projectName);
  const safeTargetDir = targetDir ? validateTargetDir(targetDir) : process.cwd();
  const projectPath = safeProjectName === "." ? safeTargetDir : path.join(safeTargetDir, safeProjectName);

  return path.resolve(projectPath);
};

export const isProtectedProjectDir = (projectDir: string): boolean => {
  const resolvedProjectDir = path.resolve(projectDir);

  return resolvedProjectDir === path.parse(resolvedProjectDir).root || resolvedProjectDir === os.homedir();
};
