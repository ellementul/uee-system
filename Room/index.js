const { Provider } = require('@ellementul/uee-core')
const buildEvent = require('./events/build-room')
const openEvent = require('./events/open-room')

const INIT = Symbol()
const BUILDED = Symbol()
const OPENED = Symbol()

class Room {
  constructor({ provider } = {}) {
    this.provider = provider || new Provider

    this.members = new Map
    this.state = INIT
  }

  addMember(MemberConstructor) {
    if(this.state !== INIT)
      throw new Error("The room is builded already! You cannot add new members now.")

    const member = new MemberConstructor
    this.members.set(member.uuid, member)
  }

  build() {
    if(this.state === BUILDED)
      throw new Error("The room is builded already!")
    else
      this.state = BUILDED

    for (const [_, member] of this.members) {
      member.setProvider(this.provider)
    }
    this.provider.sendEvent(buildEvent.create())
  }

  open(transport = null) {
    if(this.state !== BUILDED)
      throw new Error("The room isn't builded yet! Run 'build' method on room.")

    if(this.state === OPENED)
      console.warn("Repeat opening room!")

    if(transport)
      this.provider.setTransport(transport)

    this.provider.sendEvent(openEvent.create())
  }
}

module.exports = { Room }