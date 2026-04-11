# Stock dissolution.

- [ ] change the state according to the merge scenario
- [ ] mock data in front end.
- [ ] render ui for stock dissolution
- [ ] then figure out how will you do turn system

# Ideas :

- send the state called merge from back and if the system detect merge it will
  call the merge funtion,
- detect the merge
- according to merge determine the state : ["CHOOSE_HOTEL", "DISSOLVE_STOCK"]
- maintain the current merge player order inside the merge_service,
- after each dissolving just change the value of current player to player who is
  currently merging.

# first :

- [ ] create a function for selling stocks.

# checks :

- if the current player is not the current player then don't allow the request

# flow :

1. merge got initiated.

- we calculated the defunct hotel stakeholders.

- currentDissolver becomes : the first stake holder.
