import { EventFactory, Types } from '@ellementul/uee-core'

const type = Types.Object.Def({
  access: "Local",
  system: "Cooperation",
  entity: "Room",
  state: "Builded",
  config: Types.Object.Def({}, true)
})

export default EventFactory(type)