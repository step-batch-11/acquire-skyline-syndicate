## login

Given I want to play the game when I open the game Then I should see the login
page.

Given I am in login page When I enter my name. Then I should see the login
button to login into the game.

Given I am in login page When I don't enter my name and click on login button.
Then It should not allow me to login and should tell me to enter the valid name.

Given I am logged in player When I am entering to main menu Then My name should
be stored and I should be identified uniquely.

Given I am in login page When I click on the login button Then I should see the
main menu with host and join buttons

Given the game is launched When the application loads Then the login page should
be displayed.

Given the user is on the login page When the user enters the name Then i can
click on login button to login.

Given the user is on the login page When the user clicks the login button
without entering a name Then the system should prevent login And display an
error message indicating that a name is required.

Given the user has entered a valid name When the user clicks the login button
Then the user should be navigated to the main menu And the main menu should
display "Host" and "Join" options.

Given the user has successfully logged in When the user is on the main menu page
Then the user's username should be displayed.

Given the user is not logged in When the user attempts to access a protected
page Then the user should be redirected to the login page.

## Notifications

Given I am the current player when i try to buy stocks without having sufficient
funds Then I should be notified that i cannot buy the stocks.

Given I am the current player When my turn starts Then If any of my dead tiles
exchanged i should be notified.

Given I am inactive player When Current player buys stocks Then i should
notified about the stocks bought by current player

Given I am player When merge happens Then i should be notified about the primary
bonus holder and secondary bonus holder

Given I am a player When a stockholder of dissolved hotel sells or exchanges
Then I should be notified about the stocks sold/exchange

## Dead tiles exchange

Given I am the current player When my turn starts Then all my dead tiles should
exchanged with new tiles

Given I am the current player When if the deck does not have number of tiles i
need to exchange Then the tiles should be removed from the hand

## Bug card for player blockage

🐛 unable to buy stocks when i do not have any tile to place

✅ Steps to Reproduce

- Go to scenario where player does not have any tile in his hand

🤔 Expected Behavior

player should be able to : buy stocks if they do not have any tile to place

😵 Actual Behavior

The player is stuck when they do not have any tile to place.

## Bug for buying stocks without sufficient funds

🐛 unable to know whether i have sufficient funds to buy stocks and unable to
pass the turn

✅ Steps to Reproduce

- Try to buy stocks when you have in sufficient funds

🤔 Expected Behavior

player should be able to : Know that they have insufficient funds and be able to
pass the turn

😵 Actual Behavior

The player is stuck in buy stocks phase and unable to pass the turn to next
player

## Bug for highlighting tile which gives build hotel case when hotels are not available in the market.

🐛 Able to place the tile which gives build hotel case when hotels are not
available in market

✅ Steps to Reproduce

- Try to place the tile beside to a free tile when hotels are not available in
  the market.

🤔 Expected Behavior

Player should not be able to: See the tiles on the board as highlighted once
which gives build case when hotels are not available

😵 Actual Behavior

Player can see that tile as highlighted one and they are able to place.
