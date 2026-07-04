import { PKG_ROOT } from "@/constants/index.js";
import { Installer } from "@/types/global.js";
import { addPackageDependency } from "@/utils/add-package-dependency.js";
import fs from "fs-extra";
import path from "path";

export const trpcInstaller: Installer = ({ projectDir, scopedAppName, empty }) => {
  // Add trpc dependencies
  addPackageDependency({
    projectDir,
    dependencies: ["@trpc/client", "@trpc/server", "@trpc/next", "@trpc/react-query", "@tanstack/react-query", "superjson", "zod"],
    devMode: false,
  });

  if (!empty) {
    // Copy trpc server files
    const extrasDir = path.join(PKG_ROOT, "template/extras/api");
    const trpcSrc = path.join(extrasDir, "trpc/server");
    const trpcDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "server");
    fs.copySync(trpcSrc, trpcDest);

    // trpc route handler
    const trpcApiSrc = path.join(extrasDir, "trpc/api/index.ts");
    const apiRouteContent = fs.readFileSync(trpcApiSrc, "utf-8");

    const trpcApiDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "app/api/trpc/[trpc]/route.ts");
    fs.mkdirSync(path.dirname(trpcApiDest), { recursive: true });
    fs.writeFileSync(trpcApiDest, apiRouteContent);

    // Copy trpc-provider file
    const trpcProviderSrc = path.join(extrasDir, "trpc/providers/trpc-provider.tsx");
    const trpcProviderDest = path.join(projectDir, scopedAppName === "src" ? "src" : "", "providers/trpc-provider.tsx");
    fs.copySync(trpcProviderSrc, trpcProviderDest);

    // below is the provider path in generated app
    const basePath = path.join(projectDir, scopedAppName === "src" ? "src" : "");
    const providerIndexPathInDest = path.join(basePath, "providers/index.tsx");

    const ProviderContent = fs.readFileSync(providerIndexPathInDest, "utf-8");

    if (fs.existsSync(providerIndexPathInDest)) {
      const updatedContent = ProviderContent.replace(
        "{children}",
        `
      <TrpcProvider>
        {children}
      </TrpcProvider>
      `
      );
      fs.writeFileSync(providerIndexPathInDest, 'import { TrpcProvider } from "@/providers/trpc-provider"\n' + updatedContent, "utf-8");
    }

    fs.appendFileSync(path.join(projectDir, ".env"), "\n\nAPI_SECRET=replace-with-at-least-32-random-characters");
  }
};
