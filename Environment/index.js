import { events } from '@ellementul/uee-core'
const { errorEvent } = events

class UnitedEventsEnv {
  constructor(room) {
    if(typeof room !== "object") throw new TypeError("Constructor waits for object of class Room!")

    this.room = room
  }

  build(transport, env = []) {
    const baseUrl = transport ? transport.url : null

    this.getConfig({ baseUrl, env })
    .then(config => {
      this.room.build(config)

      if(transport)
        this.room.provider.setTransport(transport)
    })
    .catch(() => { throw new Error(`I cannot load config from ${baseUrl}`) })
    
  }

  run() {
    this.getConfig()
    .then(config => {
      this.room.open(config)
    })
    .catch(() => { throw new Error(`I cannot load config from ${baseUrl}`) })
  }

  async getConfig({ baseUrl = './' } = {}) {

    const config = await fetch(baseUrl + 'uee.config.json')
    
    return {
      ...config,
      env:  { baseUrl }
    }
  }

  setupLogging({ 
    logging = null,
    isShowErrors = true
  } = {}) {
    if(logging && isShowErrors) {
      this.room.provider.setLogging(payload => {
        this.showErrors(payload)
        logging(payload)
      })
    }
    else if(logging) {
      this.room.provider.setLogging(logging)
    }
    else if(isShowErrors) {
      this.room.provider.setLogging(payload => this.showErrors(payload))
    }
  }
  showErrors(payload) {
    if(errorEvent.isValid(payload.message))
      console.error(payload)
  }
}

export { UnitedEventsEnv }