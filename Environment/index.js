const { events: { error: errorLogEvent } } = require('@ellementul/uee-core')

const isBrowser = new Function("try {return this===window;}catch(e){ return false;}")
const isNode = new Function("try {return this===global;}catch(e){return false;}")

const appRoot = isNode() ? require('app-root-path') : '.'
const config = require(appRoot + '/uee.config.json')

class UnitedEventsEnv {
  constructor(room) {
    if(typeof room !== "object") throw new TypeError("Constructor waits for object of class Room!")

    this.room = room
  }

  build(transport, env = []) {
    const baseUrl = transport ? transport.url : null
    this.room.build(this.getConfig({ baseUrl, env }))

    if(transport)
      this.room.provider.setTransport(transport)
  }

  run() {
    this.room.open(this.getConfig())
  }

  getConfig({ env, baseUrl } = {}) {
    const envValues = {
      nodejsApi: isNode(),
      browserApi: isBrowser(),
      baseUrl
    }

    if(isNode() && env)
      for (const envVar of env) {
        envValues[envVar] = process.env[envVar]
      }
    
    return {
      ...config,
      env: envValues
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
    if(errorLogEvent.isValid(payload.message))
      console.error(payload)
  }
}

module.exports = { UnitedEventsEnv }