---
title: Logo Maze (why we test first)
slug: logo-maze-why-we-test-first
permalink: /2017/01/logo-maze-why-we-test-first/
lang: en
description: >-
  Timing: 20-30 minutes Materials: 1-pack of sticky notes pens for each group of 3-5 people dry
  erase board, table, window or wall to set up the maze Instructions: Explain to the audience that
  we're going to play a game that allows them to program a robotic turtle to navigate through a
  maze, as pictured below.
date: "2017-01-24T14:52:22+00:00"
dateSource: meta
updated: "2017-01-24T15:26:57+00:00"
author: andre-dhondt
categories:
  - development
  - project-management
tags:
  - test-first
featuredImage: null
draft: false
wordpress:
  id: 6376
  sourceFile: output/2017/01/logo-maze-why-we-test-first/index.html
  capture: modern
---

**Timing**: 20-30 minutes

**Materials:**

-   1-pack of sticky notes
-   pens for each group of 3-5 people
-   dry erase board, table, window or wall to set up the maze

**Instructions:**

Explain to the audience that we’re going to play a game that allows them to program a robotic turtle to navigate through a maze, as pictured below. There are four simple commands in our programming language: forward, forward until it hits a wall, right 90 degrees, and left 90 degrees. You will use the arrows as pictured as symbols in writing your program. We’ll need at least two groups of 3 – 5 people, so please pick your group.

Group Instructions:

-   The picture is to-scale, with a turtle being one post-it note tall. I’m also creating the same maze out of post-it notes here (you’ll do this as they write their code).
-   Each team must pick some programmers and an artist.
-   Artist: please draw a turtle on a post-it note. Put your team’s name on the turtle.
-   Programmers: select and write down each of the symbols required to get the turtle pictured here to the exit at the top left of the maze. We also need someone from each group to draw a turtle on a post-it note.

Facilitator says:

-   What questions do you have?
-   OK, go!
-   Once you’re finished making the maze out of post-its, ask who’s ready. Groups often need a few more minutes–announce that they can have up to five more minutes and set a timer.

Running the simulation

-   For any team that is ready, collect their turtle.
-   Once you have ALL the turtles, ask the programmers to write their team name on their program, and pass their code to another team.
-   Meanwhile, line up the turtles at the front of the maze.
-   SPOILER ALERT–now explain the algorithm by which you’ll test the teams. Every team is responsible for giving you, the CPU, one symbol at a time from the code they have in front of them. You’ll point to a turtle and the team with the corresponding code must give you the next symbol.  Since most (or all) teams wrote with the assumption they’d be the only turtle in the environment, the turtles will crash into one another. Turtles cannot pass through one another, so if a turtle hits another turtle, the command is aborted. Execute the directions as well as any three-dimensional physical robot would under the same circumstances.

Debrief

-   What happened here?
-   Why were there so many crashes?
-   What could you change to get your robot through the maze?
-   If you could add one or two commands to the language, what would they be?
-   Anyone want to try again? (If so, see me after class!)

**Learning Points:**

-   There are some environmental factors you cannot predict until you test in a realistic environment
-   Testing first leads to discovery of these issues sooner, and leads to more robust code.

**Facilitator Notes:**

Why is this called Logo Maze?

  It’s inspired by the plotters that were programmed in the Logo programming language, which was one of my first programming languages.

Can I use a more complex maze?

  Surprisingly enough, this is complex enough. Anything tougher would distract people from the lesson.
