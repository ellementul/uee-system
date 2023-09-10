const WSServer = require('@ellementul/uee-ws-server/WsServer')
const { WsTransport } = require('@ellementul/uee-ws-transport')
const { Provider, Member } = require('@ellementul/uee-core')
const { 
  Manager, 
  events: { readyMembers: readyEvent }
} = require('@ellementul/simple-uee-manager')
const { UnitedEventsEnvironment: UEE } = require('./Environment')
const { MockMember } = require('./FakeMember')

describe('System Testing', () => {
  const port = 8081
  const server = new WSServer(port)
  
  beforeAll(async () => {
    await server.start(false)
  });

  test('Constructor Env', () => {
    const membersList = {
      roles: [
        {
          role: "TestRole",
          memberConstructor: Member
        }
      ]
    }

    const env = new UEE({
      Transport: WsTransport,
      Provider,
      Manager,
      membersList
    })
    expect(env).toBeDefined()
  });

  test('Simple Constructor Env', () => {
    const membersList = {
      roles: [
        {
          role: "TestRole",
          memberConstructor: Member
        }
      ]
    }

    const env = new UEE({
      membersList
    })
    expect(env).toBeDefined()
  });

  test('Running Env', done => {
    let env 
    const readyCallback = jest.fn(() => {
      env.reset()
      done()
    })
    const spyingEvents = [
      [readyEvent, readyCallback]
    ]
    const membersList = {
      roles: [
        {
          role: "Member",
          memberConstructor: MockMember(Member, spyingEvents)
        }
      ]
    }

    env = new UEE({
      Transport: WsTransport,
      Provider,
      Manager,
      membersList
    })
    env.run({
      isHost: true,
      signalServerAddress: server.domain.url
    })
  });

  test('Running Env without Transport', done => {
    let env 
    const readyCallback = jest.fn(() => {
      env.reset()
      done()
    })
    const spyingEvents = [
      [readyEvent, readyCallback]
    ]
    const membersList = {
      roles: [
        {
          role: "Member",
          memberConstructor: MockMember(Member, spyingEvents)
        }
      ]
    }

    env = new UEE({ membersList })
    env.run()
  });

  afterAll(async () => {
    await server.close()
  });
});