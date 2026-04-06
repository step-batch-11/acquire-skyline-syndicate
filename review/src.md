## /

- handlers.js is unused (remove)
- bank_data.js, tile_data.js can be grouped into a sub directory (mock-data)
  bank_data.js --> bank.js tile_data.js --> tile.js

---

## app.js

- missing tests for createApp

### Naming

- lobby --> lobbyRouter
- turn --> turnRouter
- lobbyInstance --> lobby

### API

- commented code (remove)
- unusable api endpoints (remove)

---

## routes

- lobbyRouter.js, turnRouter.js should contain the router not the handlers. move
  handlers to their respective file

---

## routes/lobbyRouter.js

### Naming

- lobby --> lobbyRouter

### API

- /createGame (GET) --> should be POST because there is some operation
- inconsistent naming case for "/active-players" use camel case
- "await" is not needed for c.redirect inside createGame

---

## routes/turnRouter.js

- commented code
- inconsistent request handling
  - destructuring vs full object eg: ({tile}, cart)

### Naming

- turn --> turnRouter
- inconsistent naming case for "/buy-stock" use camel case

---

## handlers/auth_handlers.js

- empty file (remove)

---

## handlers/board_handler.js

- empty file (remove)

---

## handlers/hotel_handler.js

- empty file (remove)

---

## handlers/game_handler.js

### Naming

- align with other handlers (`c` instead of `context`)
- currentGameState --> gameState

---

## models/board.js

- isTileOnBoard(tileId) --> checking tileId is present with tile instances
- placedTileIds = this.#placedTiles.map((tile) => tile) (unnecessary mapping)
- find(...) used where some(...) is sufficient in adjacentTilesOfLastTile();
- lastTile is public while others are private (inconsistent encapsulation)
- mixing tile object and tileId across methods (standardize)
- add getter for placedTiles and latTile

---

## models/deck.js

---

## models/game.js

- `#isExpansion` → missing tileId dependency in signature

### Redundancy

- repeated access to board.lastTile.neighbourTiles() (extract)

### Consistency

- mixed return shapes in placeTile (valid vs invalid case)
- state strings ("BUILD_HOTEL", etc.) used as raw strings (extract constants)

### Design

- placeTile mixes:
  - validation
  - mutation
  - response building
- assignNewTile:
  - calls getPlacedTiles() without using result (remove)

---

## models/hotel.js

### Naming

- tileIncludes → rename to hasTile
- found → unclear, rename to startHotel

### Redundancy

- setOriginTile pushes tile and found also adds tiles (overlapping
  responsibility)

### Consistency

- tile vs tileId usage inconsistent across methods

---

## models/hotels.js

- missing getter for `#hotels`

### Naming

- isAnyInActiveHotel → confusing (double negative), rename to isAnyInactiveHotel

### Redundancy

- repeated Object.values(this.#hotels) (extract)

### Consistency

- hotelName.toLowerCase() used in multiple places (standardize at input level)

### Design

- expand:
  - finds hotel and mutates without null check (unsafe)

- calculateMoneyToDeduct:
  - mutates accumulator inside return

---

### Naming

- `#lobbyState` → ok
- `#threshold` → unclear, rename to minPlayers

### Redundancy

- constructor is empty (remove)

### Consistency

- players stored as string, later converted to Player objects (inconsistent
  type)

### Design

- createGame:
  - does too many things (tile creation, shuffle, object wiring)
- currentState mutates state while reading (side-effect in getter)

---
