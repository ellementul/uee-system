const { Member } = require('@ellementul/uee')
const displayEvent = require('./events/display_event')

class Player extends Member {
  constructor () {
    super()

    this.onEvent(displayEvent, payload => this.display(payload))
  }

  display ({ message }) {
    console.log(message)
  }

  ask ({ message }) {

  }
}