import test from 'ava'
import sinon from 'sinon'

import { Member } from '@ellementul/uee-core'
import { MockMember } from '../MockMember/index.js'

import { Room } from './index.js'
import buildEvent from './events/build-room.js'
import openEvent from './events/open-room.js'



test('Constructor Empty Room', t => {
  const room = new Room
  t.truthy(room)
})

test('Add Member and build', t => {
  const room = new Room

  const buildCallback = sinon.fake()
  const testMember = MockMember(Member, [
    [buildEvent, buildCallback]
  ])

  room.addMember(testMember)
  room.build({ test: true })

  t.true(buildCallback.calledOnceWith({
    ...buildEvent.create(),
    config: { test: true }
  }))
})

test('Open Room', t => {
  const room = new Room

  const openCallback = sinon.fake()
  const testMember = MockMember(Member, [
    [openEvent, openCallback]
  ])

  room.addMember(testMember)
  room.build()
  room.open({ test: true })
  t.true(openCallback.calledOnceWith({
    ...openEvent.create(),
    uuid: room.uuid,
    config: { test: true }
  }))
})