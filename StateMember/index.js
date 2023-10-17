import { Types, Member, events } from '@ellementul/uee-core'

const { changeEvent } = events
const stateType = Types.Key.Def()

class StateMember extends Member {
  constructor(states) {
    super()

    this.states = new Set

    for (const state of states) {
      const validError = stateType.test(state)
      if(validError)
        throw new TypeError(`Invalid type state! TypeError: ${JSON.stringify(validError, null, 2)}`)
      
      this.states.add(state)
    }

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
      
    
    this.state = state
    this.send(changeEvent, { state })
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

StateMember.events = events

export { StateMember, events }