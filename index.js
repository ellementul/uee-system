module.exports = {
  ...require('./Environment'),
  ...require('./Environment/nodejs'),
  ...require('./Room'),
  ...require('./StateMember'),
  ...require('./FakeMember'),
  ...require('@ellementul/uee-core'),
  ...require('@ellementul/uee-ws-transport'),
  events: {
    ...require('@ellementul/uee-core').events,
    ...require('@ellementul/uee-timeticker').events,
    ...require('./Room').events
  }
}