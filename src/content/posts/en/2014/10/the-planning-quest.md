---
title: The Planning Quest
slug: the-planning-quest
permalink: /2014/10/the-planning-quest/
lang: en
description: >-
  This exercise is a continuation of The Estimation Quest. It covers some additional aspects of
  software planning (incl. scoping, risk/change management and scheduling) and could be used to
  demonstrate some major differences between the traditional and agile software development in this
  regard. Timing The timing largely depends on the number of participants and the level
date: "2014-10-20T12:41:16+00:00"
dateSource: meta
updated: "2015-04-30T09:00:03+00:00"
author: stavros-stavru
categories:
  - games
  - agile
  - development
  - requirements
tags: []
featuredImage:
  src: https://www.agify.me/wp-content/uploads/2015/03/The-Planning-Quest-Template.png
  alt: The Planning Quest - Template
  derived: true
draft: false
wordpress:
  id: 4342
  sourceFile: output/2014/10/the-planning-quest/index.html
  capture: modern
---

This exercise is a continuation of The Estimation Quest. It covers some additional aspects of **software planning** (incl. scoping, risk/change management and scheduling) and _could be used to demonstrate some major differences between the traditional and agile software development in this regard_.

**Timing**
The timing largely depends on the number of participants and the level of uncertainty and dynamicity introduced as part of the exercise.

**Materials**
Papers, pens and calculators. Scales would be also needed as participants would be estimating body weights.

**Introduction**
Split participants into two equally sized teams (preferably greater than 6 people). If the number of participants is an odd number – one participant might be an observer and his/her observations could be used later for debriefing.
Randomly assign teams to be either “traditional” (Team A) or “agile” (Team B). Distribute papers, pens and calculators and ask each team to draw a table using the following template:

