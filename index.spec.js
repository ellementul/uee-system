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

// describe('Integration fo two envs', () => {
//   const port = 8082
//   const server = new WSServer(port)
  
//   beforeAll(async () => {
//     await server.start(false)
//   });

//   test('Running Two Env', done => {
//     let env
//     let envTwo

//     const readyCallback = jest.fn(() => {
//       env.reset()
//       envTwo.reset()
//       done()
//     })

//     const spyingEvents = [
//       [readyEvent, readyCallback]
//     ]

//     const membersList = {
//       roles: [
//         {
//           role: "Ticker",
//           memberConstructor: Ticker
//         },
//         {
//           role: "Member",
//           memberConstructor: Member
//         }
//       ]
//     }

//     env = new UEE({
//       Transport: WsTransport,
//       Manager: MockMember(Manager, spyingEvents),
//       membersList,
//       signalServerAddress: server.domain.url,
//       logging: payload => {
//         if(payload.message.entity == "membersList")
//           console.log(payload)
//       }
//     })
//     envTwo = new UEE({
//       Transport: WsTransport,
//       membersList,
//       signalServerAddress: server.domain.url
//     })

//     readyCallback()
//     env.run()
//     // envTwo.run({signalServerAddress: server.domain.url})
//   });

//   afterAll(async () => {
//     await server.close()
//   });
// });

describe('Logging Events', () => {
  test('Logging', done => {
    let env
    const membersList = {
      roles: [ Member ]
    }

    const logCallback = jest.fn(({ message: { system, entity } }) => {
      expect(system).toBeDefined()
      expect(entity).toBeDefined()

      if(system == 'Cooperation'
        && entity == 'AllMembers'
      ) {
        env.reset()
        done()
      }
    })
    env = new UEE({
      membersList,
      logging: logCallback
    })
    env.run()
  });

  // test('Erros', done => {
  //   let env
  //   const error_name = 'Testing Error'
  //   const membersList = {
  //     roles: [
  //       {
  //         role: "Member",
  //         memberConstructor: class ErrorMember {
  //           constructor () {
  //             throw new Error(error_name)
  //           }
  //         }
  //       }
  //     ]
  //   }

  //   console.error = jest.fn(({ message: { system, entity } }) => {
  //     expect(system).toBe('Logging')
  //     expect(entity).toBe('Error')

  //     env.reset()
  //     done()
  //   })
  //   env = new UEE({
  //     membersList,
  //     isShowErrors: true
  //   })
  //   env.run({
  //     isHost: true
  //   })
  // });
});