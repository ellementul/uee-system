const { Provider: DefaultProvider } = require('@ellementul/uee-core')
const { Manager: DefaultManager } = require('@ellementul/uee-manager')

class UnitedEventsEnvironment {
  constructor({
    Transport,
    Provider=DefaultProvider,
    Manager=DefaultManager,
    membersList,
    logging
  }) {
    this._Transport = Transport
    this._provider = new Provider
    this._manager = new Manager(membersList)

    if(logging)
      this._provider.setLogging(logging)
  }

  setupTransport(signalServerAddress) {
    this._transport = new this._Transport(signalServerAddress)
    this._provider.setTransport(this._transport)
  }

  run({ isHost = false, signalServerAddress = null}) {
    if(!isHost && !signalServerAddress)
      throw new Error("You cannot run Env with isHost = false, signalServerAddress = null")

    if(signalServerAddress)
      this.setupTransport(signalServerAddress)

    this._manager.setProvider(this._provider)
    this._manager.start(!isHost)
  }

  reset() {
    this._manager.reset()
  }
}

module.exports = { UnitedEventsEnvironment }