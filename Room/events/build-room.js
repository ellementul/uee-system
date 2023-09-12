const { EventFactory, Types } = require('@ellementul/uee-core')

const type = Types.Object.Def({
  access: "Local",
  system: "Cooperation",
  entity: "Room",
  state: "Builded",
  config: Types.Object.Def({}, true)
})

module.exports = EventFactory(type)