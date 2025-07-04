import { INestApplication } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer, createLogger } from 'vite';
import { Server } from 'http';
import { nanoid } from 'nanoid';
import { fileURLToPath } from 'url';
import viteConfig from '../../../vite.config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = 'vite') {
    const formattedTime = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: INestApplication, server: Server) {
    const adapter = app.getHttpAdapter().getInstance();
    const serverOptions = {
        middlewareMode: true,
        hmr: { server },
        allowedHosts: true as true,
    };

    const viteLogger = createLogger();

    const vite = await createViteServer({
        ...viteConfig,
        configFile: false,
        customLogger: {
            ...viteLogger,
            error: (msg, options) => {
                viteLogger.error(msg, options);
                process.exit(1);
            },
        },
        server: serverOptions,
        appType: 'custom',
    });

    adapter.use(vite.middlewares);
    adapter.use('*', async (req: Request, res: Response, next: NextFunction) => {
        const url = req.originalUrl;
        try {
            const clientTemplate = path.resolve(
                __dirname,
                '../../../client/index.html',
            );
            let template = await fs.promises.readFile(clientTemplate, 'utf-8');
            template = template.replace(
                `src="/src/main.tsx"`,
                `src="/src/main.tsx?v=${nanoid()}"`,
            );
            const page = await vite.transformIndexHtml(url, template);
            res.status(200).set({ 'Content-Type': 'text/html' }).end(page);
        } catch (e) {
            vite.ssrFixStacktrace(e as Error);
            next(e);
        }
    });
}

export function serveStatic(adapter: any) {
    const distPath = path.resolve(__dirname, '../../../dist/public');

    if (!fs.existsSync(distPath)) {
        throw new Error(
            `Could not find the build directory: ${distPath}, make sure to build the client first`,
        );
    }

    adapter.use(require('express').static(distPath));

    adapter.use('*', (_req: Request, res: Response) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
    });
}

