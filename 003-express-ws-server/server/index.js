// Initialize the API server
import express from 'express';
const app = express();
import { createServer } from 'http';
const server = createServer(app);

// Initialize the Websocket server
import WebSocket, { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ server: server });

wss.on('connection', (ws, req) => {
  console.log('New connection established!', req.url);

  // Router guard
  if (req.url !== '/test') {
    ws.send('Wrong channel');
    return;
  }

  let welcomeMsg = {
    sender: 'Server',
    data: 'Welcome!',
  };
  ws.send(JSON.stringify(welcomeMsg));

  ws.on('message', (msg, isBinary) => {
    console.log(`received: ${msg}`);

    wss.clients.forEach(function each(client) {
      // Broadcast to everyone except the sender
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    });
    // ws.send(`me: ${msg}`);
  });
});

// TODO: Import the API router
app.get('/', (req, res) => {
  res.send('Hello');
});

server.listen(5000, () => {
  console.log('Server started on port 5000...');
});
