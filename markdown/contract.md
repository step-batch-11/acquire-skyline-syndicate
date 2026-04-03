## Table of content

- [/login](#login)

- /lobby
    - [/create](#lobbycreate)
    - [/join](#lobbyjoin) 
    - [/startGame](#lobbystartgame)

- [/currentGameState](#currentgamestate)

- /turn 
    - [/placeTile](#turnplacetile)
    - [/buildHotel](#turnbuildhotel)
    - [/buyStock](#turnbuystocks)
    - [/assignTileToPlayer](#turnassigntiletoplayer)
    - [/merge]

/shiftTurn

/winner

- static files
  - GET - /login
  - GET - /home --> manages room creation, joining room
  - GET - /hostLobby
  - GET - /joineeLobby
  - GET - /game

---

Note: for each request users, rooms are computed based on sessionId

### /login

```
This endpoint will be triggered when the user comes to the page and enters his name

method: POST

request-body: username

action: sets up cookie, maps user with the sessionId

response:
  redirect to /home
```

### /lobby/create

```
This endpoint will be triggered when host creates a room

method: POST

request-body: hostName
headers: cookie(sessionId)

action: sets up the room, initializes players' list, adds host to the list, adds players(class)' to the room,

response: roomId
```

### /lobby/join

```
This endpoint will be triggered when a player joins the room

method: POST

request-body: roomId
headers: cookie(sessionId)

action: assign player to the room, adds player to the players' list, 

response: /lobby
```

### /lobby/startGame

```
This endpoint will be triggered when the host starts the game

method: POST

request-body: roomId
headers: cookie(sessionId)

action: sets up the initial board, and initializes players' hands, hotels, deck, sets player order

response:
```

### /currentGameState

```
method: GET

headers: cookie(sessionId)

action: fetches the current board state, player hand based on sessionId, current hotels, players' order

response: provides the current board state, current player, player hand based on sessionId, current hotels, players' order

```

### /turn/placeTile

```
This endpoint will be triggered when turn is going on and user places a tile

method: POST

request-body: tile
headers: coookie(sessionId)

action: adds a tile to the placed tiles, and removes from the current player hand, if possible it will expand (adds the tile to hotel chain)

response: action for the placing tile (building, merging, free tile)
```

### /turn/buildHotel

```
This endpoint will be triggered when turn is going on and user builds a hotel

method: POST

request-body: hotelName
headers: coookie(sessionId)

action: changes the hotel state as active in market, adds tiles to the hotel, updates currrent stock price

response:
```

### /turn/buyStocks

```
This endpoint will be triggered when user builds a hotel and opts to buy stocks

method: POST

request-body: hotels, stock count
headers: coookie(sessionId)

action: adds stocks of particular hotel to the player's hand, deducts money from the player, deducts stocks from the hotel

response: gives updated player's hand back

```

### /turn/assignTileToPlayer

```
This endpoint will be triggered after user buys stocks

method: POST

headers: coookie(sessionId)

action: assigns a random tile to the current player

respnse: gives updated player's hand back

```

### /shiftTurn

```
This endpoint is triggered when the player ends the turn 

method: POST

headers: coookie(sessionId)

action: shifts the turn from current player to next player

response: gives back the current player