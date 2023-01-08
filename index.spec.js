const WSServer = require('@ellementul/uee-ws-server/WsServer')
const { WsTransport } = require('@ellementul/uee-ws-transport')
const { Provider, Member, events: { connect } } = require('@ellementul/uee')
const { Manager } = require('@ellementul/uee-manager')
const { Ticker } = require('@ellementul/ueetimeticker')
const { UnitedEventsEnvironment: UEE } = require('./Environment')
const { MockMember } = require('./FakeMember')

describe('System Testing', () => {
  const port = 8081
  const server = new WSServer(port)
  
  beforeAll(async () => {
    await server.start(false)
  });

  test('Constructor Env', () => {
    const membresList = {
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
      membresList,
      signalServerAdderss: server.domain.url
    })
    expect(env).toBeDefined()
  });

  test('Logging', done => {
    const membresList = {
      roles: [
        {
          role: "TestRole",
          memberConstructor: Member
        }
      ]
    }

    const logCallback = jest.fn(data => {
      expect(data).toBeDefined()
      done()
    })
    new UEE({
      Transport: WsTransport,
      Provider,
      Manager,
      membresList,
      signalServerAdderss: server.domain.url,
      logging: logCallback
    })
  });

  test('Running Env', done => {
    let env 
    const connectCallback = jest.fn(({ role, state, uuid }) => {
      if(role == "Member" && state == 'Connected'){
        env.reset()
        done()
      }
    })
    const spyingEvents = [
      [connect, connectCallback]
    ]
    const membresList = {
      roles: [
        {
          role: "Ticker",
          memberConstructor: Ticker
        },
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
      membresList,
      signalServerAdderss: server.domain.url
    })
    env.run()
  });

  afterAll(async () => {
    await server.close()
  });
});