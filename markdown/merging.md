# Goal :

1. When the tile is placed between two adjacent hotel chain merge the smaller
   one into larger one.

# tasks.

- [ ] get dev mode.
- [ ] Wire things up for routes.
- [ ] backend should control whether to merge or not.
- [ ] Identify merge scenario.
- [ ] Identify hotels that are involved in merge.
- [ ] remove tiles from hotels that is smaller and add it to larger hotel.
- [ ] distribute bonus according to the rules.
- [ ] Primary
- [ ] Secondary
- [ ] go through all the player and remove the stock of merged hotel from there
- [ ] Ask them what do they want.
- [ ] system give them money in return
- [ ] send the response to frontend with state. - [ ] according to the state
      ~~backend~~ frontend will display merge.

# Bonus Distribution scenario

[ ] One primary and one secondary shareholders [ ] Multiple primary shareholders
[ ] Multiple secondary shareholders [ ] Primary and secondary shareholder is
same

# merge two equal :

- [ ] find a way to merge hotels algorithmically. - [ ] sort the adjacent hotels
      based on hotel tiles. - [ ] start merging from smaller to larger. - [ ] if
      the current and next are the same length. - merge choose state. - regular
      flow. - [ ] if the current and next are not same length. - merge unequal -
      regular flow. Note : You might have do structure clone of the thing.

- [ ] if adjacent hotel is more than 1 then - [ ] mergeService will detect the
      scenario. - [ ] according to the scenario it will change the state.

- We can store the merge states inside the #mergeService.
- with each upcoming request the merge service will do the job of handling.
- We need to find a way to send the merge state with the merge service aswell. -
  make a getter for merge service. (return currentMergeState)

# Question :

1. How will change the merging state to the build hotel.
   - system merge system should tract it internally and change the state.
