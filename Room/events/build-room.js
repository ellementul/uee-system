const { EventFactory, Types } = require('@ellementul/uee-core')

const type = Types.Object.Def({
  access: "Local",
  system: "Cooperation",
  entity: "Room",
  state: "Builded"
})

module.exports = EventFactory(type)