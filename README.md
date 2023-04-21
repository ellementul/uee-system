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
const { EventFactory, Types } = require('@ellementul/uee-core')
const type = Types.Object.Def({
  system: "NameOfYourSystem",
  entity: "NameOfEntityWhichIsChanged",
  state: "DataOfChangedEntity"
}, true) 
module.exports = EventFactory(type)
```
If the second argument for Types.Object.Def method is "true", then extra properties in the Event don't count while getting the Event by the Member.
If the second argument for Types.Object.Def method is "false", any extra properties will change the Type of Event while getting the Event by the Member.

### Define Member
#### Inherit Member
You need to inherit your new Member from the abstract Member class from the UEE core.
```js
const { Member } = require('@ellementul/uee-core')
class YourMember extends Member {}
```

#### Define event handlers
You can define event handlers in any Member method.
But the easiest way to do this is in the constructor.
You can use one of the methods as event handler.
```js
const outsideEvent = require('./events/outside_event')
const yourEvent = require('./events/your_event')
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
module.exports = { 
  YourMember, // Export of your member
  events: { // Export of your events
    // outside: outsideEvent, // We don't export outside events!
    your: yourEvent
  }
}
```

#### All code of example
```js
const { Member } = require('@ellementul/uee-core')

const outsideEvent = require('./events/outside_event')
const yourEvent = require('./events/your_event')
class YourMember extends Member {
  constructor() {
    super()

    this.onEvent(outsideEvent, () => this.callback()) // Subscribing on event
    
    this.role = "DefaultMemberRole" // The manager needs it, and manager can change it
  }

  callback () {
    this.send(yourEvent, {
      state: "NewYourStateOfYourEntity" // Fill the state property in the event
      // If we don't fill the property, this property will be random.
    })
  }
}

module.exports = { 
  YourMember, // Export of your member
  events: { // Export of your events
    // outside: outsideEvent, // We don't export outside events!
    your: yourEvent
  }
}
```
### Define and run the Environment
#### Run server for the Transport
You can run the server for the Transport module locally
##### Start server
```js
const WSServer = require('@ellementul/uee-ws-server/WsServer')
const port = 8081
const server = new WSServer(port)
await server.start(false)
```
##### Stop server
```js
await server.close()
```

#### Define the Environment
##### Define Members List
You need to define the list of Roles and Members for them to create the Environment
```js
const { Ticker } = require('@ellementul/uee-timeticker')
const { YourMemberClass } = require('...')

const membersList = {
  roles: [
    { // Required, it will create time events
      role: "Ticker",
      memberConstructor: Ticker
    },
    {
      role: "YouMember", // Role for this Your Member,The Environment ca create some instances for one role
      memberConstructor: YourMemberClass // The Environment needs class to create a instance of the Member
    }
  ]
}
```
##### Create Environment
```js
const { WsTransport } = require('@ellementul/uee-ws-transport')
const { Provider } = require('@ellementul/uee-core')
const { Manager } = require('@ellementul/uee-manager')

const membersList = {...}
env = new UEE({
  Transport: WsTransport,  //If there is multiplayer
  Provider, // Manage Events
  Manager, // Manage instances of Members
  membersList
})
```

#### Run the Environment
##### If you run singleplayer
```js
env.run({ isHost: true })
```
##### If you run multiplayer
```js
// Start host
env.run({
  isHost: true,
  signalServerAddress: server.domain.url
})

// Start as client
env.run({signalServerAddress: server.domain.url})
```
