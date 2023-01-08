class UnitedEventsEnvironment {
  constructor({
    Transport,
    Provider,
    Manager,
    membresList,
    signalServerAdderss,
    logging
  }) {
    this._transport = new Transport(signalServerAdderss)
    this._provider = new Provider
    this._manager = new Manager(membresList)

    if(logging)
      this._provider.setLogging(logging)

    this._provider.setTransport(this._transport)
    this._manager.setProvider(this._provider)
  }
  run() {
    this._manager.start()
  }
  reset() {
    this._manager.reset()
  }
}

module.exports = { UnitedEventsEnvironment }