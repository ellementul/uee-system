import { EventFactory, Types } from '@ellementul/uee-core'

const type = Types.Object.Def({
  access: "Public",
  system: "Cooperation",
  entity: "Room",
  uuid: Types.UUID.Def(),
  state: "Open",
  config: Types.Object.Def({}, true)
})

export default EventFactory(type)