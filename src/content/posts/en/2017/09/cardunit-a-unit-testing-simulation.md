---
title: "CardUnit: A Unit Testing Simulation"
titleNeedsReview: true
slug: cardunit-a-unit-testing-simulation
permalink: /2017/09/cardunit-a-unit-testing-simulation/
lang: en
description: >-
  It can be difficult for developers to find the motivation or support to write automated unit
  tests. This simulation aims to demonstrate the value of automated unit tests to identify and
  localize defects. In the simulation, participants will play the roles of programs and tests using
  playing cards. Timing: About 30 minutes. Materials: 3 decks
date: "2017-09-04T21:35:15+00:00"
dateSource: meta
updated: "2017-09-04T21:35:17+00:00"
author: david-kane
categories:
  - games
  - agile
  - development
tags:
  - mocks
  - unit-testing
featuredImage: null
draft: false
wordpress:
  id: 7077
  sourceFile: output/2017/09/cardunit-a-unit-testing-simulation/index.html
  capture: modern
---

It can be difficult for developers to find the motivation or support to write automated unit tests. This simulation aims to demonstrate the value of automated unit tests to identify and localize defects. In the simulation, participants will play the roles of programs and tests using playing cards.

**Timing:** About 30 minutes.
**Materials:**

-   3 decks of standard playing cards for every 8 groups of participants. Each group should have at least 4 participants, and at most 7. 5 or 6 participants per group works best.
-   2 small envelopes per group
-   1 large envelope or other container per group to hold the materials.
-   Handouts, described in the attached facilitation guide

**Setup:** The attached facilitation guide describes the details of the setup.  The materials for each group includes a specific collection of cards for each group, and handouts to match that collection.  Some of the handouts are included as part of the initial setup, and some others are handed out in between rounds.

**How to run the game:** The simulation proceeds through several rounds.  Start off by getting 2 volunteers from each group.  1 of those is the computer, and 1 is the system test.  The computer runs by turning over the cards one at a time.  Each time the computer runs, the deck is reshuffled.  The person in the computer role is given some instructions for resetting the deck between each round.  For each round, sometimes the program will be correct, and sometimes it will have an error.  Have a discussion with the participants after each round.

**Round 1:** Assess the program (i.e the deck of cards) using just a system test.  The person in the system test role is given a sheet with all of the cards expected to be in the deck.  The person in the system test role can ask the computer to run more than once if there is not confidence on the correctness of the test.  _Key discussion topics:_ Was the system testing easy?  How many times did the program need to run?  Was there strong confidence in the assessment?

**Round 2:** Unit test sheets are handed out.  The rest of the participants in each group create unit tests of 3 or 4 cards.  This time the program is assessed using the unit tests. _Key discussion topics:_ How did this round compare to the first round?  How  did participants test for the cards that appear in triplicate?  (Many groups end up creating unit tests that are not independent)

**Round 3:** Same rules as the second round, but participants get a chance to update their tests based on the second round’s discussion. _Key discussion topics:_ What changes did participants make to their tests and why?

**Round 4:** Additional instructions are added that invoke an expensive operation (represented turnings over an additional set of cards) _Key discussion topics:_ What kinds of real-world software testing did this change in the rules seem similar to?

**Round 5:** Additional instructions are introduced to illustrate the concept of mocking the expensive operations. _Key discussion topics:_ How did the introduction of the mocks change the test experience?

**Acknowledgements.**  Developed by David Kane (@ADavidKane) and George Paci ([gpaci@tiac.net](#)).   Thanks to the Lithespeed.  The initial concept of this game was created at one of their Game Day events.  Thanks too to Agile DC and Cincinnati Day of Agile for the opportunities to share the game.

**Materials:** CardUnit Materials 170904
