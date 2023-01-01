const { WebSocketServer, OPEN } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data, isBinary) {

    wss.clients.forEach(function each(client) {
      if (client.readyState === OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});