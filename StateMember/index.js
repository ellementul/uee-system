const { Member } = require('@ellementul/uee-core')

class StateMember extends Member {
  constructor(states) {
    super()

    this.states = new Set(states)

    if(this.states.size < 1)
      throw new TypeError('You must have at least one beginning state for StateMember!')

    this.state = states[0]
  }

  validState(state) {
    return this.states.has(state)
  }

  invalidState(state) {
    throw new TypeError(`Got invalid state: ${state}! List valid states: ${[...this.states]}`)
  }

  isState(state) {
    if(!this.validState(state))
      this.invalidState(state)
      
    return this.state === state
  }

  setState(state) {
    if(!this.validState(state))
      this.invalidState(state)
      
    return this.state = state
  }

  onEventForState(event, callback, state, limit) {
    if(!this.validState(state))
      this.invalidState(state)

    const warpCallback = payload => {
      if(this.state === state) callback(payload)
    }
  
    this.onEvent(event, warpCallback, limit)
  }

}

module.exports = { StateMember }