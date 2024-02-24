# United Events Environment

## Description
This is a system for building distributed environments.
The main components of the system are the Member and the Event. Members can create and get Events.

### Member and Events
#### Event
This message is for broadcasting.
The event is completely determined by the data type that contains it.

#### Member
This is a module that contains the data and the logic to process the data.
If Member wants to get the Event, it needs to subscribe to the Event. 
If Member wants to send the Event, it needs to fill in the data of the Event and send it.

#### Subscribing
The Member cans define an event with any type of data and subscribe to it.
If no event matches this type, the Member will never get an event call
If several events satisfy the conditions of the declared type, the Member will be subscribed to all these events as one.
In practice, you should first identify the Event through the data structure and then subscribe to it, or fill in the data and send it.

### Transport
This module is a communication of different machines in the network.

### Provider
This module manages to subscribe and to get events.
The provider sends and gets events through the Transport.

### Environment
Environment manages transport for Events transmission and creates Members for each of the defined roles.
The role of the Member is part of the functionality of the Environment that the Participant executes.

## Usage
### Define Event
The Event is defined via the Types and the EventFactory modules.
The Types allow to you define some structure of data for your event.
The EventFactory creates the Event from the Type of data.
```js
import { EventFactory, Types } from '@ellementul/united-events-environment'
const type = Types.Object.Def({
  system: "NameOfYourSystem",
  entity: "NameOfEntityWhichIsChanged",
  state: "DataOfChangedEntity"
}, true) 
export default = EventFactory(type)
```
If the second argument for Types.Object.Def method is "true", then extra properties in the Event don't count while getting the Event by the Member.
If the second argument for Types.Object.Def method is "false", any extra properties will change the Type of Event while getting the Event by the Member.

### Define Member
#### Inherit Member
You need to inherit your new Member from the abstract Member class from the UEE core.
```js
import { Member } from '@ellementul/united-events-environment'
class YourMember extends Member {}
```

#### Define event handlers
You can define event handlers in any Member method.
But the easiest way to do this is in the constructor.
You can use one of the methods as event handler.
```js
import outsideEvent from './events/outside_event'
import yourEvent = from './events/your_event')
...
  constructor() {
    super()

    this.onEvent(outsideEvent, () => this.callback()) // Subscribing on event
  }
  callback () {
    this.send(yourEvent, {
      state: "NewYourStateOfYourEntity" // Fill the state property in the event
      // If we don't fill the property, this property will be random.
    })
  }
```

#### Export
For export, return the object with the class itself and public events
```js
const exportedEvents = { // Export of your events
  // outside: outsideEvent, // We don't export outside events!
  your: yourEvent
}

export { 
  YourMember, // Export of your member
  events: exportedEvents
}
```

### Define and run the Environment
..............
