class UnitedEventsEnvironment {
  constructor({
    Transport,
    Provider,
    Manager,
    membersList,
    signalServerAddress,
    logging
  }) {
    this._transport = new Transport(signalServerAddress)
    this._provider = new Provider
    this._manager = new Manager(membersList)

    if(logging)
      this._provider.setLogging(logging)
  }
  run(isHost = false) {
    this._provider.setTransport(this._transport)
    this._manager.setProvider(this._provider)
    this._manager.start(!isHost)
  }
  reset() {
    this._manager.reset()
  }
}

module.exports = { UnitedEventsEnvironment }