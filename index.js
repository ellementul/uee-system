const { WsTransport } = require('./Transport')
const transport = new WsTransport("wss://sixty-toes-thank-45-153-213-108.loca.lt")
transport.onRecieve(console.log)
transport.send({ test: "0987654321" })