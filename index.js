const { WsTransport } = require('./Transport')
const transport = new WsTransport("ws://localhost:8080")
transport.onRecieve(console.log)
transport.send({ test: "0987654321" })