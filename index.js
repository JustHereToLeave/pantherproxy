// Filename: index.js
import { createBareServer } from '@tomphttp/bare-server-node';
import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer();
// Create a Bare server instance, which is the backend for Ultraviolet
const bareServer = createBareServer('/bare/');

// Serve the Ultraviolet scripts from the installed package
app.use('/uv/', express.static(uvPath));

// Serve the frontend files (index.html, uv.config.js) from the project root
app.use(express.static(__dirname));

// This handles the regular HTTP requests for the proxy
app.use((req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        res.status(404).send('Not Found');
    }
});

// This handles the WebSocket connections, which are crucial for many sites
server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.destroy();
    }
});

server.on('request', app);

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log('pantherproxy is running on port', port);
});
