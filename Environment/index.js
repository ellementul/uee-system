const { Provider: DefaultProvider, events: { error: errorLogEvent } } = require('@ellementul/uee-core')
const { Manager: DefaultManager } = require('@ellementul/simple-uee-manager')
const { Ticker } = require('@ellementul/uee-timeticker')

class UnitedEventsEnvironment {
  constructor({
    logging,
    isShowErrors
  }) {
    
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