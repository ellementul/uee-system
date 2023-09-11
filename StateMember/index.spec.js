const { Provider, EventFactory, Types } = require('@ellementul/uee-core')
const { StateMember } = require('./index')


describe('Testing State', () => {
  test('Constructor', () => {
    const member = new StateMember(["Init"])
    expect(member).toBeDefined()
  })

  test('checking and setting valid state', () => {
    const member = new StateMember(["Begin", "End"])

    expect(member.isState("Begin")).toBe(true)
    expect(member.isState("End")).toBe(false)

    member.setState("End")

    expect(member.isState("Begin")).toBe(false)
    expect(member.isState("End")).toBe(true)
  })

  test('checking and setting invalid state', () => {
    const member = new StateMember(["Begin", "End"])

    expect(() => member.isState("Invalid")).toThrow("invalid state")
    expect(() => member.setState("Invalid")).toThrow("invalid state")
    expect(() => member.onEventForState(null, null, "Invalid")).toThrow("invalid state")

    expect(member.isState("Begin")).toBe(true)
  })

  test('Check state for event callback', () => {
    const provider = new Provider
    const member = new StateMember(["Begin", "End"])

    const event = EventFactory(Types.Index.Def(10))
    const callback = jest.fn()
    member.onEventForState(event, callback, "Begin")

    member.setProvider(provider)

    provider.sendEvent(event.create())
    expect(callback).toHaveBeenCalledTimes(1)

    member.setState("End")

    provider.sendEvent(event.create())
    expect(callback).toHaveBeenCalledTimes(1)
  })
})