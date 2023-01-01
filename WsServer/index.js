const { WebSocketServer, OPEN } = require('ws');
function startServer(port){
  const wss = new WebSocketServer({ port });

  wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {

      wss.clients.forEach(function each(client) {
        if (client.readyState === OPEN) {
          client.send(data, { binary: isBinary });
        }
      });
    });
  });

  return wss
}

module.exports = {
  startServer 
}