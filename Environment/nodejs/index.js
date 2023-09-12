class UnitedEventsNode {
  constructor(room) {
    if(typeof room !== "object") throw new TypeError("Constructor waits for object of class Room!")

    this.room = room
  }

  build(Transport) {
    this.room.build(this.getConfig())

    if(Transport) {
      const transport = new Transport(this.getConfig())
      this.room.provider.setTransport(transport)
    }
  }

  run() {
    this.room.open(this.getConfig())
  }

  getConfig({ env } = {}) {
    const config = require('./uee.config.json')

    config.env = {}
    if(env)
      for (const envVar of env) {
        config.env[envVar] = process.env[envVar]
      }

    return config
  }
}

module.exports = { UnitedEventsNode }