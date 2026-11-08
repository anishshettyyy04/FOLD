import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const adminPassword = env.ADMIN_PASSWORD || "Zerone@2026";
  let localSettings = {
    venue: "ISE LAB (30 seater 1st floor main block)",
    event_date: "2026-11-12",
    time: "11:00",
    formUrl: "https://forms.gle/xgwbdJaWfsybkp6M7",
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

