We are trying to build a game (acquire )using mvc model. Right now we only have
one service (called game ),When server gets hit by a routes, the controllers
(right now functions) will delegate the work to game (class / service), it talks
to all the models. Now we need to handle merge scenarios. Our game class is
already full with alot of functionality (like placing a tile, building hotel).
for the merging we have the following plan :

1. make a class called merge :

- pass instance of merge, set it as context in hono app(using HONO for backend
  app)
- it will also be inside the game sevice.

2. While placing a tile, if merge condition meets, then it will do
   merge.init(gameSnapshot), basically injecting game data in merge instance.
3. Now we can use (by using app.get()) merge instance whenever another route
   related merge action is hit. We can just call the methods inside the merge
   class.

- it will be easy to maintain merge turns.

Question :

1. Is our theory right ?
2. Where are the loop holes, What is the best architecture to follow.

# Instructions :

- if you need more information ask before responding.
- Don't mind our file names.
- give response in md format.

- Below is the directory structure :

```
src
├── app.js
├── config.js
├── configs
│   └── hotels_data.js
├── handlers
│   ├── auth_handlers.js
│   ├── board_handler.js
│   ├── dev_controller.js
│   ├── game_handler.js
│   └── hotel_handler.js
├── models
│   ├── board.js
│   ├── deck.js
│   ├── game_manager.js
│   ├── game.js
│   ├── hotel.js
│   ├── hotels.js
│   ├── lobby.js
│   ├── player.js
│   ├── playerSession.js
│   └── tile.js
├── routes
│   ├── lobbyRouter.js
│   └── turnRouter.js
└── utils.js

5 directories, 21 files
```

# Controller.

- ## turnController

# mergeSevice.

- stakeholder.
- affected hotel
- bonus dist
