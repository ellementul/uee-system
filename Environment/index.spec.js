const { Member, EventFactory, Types } = require('@ellementul/uee-core')
const { MockMember } = require('../FakeMember')

const { Room } = require('../Room')

const { UnitedEventsEnv } = require('./index')
const buildEvent = require('../Room/events/build-room')
const openEvent = require('../Room/events/open-room')


describe('Testing Constructor and Config', () => {
  test('Constructor Env', () => {
    const env = new UnitedEventsEnv(new Room)
    expect(env).toBeDefined()
  })

  test('Build and Run', () => {
    const env = new UnitedEventsEnv(new Room)

    const buildCallback = jest.fn()
    env.room.provider.onEvent(buildEvent, buildCallback)
    env.build({ url: "localhost", onRecieve: jest.fn(), send: jest.fn() })
    expect(buildCallback).toHaveBeenCalledWith({
      ...buildEvent.create(),
      config: {
        test: "config", 
        env: {
          nodejsApi: true,
          browserApi: false,
          baseUrl: "localhost"
        }
      }
    })
    
    const openCallback = jest.fn()
    env.room.provider.onEvent(openEvent, openCallback)

    env.run()
    expect(openCallback).toHaveBeenCalled()
  })

  test('Get config', () => {
    const env = new UnitedEventsEnv(new Room)
    expect(env.getConfig()).toEqual({
      test: "config", 
      env: {
        nodejsApi: true,
        browserApi: false
      }
    })
  })

  test('Get config without config file', () => {
    const env = new UnitedEventsEnv(new Room)
    expect(env.getConfig()).toEqual({
      test: "config", 
      env: {
        nodejsApi: true,
        browserApi: false
      }
    })
  })

  test('Get config with Env vars', () => {
    const env = new UnitedEventsEnv(new Room)
    expect(env.getConfig({ env: ["NODE_ENV"] })).toEqual({
      test: "config",
      env: {
        NODE_ENV: "test",
        nodejsApi: true,
        browserApi: false,
      }
    })
  })
})

describe('Integration test', () => {
  const testEvent = EventFactory(Types.Object.Def({ test: "Integration" }))
  class TestMember extends Member {
    constructor() {
      super()

      this.onEvent(openEvent, () => this.run())
    }

    run() {
      this.send(testEvent)
    }
  }

  test('Two members in one Env', () => {
    const room = new Room
    room.addMember(TestMember)
    const callback = jest.fn() 
    room.addMember(MockMember(Member, [
      [testEvent, callback]
    ]))
    

    const env = new UnitedEventsEnv(room)

    env.build()
    env.run()

    expect(callback).toHaveBeenCalled()
  })
})