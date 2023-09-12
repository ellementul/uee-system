const { EventFactory, Types } = require('@ellementul/uee-core')

const type = Types.Object.Def({
  access: "Public",
  system: "Cooperation",
  entity: "Room",
  uuid: Types.UUID.Def(),
  state: "Open",
  config: Types.Object.Def({}, true)
})

module.exports = EventFactory(type)