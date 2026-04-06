# Join Game

## index.html

- 1st player joins the site
  - Ask player name
    - Set session-id cookie
  - use route lobby/create
  - polling
  - redirect to waiting room for 2nd player

- 2nd player joins the site
  - Ask player name
    - Set session-id cookie
  - polling

- Both players joined
  - Show both timer for 3 second
  - Start the game.
    - send to game.html

- Game start
  - Show both names on the left side.

# Acceptance Criteria

- [ ] Given: I am a player When: I open the site. Then: I should be promted to
      enter my username.

- [ ] Given : I have entered my username When : I join the game then : I should
      wait for other person join.

- [ ] Given : One player has already join the game When : when another player
      join the game then : both player should be redirected to the game.

- [ ] Given: two players have joined. When: the game starts. Then: display the
      players in setup

# PLAN

## stage 1 (2 client - 2 players) (no state management)

- 1 client goes to index.html of site.
- Enters name
- Show waiting for 2nd player

- There itself ask name for 2nd player.
- When entered
- show 3 sec timer
