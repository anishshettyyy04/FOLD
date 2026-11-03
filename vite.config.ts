import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminPassword = env.ADMIN_PASSWORD || "admin123";
  let localSettings = {
    venue: "MITE campus",
    event_date: "2026-11-13",
    time: "",
    formUrl: "",
  };

  return {
    plugins: [
      react(),
      {
        name: "local-api-handler",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === "/api/event") {
              res.setHeader("Content-Type", "application/json");
              if (req.method === "GET") {
                res.end(JSON.stringify(localSettings));
                return;
              }
              if (req.method === "PUT") {
                let body = "";
                req.on("data", (chunk) => (body += chunk));
                req.on("end", () => {
                  const auth = req.headers.authorization;
                  if (auth !== `Bearer ${adminPassword}`) {
                    res.statusCode = 401;
                    res.end(
                      JSON.stringify({ error: "Organizer password was not accepted." })
                    );
                    return;
                  }
                  try {
                    const parsed = JSON.parse(body);
                    localSettings = { ...localSettings, ...parsed };
                    res.end(JSON.stringify(localSettings));
                  } catch {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: "Invalid JSON" }));
                  }
                });
                return;
              }
            }
            next();
          });
        },
      },
    ],
    build: { sourcemap: false },
  };
});

