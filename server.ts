import express from "express";
import path from "path";
import fs from "fs";
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
      const url = req.originalUrl.split('?')[0];
      
      // Determine which HTML file to serve
      let targetFile = "";
      if (url === "/" || url === "/index") {
        targetFile = "index.html";
      } else if (!url.includes(".")) {
        targetFile = `${url.slice(1)}.html`;
      }

      if (targetFile) {
        const filePath = path.resolve(__dirname, targetFile);
        try {
          let html = await fs.promises.readFile(filePath, "utf-8");
          // Transform the HTML through Vite to handle imports/styles
          html = await vite.transformIndexHtml(req.originalUrl, html);
          return res.status(200).set({ "Content-Type": "text/html" }).end(html);
        } catch (e) {
          // If file doesn't exist, let it fall through
          next();
        }
      } else {
        next();
      }
    });

  } else {
    // Production setup
    const distPath = path.join(process.cwd(), "dist");
    
    // Serve static files first
    app.use(express.static(distPath, { extensions: ["html"] }));
    
    // Fallback for clean URLs manually if extensions fails
    app.get("*", (req, res) => {
      const url = req.path;
      if (url === "/" || url === "/index") {
        return res.sendFile(path.join(distPath, "index.html"));
      }
      
      const possibleFile = path.join(distPath, `${url}.html`);
      if (fs.existsSync(possibleFile)) {
        return res.sendFile(possibleFile);
      }

      // If it's a known route but file not found, or just fallback to index
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
