import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Important for custom routing
    });
    
    app.use(vite.middlewares);

    // Custom routing for .html files (clean URLs) in dev
    app.get("*", async (req, res, next) => {
      const url = req.originalUrl.split('?')[0]; // Remove query params
      
      // If URL is root, serve index.html
      if (url === "/" || url === "/index") {
        return res.sendFile(path.join(__dirname, "index.html"));
      }

      // Try serving the file as .html
      const possibleFile = path.join(__dirname, `${url}.html`);
      try {
        res.sendFile(possibleFile, (err) => {
          if (err) {
            // If not found, let it go to 404 or other handlers
            next();
          }
        });
      } catch (e) {
        next();
      }
    });

  } else {
    // Production setup
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { extensions: ["html"] }));
    
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
