import test from 'ava'

import { 
  Types,
  EventFactory,
  Member,
  MockMember,
  StateMember,
  Room,
  UnitedEventsEnv,
  events
} from './index.js'

test('Testing export main classes', t => {
  t.truthy(Types)
  t.truthy(EventFactory)
  t.truthy(Member)
  t.truthy(MockMember)
  t.truthy(StateMember)
  t.truthy(Room)
  t.truthy(UnitedEventsEnv)
})

test('Testing export events', t => {
  t.truthy(events.logEvent)
  t.truthy(events.timeEvent)
  t.truthy(events.changeEvent)
})

