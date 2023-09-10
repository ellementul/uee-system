const { Member } = require('@ellementul/uee-core')
const { MockMember } = require('../FakeMember')

const { Room } = require('./index')
const buildEvent = require('./events/build-room')
const openEvent = require('./events/open-room')


describe('Testing Room', () => {
  test('Constructor Empty Room', () => {
    const room = new Room
    expect(room).toBeDefined()
  })

  test('Add Member and build', () => {
    const room = new Room

    const buildCallback = jest.fn()
    const testMember = MockMember(Member, [
      [buildEvent, buildCallback]
    ])

    room.addMember(testMember)
    room.build()
    expect(buildCallback).toHaveBeenCalled()
  })

  test('Open Room Without Transport', () => {
    const room = new Room

    const openCallback = jest.fn()
    const testMember = MockMember(Member, [
      [openEvent, openCallback]
    ])

    room.addMember(testMember)
    room.build()
    room.open()
    expect(openCallback).toHaveBeenCalled()
  })
})