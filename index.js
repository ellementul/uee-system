export { MockMember } from './MockMember/index.js'
export { StateMember } from './StateMember/index.js'
export { Room } from './Room/index.js'
export { UnitedEventsEnv } from './Environment/index.js'

import { Types, EventFactory, Member, events as coreEvents } from '@ellementul/uee-core'
import { events as tickerEvents } from '@ellementul/uee-timeticker'
import { events as roomEvents } from './Room/index.js'

const events = {
  ...coreEvents,
  ...tickerEvents,
  ...roomEvents
}

export { Types, EventFactory, Member, events }