![The Planning Quest - Template](https://www.agify.me/wp-content/uploads/2015/03/The-Planning-Quest-Template.png)

Get the actual body weights of all participants anonymously (using the scales). Then define the following controlled variables:

-   **N**: The size of Team A / Team B;
-   **TA / TB**: The sum of individual body weights of all members of Team A / Team B;
-   **BN**: The weight of one basic needs package (BN = 20 kg);
-   **SN**: The weight of one secondary needs package (SN = 50 kg);
-   **BR**: The number of days for one basic needs package to be consumed (BR = 3);
-   **SR**: The number of days for one secondary needs package to be consumed (SR = 6);
-   **TS**: The number of days for one “traditional” estimation and scheduling cycle (TS = 3);
-   **AS**: The number of days for one “agile” estimation and scheduling cycle (AS = 0.1).

Define also the following independent variables:

-   **C**: Safety boat capacity (C = 2\*(TBWA+TBWB) / N);
-   **E**: The number of days before the ship would sink entirely (random number between N and 2\*N);
-   **R**: The number of days before the survivors on the island would be rescued (random number between E/2 and E + E/2).

These independent variables would be later used to control the level of uncertainty and dynamicity within the exercise (and thus making it more “traditional” or “agile” friendly).
Example: Let’s assume that N = 8, TA = 560 kg and TB = 600 kg. Then C = 290 kg, E should be a random number between 8 and 16 days (e.g. E = 10 days) and R should be a random number between 5 and 15 (e.g. 12 days). In that case Team A’s table might looks like (changes are grayed out):

![The Planning Quest - Initialization](https://www.agify.me/wp-content/uploads/2015/03/The-Planning-Quest-Initialization.png)

**I. Assignment**
Give teams the following assignment:

> Imagine you were a captain of a cruise ship sailing around the world. Unfortunately you were caught in an ocean storm and after a tough fight with the waves the ship started sinking. You quickly realized that it was time to abound the ship. Fortunately there was а small desert island just over the horizon. However you had only one safety boat so you had to do a number of trips (each taking one day) to save all of the passengers (the members of the other team). Also
> you had to take some food and water as well as some clothing and first-aid appliances from the ship in order to guarantee the survival of the passengers before they are found by the Coastal Rescue Service. Your ultimate goal was to save as many passengers as possible. But there were some constraints. First you should not violate the capacity of the safety boat with more than +/-10%. Otherwise the safety boat would keel over and you would lose all of its passengers. Also you should verify that the basic (food and water) and the secondary (clothing and first-aid appliances) needs of the passengers were fulfilled on the island or otherwise you would lose one passenger for each day with no BN or SN packages. And hurry up – the ship is sinking and there is no much time to waste!

Therefore each team has to save as much members of the other team as possible (only the survivors on the island count). The winner is the one who saved the most.

**II. Scoping**
Let teams define the scope of the exercise. This might include its objectives, constraints, assumptions, etc. Share also the values of BN, SN, BR and SR.
Depending on the targeted level of uncertainty you might provide teams with:

-   The individual body weights of all or subset of the participants (thus facilitating estimation);
-   The actual capacity of the safety boat or C (thus facilitating scheduling);
-   The number of days before the ship would sink or E (thus facilitating risk management and scheduling);
-   The number of days before the survivors on the island would be rescued or R (thus facilitating risk management and scheduling).

Warn teams that these independent variables might change during the exercise (e.g. the capacity of the safety boat might be reduced) and that there might be unfortunate events that could limit the trips to the island (e.g. bad weather).
Example: Team A’s table might looks like (changes are grayed out):

![The Planning Quest - Scoping](https://www.agify.me/wp-content/uploads/2015/03/The-Planning-Quest-Scoping.png)

**III. Estimation and Scheduling**
The approach to estimation and scheduling used by Team A (the “traditional” team) and Team B (the “agile” team) should be different. Team A should estimate and schedule all of the trips at once while Team B should be estimating and scheduling trip by trip. They should be run in parallel as described below:

-   **Team A**: Give Team A 15 minutes to estimate all of the individual body weights of the members of Team B (if these are not already provided as part of the scoping). They could use any of the estimation methods and techniques introduced in The Estimation Quest. Give another 10 minutes to identify, assess and prioritize possible risks, as well as to determine proper responses in terms of scheduling (e.g. buffering). Finally give 15 minutes more to schedule all of the trips to the island (incl. passengers, BN and SN packages to be taken on each trip). According to the assignment this should take 3 days (TS = 3).
-   **Team B**: Give 5 minutes to schedule one trip to the island (incl. estimating the individual body weights of the passengers to be saved as well as the BN and SN packages to be taken). Then share the actual individual body weights of the passengers from the trip and let Team B determine whether the trip was successful or not. This should be repeated seven times (so it takes total of 40 minutes – the time spent by Team A). As result Team B would have consumed ~ 1 day for estimating and scheduling (AS=0.1) and 8 days for trips (1 day per trip). In other words Team B has consumed a total of 9 days and has done 8 trips. In order Team A to catch up Team B in terms of consumed days – Team A would have to do its first 6 trips to the island and determine which of them are successful (based on the actual individual body weights of the passengers from these trips).

To sum up: In 9 days Team A / Team B would have done 6 / 8 trips. In case E or R is less than 9 days, the number of trips should be limited to E and the number of days to R. Then you should proceed to the End phase and calculate the final results. If more days are left (E and R are greater than 9) you might continue with the next phase.
Example: Team A’s table might looks like (changes are grayed out):

![The Planning Quest - Estimation and Scheduling](https://www.agify.me/wp-content/uploads/2015/03/The-Planning-Quest-Estimation-and-Scheduling.png)

**IV. Change management**
Change any of the independent variables (e.g. reduce the capacity of the safety boat). Ask Team A whether they would like to reschedule their trips. If yes:

-   **Team A**: Give 15 minutes to do the rescheduling. According to the assignment this should take 3 days (TS=3).
-   **Team B**: Run three trips to the island (5 minutes each). As a result both Team A and Team B would have consumed 3 days. However Team B would be 3 additional trips ahead of Team A.

Now continue with the rest of the trips until either there are no passengers on the ship or E / R days are consumed. Remember that one passenger is lost each day when there’re no BN or SN packages available on the island.

**V. End**
Calculate the results by summing up the rescued passengers and announce the winning team.
Example: Team A’s table might looks like (changes are grayed out):

![The Planning Quest - End](https://www.agify.me/wp-content/uploads/2015/03/The-Planning-Quest-End.png)

**VI. Debrief**
Ask teams to suggest a mapping between the exercise and software planning (e.g. who are the passengers, what are TA / TB, BN / SN, C, E, R, etc.). Discuss how uncertainty and dynamicity affects scoping, risk/change management, estimation and scheduling (or software planning in general). Go through some extreme hypothetical scenarios such as:

-   All of the independent variables are unknown (or know) upfront;
-   All of the independent variables are changed with every trip (or remain unchanged throughout the exercise);
-   There is a constant flow of change (unfortunate events); etc.

Ask teams to list all things that could introduce uncertainty in the context of software planning. Also let them think of any possible unfortunate events which could threaten the execution of already established software plans. Then discuss how does “traditional” and “agile” software planning fit into different contexts in terms of uncertainty and dynamicity?

**Variations**: Instead of estimating the individual body weights of participants you might ask teams to estimate a predefined group of individuals taken from http://www.cockeyed.com/photos/bodies/heightweight.html (this would save you a lot of time as well). You might also try estimating height, age, etc. However in the latter case you would have to adapt the exercise accordingly.

**Original article**: https://www.agify.me/the-planning-quest/
