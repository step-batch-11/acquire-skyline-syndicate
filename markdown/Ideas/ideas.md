# ideas :

- [ ] in future send the data in this format :

```js
{"gameState" : game.currentState(), message }
```

- [ ] make sure that the placed tiles looks like it is wedged on the board.
  - add box shadows.
- [ ] take the board to center
- [ ] can we make the board color more buisness like ?

## DEV MODe :

- [ ]
- [ ] Create a function called inject data, pass it to game manager.
  - use gameManager.inject() for injection.

# code smell :

- same name for frontend and backend files.
- bad test cases, mocking half data.

# Problem with dev mode :

1. sessionId is changing everytime you login again.
2. So when you load the data, there is no way for the currentGame to understand
   which player to choose

# fix :

1. save sessions id aswell, When you load the game just put those sessions in
   the browser cookie.
2. Decide the behaviour of sessionId generator.

- So you can assign the sessions that to the state.json file.
