// Filename: index.js
import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux';
import { join } from 'node:path';
import { hostname } from 'node:os';

const app = express();
const publicPath = 'public/'; // A folder named 'public' will hold our front-end
const server = createServer();

// Serve the front-end files from the 'public' directory
app.use(express.static(publicPath));

// Serve the Ultraviolet scripts
app.use('/uv/', express.static(uvPath));
// Serve Epoxy scripts
app.use('/epoxy/', express.static(epoxyPath));
// Serve Bare-Mux scripts
app.use('/baremux/', express.static(baremuxPath));

// When a user visits the root, send them the main HTML page
app.get('/', (req, res) => {
    res.sendFile(join(publicPath, 'index.html'));
});

// Handle 404 errors for any other routes
app.use((req, res) => {
    res.status(404);
    res.sendFile(join(publicPath, '404.html')); // You can create a custom 404 page if you want
});

server.on('request', (req, res) => {
    // Let express handle the static files and routing
    app(req, res);
});

server.on('upgrade', (req, socket, head) => {
    // This part is crucial for Ultraviolet's real-time communication
    if (req.url.endsWith('/w/')) {
        // Handle WebSocket upgrades for the proxy
        // (This is an advanced part of the proxy setup that Ultraviolet handles)
    } else {
        socket.destroy();
    }
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log('pantherproxy is running on port', port);
});
