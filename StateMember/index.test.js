import test from 'ava'
import sinon from 'sinon'

import { Provider, EventFactory, Types, events } from '@ellementul/uee-core'
import { StateMember } from './index.js'

const { changeEvent } = events

test('Constructor', t => {
  const member = new StateMember(["Init"])
  t.truthy(member)
})

test('Constructor with invalid state', t => {
  t.throws(() => new StateMember(["Init State"]), { message: /Invalid type state/ })
})

  test('checking and setting valid state', t => {
    const member = new StateMember(["Begin", "End"])

    t.true(member.isState("Begin"))
    t.false(member.isState("End"))

    member.setState("End")

    t.false(member.isState("Begin"))
    t.true(member.isState("End"))
  })

test('checking and setting invalid state', t => {
  const member = new StateMember(["Begin", "End"])

  t.throws(() => member.isState("Invalid"), { message: /invalid state/ })
  t.throws(() => member.setState("Invalid"), { message: /invalid state/ })
  t.throws(() => member.onEventForState(null, null, "Invalid"), { message: /invalid state/ })

  t.true(member.isState("Begin"))
})

test('Check event about chanage state', t => {
  const provider = new Provider
  const member = new StateMember(["Begin", "End"])

  const callback = sinon.fake()
  provider.onEvent(changeEvent, callback)

  member.setProvider(provider)
  t.true(callback.calledOnce)

  member.setState("End")
  t.true(callback.calledTwice)
})

test('Check state for event callback', t => {
  const provider = new Provider
  const member = new StateMember(["Begin", "End"])

  const event = EventFactory(Types.Index.Def(10))
  const callback = sinon.fake()
  member.onEventForState(event, callback, "Begin")

  member.setProvider(provider)

  provider.sendEvent(event.create())
  t.true(callback.calledOnce)

  member.setState("End")

  provider.sendEvent(event.create())
  t.true(callback.calledOnce)
})