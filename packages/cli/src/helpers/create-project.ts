import { AvailablePackages, CLIOptions, DatabaseProvider, PkgInstallerMap } from "@/types/global.js";
import { getUserPkgManager } from "@/utils/get-user-pkg-manager.js";
import { selectLayoutFile, selectLibsFile, selectPageFile, selectProviderFile, selectStylesFile } from "./generate-boilerplate.js";
import { installPackages } from "./install-packages.js";
import { getProjectDir } from "./project-path.js";
import { scaffoldProject } from "./setup-base-project.js";
import { setupEnv } from "./setup-env.js";

type CreateProjectOptions = CLIOptions & {
  packages: PkgInstallerMap;
  databaseProvider: DatabaseProvider;
  packageList: AvailablePackages[];
};

export const createProject = async ({ packages, databaseProvider, ...options }: CreateProjectOptions) => {
  const pkgManager = getUserPkgManager();
  const projectDir = getProjectDir(options.targetDir, options.projectName);
  const resolvedOptions = { ...options, projectDir };

  // Setup the base Next.js application
  await scaffoldProject({
    ...resolvedOptions,
  });
  selectLayoutFile({
    ...resolvedOptions,
    packages,
    projectDir: projectDir,
  });
  selectPageFile({
    ...resolvedOptions,
    packages,
    projectDir: projectDir,
  });
  selectProviderFile({
    ...resolvedOptions,
    packages,
    projectDir: projectDir,
  });
  selectLibsFile({
    ...resolvedOptions,
    packages,
    projectDir: projectDir,
  });
  selectStylesFile({
    ...resolvedOptions,
    packages,
    projectDir: projectDir,
  });
  // Install the selected packages
  await installPackages({
    ...resolvedOptions,
    projectDir,
    packageManager: options.packageManager || pkgManager,
    packages,
    databaseProvider,
  });

  setupEnv(resolvedOptions);

  return projectDir;
};
