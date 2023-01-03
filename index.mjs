import { question } from 'zx'
import { WsTransport } from '@ellementul/uee-ws-transport'

const answer = await question("Server URL: ")
const url = new URL(answer)

if(url.protocol === "http:")
  url.protocol = "ws"

if(url.protocol === "https:")
  url.protocol = "wss"

const transport = new WsTransport(url)
transport.onRecieve(console.log)
transport.send({ CheckingServer: "Succseful!" })