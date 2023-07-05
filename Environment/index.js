const { Provider: DefaultProvider, events: { error: errorLogEvent } } = require('@ellementul/uee-core')
const { Manager: DefaultManager } = require('@ellementul/simple-uee-manager')
const { Ticker } = require('@ellementul/uee-timeticker')

class UnitedEventsEnvironment {
  constructor({
    Transport,
    Provider=DefaultProvider,
    Manager=DefaultManager,
    membersList,
    logging,
    isShowErrors
  }) {
    this._Transport = Transport
    this._provider = new Provider
    this._manager = new Manager(membersList)

    if(logging || isShowErrors)
      this.setupLogging(logging, isShowErrors)
  }

  setupTransport(signalServerAddress) {
    this._transport = new this._Transport(signalServerAddress)
    this._provider.setTransport(this._transport)
  }

  run({ isHost = false, signalServerAddress = null} = {}) {

    if(signalServerAddress)
      this.setupTransport(signalServerAddress)

    if(!signalServerAddress || isHost) {
      this._tiсker = new Ticker
      this._tiсker.setProvider(this._provider)
      this._tiсker.start({ delta: 24 })
    }

    this._manager.setProvider(this._provider)
    this._manager.start()
  }

  reset() {
    if(this._tiсker)
      this._tiсker.reset()

    this._manager.reset()
  }

  setupLogging(logging, isShowErrors) {
    if(logging && isShowErrors) {
      this._provider.setLogging(payload => {
        this.showErrors(payload)
        logging(payload)
      })
    }
    else if(logging) {
      this._provider.setLogging(logging)
    }
    else if(isShowErrors) {
      this._provider.setLogging(payload => this.showErrors(payload))
    }
  }
  showErrors(payload) {
    if(errorLogEvent.isValid(payload.message))
      console.error(payload)
  }
}

module.exports = { UnitedEventsEnvironment }