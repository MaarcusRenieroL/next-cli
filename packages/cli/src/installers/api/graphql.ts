import { Installer } from "@/types/global.js";
import { addPackageDependency } from "@/utils/add-package-dependency.js";
import fs from "fs-extra";
import path from "path";

export const graphqlInstaller: Installer = ({ targetDir, projectName, scopedAppName, empty }) => {
  const projectDir = targetDir ? path.join(targetDir, projectName) : projectName;

  if (!projectDir) {
    throw new Error("Project directory is required");
  }

  addPackageDependency({
    projectDir,
    dependencies: ["graphql", "graphql-yoga"],
    devMode: false,
  });

  if (empty) return;

  const base = path.join(projectDir, scopedAppName === "src" ? "src" : "");

  const routeContent = `// @ts-nocheck
import { createSchema, createYoga } from "graphql-yoga";

const schema = createSchema({
  typeDefs: /* GraphQL */ \`
    type Query {
      hello: String!
    }
  \`,
  resolvers: {
    Query: {
      hello: () => "Hello from GraphQL Yoga!",
    },
  },
});

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },
});

const handleAuthenticatedRequest = (request: Request, context: unknown) => {
  if (!process.env.API_SECRET) {
    return new Response(JSON.stringify({ error: "API_SECRET is not configured" }), { status: 500 });
  }

  const token = request.headers.get("authorization")?.replace(/^Bearer\\s+/i, "");

  if (token !== process.env.API_SECRET) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  return handleRequest(request, context);
};

export { handleAuthenticatedRequest as GET, handleAuthenticatedRequest as POST, handleRequest as OPTIONS };
`;

  const routeDest = path.join(base, "app/api/graphql/route.ts");
  fs.mkdirSync(path.dirname(routeDest), { recursive: true });
  fs.writeFileSync(routeDest, routeContent);

  fs.appendFileSync(path.join(projectDir, ".env"), "\n\nAPI_SECRET=replace-with-at-least-32-random-characters");
};
