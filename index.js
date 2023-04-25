module.exports = {
  ...require('./Environment'),
  ...require('./FakeMember'),
  ...require('@ellementul/uee-core'),
  ...require('@ellementul/uee-ws-transport'),
  events: {
    ...require('@ellementul/uee-core').events,
    ...require('@ellementul/uee-timeticker').events,
    ...require('@ellementul/uee-manager').events
  }
}