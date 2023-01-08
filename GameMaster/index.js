const { Member } = require('@ellementul/uee')

class Player extends Member {
  constructor () {
    super()

    this.onEvent(displayEvent, payload => this.display(payload))
  }

  connectPlayer () {
    
  }
}