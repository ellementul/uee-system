const WSServer = require('@ellementul/uee-ws-server/WsServer')
const { WsTransport } = require('@ellementul/uee-ws-transport')
const { Provider, Member, events: { connect } } = require('@ellementul/uee-core')
const { 
  Manager, 
  events: { readyMembers: readyEvent }
} = require('@ellementul/uee-manager')
const { Ticker } = require('@ellementul/uee-timeticker')
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
    const connectCallback = jest.fn(({ role, state, uuid }) => {
      if(role == "Member" && state == 'Connected'){
        env.reset()
        done()
      }
    })
    const spyingEvents = [
      [connect, connectCallback]
    ]
    const membersList = {
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
      membersList
    })
    env.run({
      isHost: true,
      signalServerAddress: server.domain.url
    })
  });

  test('Running Env without Transport', done => {
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
    const membersList = {
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
      Provider,
      Manager,
      membersList
    })
    env.run({
      isHost: true
    })
  });

  afterAll(async () => {
    await server.close()
  });
});

describe('Integration fo two envs', () => {
  const port = 8082
  const server = new WSServer(port)
  
  beforeAll(async () => {
    await server.start(false)
  });

  test('Running Two Env', done => {
    let env 

    const readyCallback = jest.fn(() => {
      env.reset()
      envTwo.reset()
      done()
    })
    const spyingEvents = [
      [readyEvent, readyCallback]
    ]

    const membersList = {
      roles: [
        {
          role: "Ticker",
          memberConstructor: Ticker
        },
        {
          role: "Member",
          memberConstructor: Member
        }
      ]
    }

    env = new UEE({
      Transport: WsTransport,
      Manager: MockMember(Manager, spyingEvents),
      membersList,
      signalServerAddress: server.domain.url,
      logging: payload => {
        if(payload.message.entity == "membersList")
          console.log(payload)
      }
    })
    envTwo = new UEE({
      Transport: WsTransport,
      membersList,
      signalServerAddress: server.domain.url
    })
    env.run({
      isHost: true,
      signalServerAddress: server.domain.url
    })
    envTwo.run({signalServerAddress: server.domain.url})
  });

  afterAll(async () => {
    await server.close()
  });
});

describe('Logging Events', () => {
  test('Logging', done => {
    let env
    const membersList = {
      roles: [
        {
          role: "Ticker",
          memberConstructor: Ticker
        }
      ]
    }

    const logCallback = jest.fn(({ message: { system, entity } }) => {
      expect(system).toBeDefined()
      expect(entity).toBeDefined()

      if(system == 'Cooperation'
        && entity == 'MembersList'
      ) {
        env.reset()
        done()
      }
    })
    env = new UEE({
      membersList,
      logging: logCallback
    })
    env.run({
      isHost: true
    })
  });
});