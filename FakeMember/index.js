function MockMember(Member, spyingEvents) {
  return class FakeMember extends Member {
    constructor() {
      super(...arguments)

      this.role = super.role || Member.name

      spyingEvents.forEach(event => {
        this.onEvent(event[0], event[1])
      })
    }
  }
}

module.exports = { MockMember }