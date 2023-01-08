const { EventFactory, Types } = require('../../../UEE/src/Event')

const type = Types.Object.Def({
  system: "Cooperation",
  entity: "Member",
  state: "Connected",
  role: "Player",
  uuid: Types.UUID.Def()
})

module.exports = EventFactory(type)