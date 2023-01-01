const WebSocket = require('ws')
const { startServer } = require('./index')


describe('WebSocket Server', () => {
  
  test('start server', () => {
    const webSocketServer = startServer(8080)
    expect(webSocketServer).toBeDefined();
    webSocketServer.close()
  });

  test('send message', done => {
    const port = 8080
    const fakeData = "TestingData"
    const webSocketServer = startServer(port)
    
    const socket = new WebSocket(`ws://localhost:${port}`)
    socket.on('open', () => {
      socket.send(fakeData)
    })
    socket.on('message', data => {
      expect(data.toString()).toEqual(fakeData)
      socket.close()
      webSocketServer.close()
      done()
    })
  });
});