class UnitedEventsNode {
  constructor(room) {
    if(typeof room !== "object") throw new TypeError("Constructor waits for object of class Room!")

    this.room = room
  }

  build(transport) {
    this.room.build(this.getConfig())

    if(transport)
      this.room.provider.setTransport(transport)
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