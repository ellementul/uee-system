const { EventFactory, Types } = require('@ellementul/uee')
const type = Types.Object.Def({
  system: "UI",
  entity: "Display",
  action: "Show"
}, true)
module.exports = EventFactory(type)