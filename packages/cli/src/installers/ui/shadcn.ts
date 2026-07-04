import { PKG_ROOT } from "@/constants/index.js";
import { Installer } from "@/types/global.js";
import { addPackageDependency } from "@/utils/add-package-dependency.js";
import fs from "fs-extra";
import path from "path";

const cssVariables = `

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;
    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;
    --secondary: 240 4.8% 95.9%;
    --secondary-foreground: 240 5.9% 10%;
    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;
    --accent: 240 4.8% 95.9%;
    --accent-foreground: 240 5.9% 10%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;
    --ring: 240 10% 3.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;
    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;
    --secondary: 240 3.7% 15.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;
    --accent: 240 3.7% 15.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
    --ring: 240 4.9% 83.9%;
  }

  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
  }
}
`;

const buildComponentsJson = (scopedAppName: "src" | "app" | undefined) => {
  const appPrefix = scopedAppName === "src" ? "src/" : "";

  return {
    $schema: "https://ui.shadcn.com/schema.json",
    style: "new-york",
    rsc: true,
    tsx: true,
    tailwind: {
      config: "tailwind.config.ts",
      css: `${appPrefix}styles/globals.css`,
      baseColor: "zinc",
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      components: "@/components",
      ui: "@/components/ui",
      utils: "@/libs/utils",
      lib: "@/libs",
      hooks: "@/hooks",
    },
  };
};

export const shadcnInstaller: Installer = ({ projectDir, scopedAppName }) => {
  addPackageDependency({
    projectDir,
    dependencies: ["@radix-ui/react-slot", "class-variance-authority", "lucide-react"],
    devMode: false,
  });

  const base = path.join(projectDir, scopedAppName === "src" ? "src" : "");
  const extrasDir = path.join(PKG_ROOT, "template/extras/ui/shadcn");
  const componentDest = path.join(base, "components/ui");

  fs.mkdirSync(componentDest, { recursive: true });
  fs.copySync(path.join(extrasDir, "button.tsx"), path.join(componentDest, "button.tsx"));
  fs.copySync(path.join(extrasDir, "card.tsx"), path.join(componentDest, "card.tsx"));
  fs.writeJSONSync(path.join(projectDir, "components.json"), buildComponentsJson(scopedAppName), { spaces: 2 });

  const cssPath = path.join(base, "styles/globals.css");
  const cssContent = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf-8") : "";

  if (!cssContent.includes("--background:")) {
    fs.writeFileSync(cssPath, `${cssContent.trimEnd()}${cssVariables}\n`, "utf-8");
  }
};
