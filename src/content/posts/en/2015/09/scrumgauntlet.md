---
title: The Scrum Gauntlet of Debt
slug: scrumgauntlet
permalink: /2015/09/scrumgauntlet/
lang: en
description: >-
  Overview: A quick and easy demonstration/game to illustrate why an agile team needs to do
  refactoring and the related XP Practices in addition to Scrum. It never fails to create the A-HA
  moment for a team and team management as to why, when and how to do refactoring. Learning Points:
  Scrum without XP will
date: "2015-09-21T18:12:57+00:00"
dateSource: meta
updated: "2015-09-21T18:13:08+00:00"
author: ron-quartel
categories:
  - agile
  - development
tags:
  - extreme-programming
  - legacy
  - refactoring
  - scrum
  - technical-debt
featuredImage: null
draft: false
wordpress:
  id: 5167
  sourceFile: output/2015/09/scrumgauntlet/index.html
  capture: modern
---

**Overview:**

A quick and easy demonstration/game to illustrate why an agile team needs to do refactoring and the related XP Practices in addition to Scrum. It never fails to create the A-HA moment for a team and team management as to why, when and how to do refactoring.

 **Learning Points:**

Scrum without XP will lead to technical debt and ultimately a legacy system.

 **Timing**: 30-40 minutes including prep and debrief

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5168"><figcaption class="wp-caption-text">Requirements</figcaption></figure>

**Materials:** Tools, supplies and environment

You will need an area/room where you can clear a game area we will call the gauntlet. Gauntlet area needs to be 15-30 feet long and 6-10 feet wide. Typically I find myself in a room where you just shove the tables and chairs out of the way to clear this space. Keep the chairs nearby as you will need them.

In addition to the space you will need :

-   Volunteers (7-12 volunteers)
-   Two opposing walls and two easels or use two easels in place of wall plus two more easels
-   Chairs (observers can give up theirs while watching if need be)
-   Sticky notes (small square size is better but any will work)
-   Flipchart (Sticky is best)
-   Blue tape
-   Something with a countdown timer (smartphone apps work)
-   Three surfaces for flipchart sheet. E.g. walls, whiteboard, easel
-   Marker pens to write on flipcharts (and whiteboard)

**Preparation**

**Volunteers and Roles**

You need 7-12 volunteers. Ask for volunteers with warning that it is a physical demonstration and there will be running. Do not volunteer unless comfortable with this.

Divide the volunteers into testers and developers using one of these formations depending on the number of volunteers

• 10 devs and 1 or 2 testers

• 8 devs and 1 or 2 testers

• 6 devs and 1 or 2 testers

Divide devs into two even groups

Have everyone in the room clear a space for the gauntlet and place one dev group at each end of the gauntlet in front of a To do/ To Test kanban board

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5174"><img alt="To Do / To Test" src="/media/2015/09/todototest.png" decoding="async" width="369" height="457"><figcaption class="wp-caption-text">To Do / To Test</figcaption></figure>

Populate the TO DO portion of the board with sticky notes as shown.

You will need around 20.

(These empty notes represent a task or story.)

Place the tester(s) at the mid point of the gauntlet in front of the done board/flip chart/easel.

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5181"><figcaption class="wp-caption-text">Done</figcaption></figure>

Your gauntlet area should look something like this …

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5187"><figcaption class="wp-caption-text">Gauntlet game area layout</figcaption></figure>

Timer volunteer – (Can be the facilitator if no-one else volunteers). This person will need to have an app or device that has a 30 second countdown timer.

Explain to participants that this is a simulation. The goal is not to “win” and game the system. The goal is to mimic what real life looks like.

Instruct participants to act like a dysfunctional team and not communicate with each other (otherwise they start gaming the system).

They should all be in their locations as below :-

**The Rules**

-   An iteration lasts 30 seconds
-   Developers run to opposite wall, pick a story token (sticky note) from TODO and run back to their starting wall, placing the token in the TO TEST column
-   A Dev can only work on one story at a time
-   Testers wait by their Done board until they see stories ready to TEST and then run to (either) board, grab up to 3 stories (but no more than 3) and return them to their done board
-   Everyone must run (That is why they call it Sprinting!)
-   No collusion or working out a system. You are mimicking a dysfunctional team (Be sure to have explained this or else they game the system)
-   Each sprint (except for the first) you count the number of post-it notes in the done area(s) and that is the velocity for the sprint.
-   Make sure to run a sprint zero without measuring velocity. That is the practice sprint to ensure everyone understands the rules. (Velocity always goes up after this sprint so don’t measure it.)
-   BE CAREFUL!!! (Re-iterate and ask volunteers again if comfortable)

**BE CAREFUL!**

-   Health and safety
-   Don’t have anyone pregnant, wearing high heels or with physical disabilities that may cause risk to themselves or others in the volunteers
-   Make sure volunteers are comfortable with exercise otherwise switch out
-   Re-iterate to volunteers Safety First!
-   Be careful!!!

---

**Start the Game!**

**Sprint 0 – Practice**

Run this 30 second iteration with taking the velocity. Correct any misunderstanding and assumptions that anyone may have.

(There is another reason for running a practice sprint is because without doing so, the velocity for the next sprint will go up even if you put more obstacles in. The reason I believe is because once they understand the game, they get better at it. So give them a grace understanding sprint.)

**Sprint 1 – Calibration**

The goal of this sprint is to find out what their Scrum velocity is. Let them run the gauntlet with no obstacles. At the end record the velocity which is how many tasks are in the Done areas.

e.g. Sprint 1 – 13

During the sprint the facilitator can play the role of a pushy manager and shout at the team. See below for examples of things to shout.

Ask the team if they feel puffed out / exhausted. Ask if they think they can sustain this pace?

Point out that in scrum they call an iteration a sprint for a reason… (joke)

Reset the boards for the next sprint.

**Sprint 2 – Introduce technical debt**

Describe to the room that what they have just seen is what happens in scrum. Management want you to run as fast as you can and get features in.

But what is happening while you are introducing new features to the code base you are also introducing technical debt. For every story completed you left behind debt.

Ask the room if in their environment they have technical debt. (Yet to have a no come back to this question.)

Now grab chairs from the sidelines and place them randomly in the gauntlet area to represent the technical debt. Place them purposefully to make running the gauntlet difficult.

Re-iterate to the runners that this is a simulation and the goal isn’t to game the system and win. Re-iterate that they are simulating a dysfunctional team and are not to communicate with each other (to collude).

Double re-iterate safety! No jumping the chairs. Please be sensible and careful!!!

Now run the second sprint. Again take on the role of pushy manager and include in your taunts : –

-   why have things slowed down?
-   you developers are useless
-   why are your estimates wrong?
-   etc

Take the velocity of the second sprint.

e.g. Sprint 2 – 10

Note – it actually takes putting quite a few chairs in the gauntlet to impact velocity in this sprint. I usually put in 10-15.

**Sprint 2a – Legacy system (but don’t run this sprint as it’s too dangerous)**

Have the runners reset their boards for the next sprint.

While they do this – place more chairs in the gauntlet while explaining to the room “for every story you get done, you are adding more technical debt”.

Make the gauntlet almost impossible. Now speak to the room about this is how you create a legacy system. You leave debt behind on top of debt.

Point out to the managers in the room that this is what it is like for a developer. To come in and face a messy codebase and be expected to add value to the system every sprint without ever having time to clean it up.

Ask the room if the gauntlet is now representative of their codebase and running it representative of their job.

Ask them what they think will happen to velocity for this sprint. Ask them what they think will happen if they keep going forward in this way.

Do not run an iteration under these conditions – it is now too dangerous. You will break things (just as you break the code when you try to add new features to a legacy system).

Instead we are going to find a solution…

**Sprint 3 – Introduce refactoring and find what their sustainable pace is**

The new rule for this iteration is – refactoring.

For each story that you work on you are allowed to do some refactoring – cleaning up of the codebase. This is represented by being able to move one chair out of the gauntlet for each story you are working on.

You will also no longer run – but walk. We need to find a sustainable pace and we need to move more purposefully and carefully.

Walk, don’t run.

Go!

During this sprint the facilitator can call out management stressors like :-

-   who said they could refactor?
-   why are they pair programming?
-   what is this nonsense?
-   we are doomed if they work at this pace!
-   we don’t need refactoring, we need features!

At the end of the sprint record the velocity and have everyone return to their seats for the post exercise discussion.

**Management Abuse to shout at game players**

-   Faster!
-   I need more features!
-   What is wrong with this team?
-   Why are they so slow?
-   Why are your estimates all wrong?
-   More velocity!
-   Development monkeys!
-   Screw code practices – I need Features!
-   Stop that pair programming nonsense!
-   My last team was better than you guys
-   Don’t make me fire you
-   I should out source the lot of you
-   Run, run, run!
-   Lazy coders!
-   I’m paying you too much!
-   There’s going to be overtime!

---

**Post Exercise Discussion**

At this point your velocity will look something like :-

Sprint 1 – 14

Sprint 2 – 12

Sprint 3 – 8

Now talk about what the numbers mean.

Sprint one represents what happens when companies take on Scrum. They become excited about the ability to get things done quickly. Because Scrum does not include any technical practices the usual pattern is to ignore them but now the Product Owner and business is used to a certain cadence of delivery. What they don’t realize though is that it is not sustainable and they are incurring a debt with compounding interest. i.e Technical Debt

Sprint two represents what happens over time as the debt starts to build up. You are ignoring the agile principle (behind the Agile Manifesto) of :-

> Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.

Sprint three represents Extreme Programming and sustainable pace. You are now writing code in a sustainable way where it is easy to add new features and the technical debt is kept in check. Refactoring is part of coding. You should not need to ask permission to do it, you must do it as part of writing code. But this may cause a change in your coding culture and processes. This is the next part of the discussion.

---

**Code Entropy, Iterating toward Legacy, Technical Debt, Refactoring is not an Island, Extreme Programming**

These are all distinct topics that are raised by the exercise and should be discussed. It would make this article a little too long if I include what to address to all of these here so I shall add links to blog articles as I write them. To start with however you can look at :-

Iterating Toward Legacy – Scrum’s Achilles Heel

Slideshare of this exercise presented at Agile 2015

 **Overview:**

A quick and easy demonstration/game to illustrate why an agile team needs to do refactoring and the related XP Practices in addition to Scrum. It never fails to create the A-HA moment for a team and team management as to why, when and how to do refactoring.

 **Learning Points:**

Scrum without XP will lead to technical debt and ultimately a legacy system.

 **Timing**: 30-40 minutes including prep and debrief

 **Materials:** Tools, supplies and environment

You will need an area/room where you can clear a game area we will call the gauntlet. Gauntlet area needs to be 15-30 feet long and 6-10 feet wide. Typically I find myself in a room where you just shove the tables and chairs out of the way to clear this space. Keep the chairs nearby as you will need them.

In addition to the space you will need :

-   Volunteers (7-12 volunteers)
-   Two opposing walls and two easels or use two easels in place of wall plus two more easels
-   Chairs (observers can give up theirs while watching if need be)
-   Sticky notes (small square size is better but any will work)
-   Flipchart (Sticky is best)
-   Blue tape
-   Something with a countdown timer (smartphone apps work)
-   Three surfaces for flipchart sheet. E.g. walls, whiteboard, easel
-   Marker pens to write on flipcharts (and whiteboard)

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5168"><figcaption class="wp-caption-text">Requirements</figcaption></figure>

**Instructions:**

**Volunteers and Roles**

You need 7-12 volunteers. Ask for volunteers with warning that it is a physical demonstration and there will be running. Do not volunteer unless comfortable with this.

Divide the volunteers into testers and developers using one of these formations depending on the number of volunteers

• 10 devs and 1 or 2 testers

• 8 devs and 1 or 2 testers

• 6 devs and 1 or 2 testers

Divide devs into two even groups

Have everyone in the room clear a space for the gauntlet and place one dev group at each end of the gauntlet in front of a To do/ To Test kanban board

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5174"><figcaption class="wp-caption-text">To Do / To Test</figcaption></figure>

Populate the TO DO portion of the board with sticky notes as shown.

You will need around 20.

(These empty notes represent a task or story.)

Place the tester(s) at the mid point of the gauntlet in front of the done board/flip chart/easel.

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5181"><figcaption class="wp-caption-text">Done</figcaption></figure>

Your gauntlet area should look something like this …

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5187"><figcaption class="wp-caption-text">Gauntlet game area layout</figcaption></figure>

Timer volunteer – (Can be the facilitator if no-one else volunteers). This person will need to have an app or device that has a 30 second countdown timer.

Explain to participants that this is a simulation. The goal is not to “win” and game the system. The goal is to mimic what real life looks like

Instruct participants to act like a dysfunctional team and not communicate with each other (otherwise they start gaming the system)

They should all be in their locations as below

**The Rules**

-    An iteration lasts 30 seconds
-   Developers run to opposite wall, pick a story token (sticky note) from TODO and run back to their starting wall, placing the token in the TO TEST column
-   A Dev can only work on one story at a time
-   Testers wait by their Done board until they see stories ready to TEST and then run to (either) board, grab up to 3 stories (but no more than 3) and return them to their done board
-   Everyone must run (That is why they call it Sprinting!)
-   No collusion or working out a system. You are mimicking a dysfunctional team (Be sure to have explained this or else they game the system)
-   Each sprint (except for the first) you count the number of post-it notes in the done area(s) and that is the velocity for the sprint.
-   Make sure to run a sprint zero without measuring velocity. That is the practice sprint to ensure everyone understands the rules. (Velocity always goes up after this sprint so don’t measure it.)
-   BE CAREFUL!!! (Re-iterate and ask volunteers again if comfortable)

**BE CAREFUL!**

•Health and safety

•Don’t have anyone pregnant, wearing high heels or with physical disabilities that may cause risk to themselves or others in the volunteers

•Make sure volunteers are comfortable with exercise otherwise switch out

•Re-iterate to volunteers Safety First!

•Be careful!!!

**Start!**

**Sprint 0 – Practice**

Run this 30 second iteration with taking the velocity. Correct any misunderstanding and assumptions that anyone may have.

(There is another reason for running a practice sprint is because without doing so, the velocity for the next sprint will go up even if you put more obstacles in. The reason I believe is because once they understand the game, they get better at it. So give them a grace understanding sprint.)

**Sprint 1 – Calibration**

The goal of this sprint is to find out what their Scrum velocity is. Let them run the gauntlet with no obstacles. At the end record the velocity which is how many tasks are in the Done areas.

e.g. Sprint 1 – 13

During the sprint the facilitator can play the role of a pushy manager and shout at the team. See below for examples of things to shout.

Ask the team if they feel puffed out / exhausted. Ask if they think they can sustain this pace?

Point out that in scrum they call an iteration a sprint for a reason… (joke)

Reset the boards for the next sprint.

**Sprint 2 – Introduce technical debt**

Describe to the room that what they have just seen is what happens in scrum. Management want you to run as fast as you can and get features in.

But what is happening while you are introducing new features to the code base you are also introducing technical debt. For every story completed you left behind debt.

Ask the room if in their environment they have technical debt. (Yet to have a no come back to this question.)

Now grab chairs from the sidelines and place them randomly in the gauntlet area to represent the technical debt. Place them purposefully to make running the gauntlet difficult.

Re-iterate to the runners that this is a simulation and the goal isn’t to game the system and win. Re-iterate that they are simulating a dysfunctional team and are not to communicate with each other (to collude).

Double re-iterate safety! No jumping the chairs. Please be sensible and careful!!!

Now run the second sprint. Again take on the role of pushy manager and include in your taunts : –

-   why have things slowed down?
-   you developers are useless
-   why are your estimates wrong?
-   etc

Take the velocity of the second sprint.

e.g. Sprint 2 – 10

Note – it actually takes putting quite a few chairs in the gauntlet to impact velocity in this sprint. I usually put in 10-15.

**Sprint 2a – Legacy system (but don’t run this sprint as it’s too dangerous)**

Have the runners reset their boards for the next sprint.

While they do this – place more chairs in the gauntlet while explaining to the room “for every story you get done, you are adding more technical debt”.

Make the gauntlet almost impossible. Now speak to the room about this is how you create a legacy system. You leave debt behind on top of debt.

Point out to the managers in the room that this is what it is like for a developer. To come in and face a messy codebase and be expected to add value to the system every sprint without ever having time to clean it up.

Ask the room if the gauntlet is now representative of their codebase and running it representative of their job.

Ask them what they think will happen to velocity for this sprint. Ask them what they think will happen if they keep going forward in this way.

Do not run an iteration under these conditions – it is now too dangerous. You will break things (just as you break the code when you try to add new features to a legacy system).

Instead we are going to find a solution…

**Sprint 3 – Introduce refactoring and find what their sustainable pace is**

The new rule for this iteration is – refactoring.

For each story that you work on you are allowed to do some refactoring – cleaning up of the codebase. This is represented by being able to move one chair out of the gauntlet for each story you are working on.

You will also no longer run – but walk. We need to find a sustainable pace and we need to move more purposefully and carefully.

Walk, don’t run.

Go!

During this sprint the facilitator can call out management stressors like :-

-   who said they could refactor?
-   why are they pair programming?
-   what is this nonsense?
-   we are doomed if they work at this pace!
-   we don’t need refactoring, we need features!

At the end of the sprint record the velocity and have everyone return to their seats for the post exercise discussion.

**Management Abuse to shout at game players**

•Faster!

•I need more features!

•What is wrong with this team?

•Why are they so slow?

•Why are your estimates all wrong?

•More velocity!

•Development monkeys!

•Screw code practices – I need Features!

•Stop that pair programming nonsense!

•My last team was better than you guys

•Don’t make me fire you

•I should out source the lot of you

•Run, run, run!

•Lazy coders!

•I’m paying you too much!

•There’s going to be overtime!

**Post Exercise Discussion**

At this point your velocity will look something like :-

Sprint 1 – 14

Sprint 2 – 12

Sprint 3 – 8

Now talk about what the numbers mean.

Sprint one represents what happens when companies take on Scrum. They become excited about the ability to get things done quickly. Because Scrum does not include any technical practices the usual pattern is to ignore them but now the Product Owner and business is used to a certain cadence of delivery. What they don’t realize though is that it is not sustainable and they are incurring a debt with compounding interest. i.e Technical Debt

Sprint two represents what happens over time as the debt starts to build up. You are ignoring the agile principle (behind the Agile Manifesto) of :-

> Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.

Sprint three represents

 **Overview:**

A quick and easy demonstration/game to illustrate why an agile team needs to do refactoring and the related XP Practices in addition to Scrum. It never fails to create the A-HA moment for a team and team management as to why, when and how to do refactoring.

 **Learning Points:**

Scrum without XP will lead to technical debt and ultimately a legacy system.

 **Timing**: 30-40 minutes including prep and debrief

 **Materials:** Tools, supplies and environment

You will need an area/room where you can clear a game area we will call the gauntlet. Gauntlet area needs to be 15-30 feet long and 6-10 feet wide. Typically I find myself in a room where you just shove the tables and chairs out of the way to clear this space. Keep the chairs nearby as you will need them.

In addition to the space you will need :

-   Volunteers (7-12 volunteers)
-   Two opposing walls and two easels or use two easels in place of wall plus two more easels
-   Chairs (observers can give up theirs while watching if need be)
-   Sticky notes (small square size is better but any will work)
-   Flipchart (Sticky is best)
-   Blue tape
-   Something with a countdown timer (smartphone apps work)
-   Three surfaces for flipchart sheet. E.g. walls, whiteboard, easel
-   Marker pens to write on flipcharts (and whiteboard)

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5168"><figcaption class="wp-caption-text">Requirements</figcaption></figure>

**Instructions:**

**Volunteers and Roles**

You need 7-12 volunteers. Ask for volunteers with warning that it is a physical demonstration and there will be running. Do not volunteer unless comfortable with this.

Divide the volunteers into testers and developers using one of these formations depending on the number of volunteers

• 10 devs and 1 or 2 testers

• 8 devs and 1 or 2 testers

• 6 devs and 1 or 2 testers

Divide devs into two even groups

Have everyone in the room clear a space for the gauntlet and place one dev group at each end of the gauntlet in front of a To do/ To Test kanban board

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5174"><figcaption class="wp-caption-text">To Do / To Test</figcaption></figure>

Populate the TO DO portion of the board with sticky notes as shown.

You will need around 20.

(These empty notes represent a task or story.)

Place the tester(s) at the mid point of the gauntlet in front of the done board/flip chart/easel.

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5181"><figcaption class="wp-caption-text">Done</figcaption></figure>

Your gauntlet area should look something like this …

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5187"><figcaption class="wp-caption-text">Gauntlet game area layout</figcaption></figure>

Timer volunteer – (Can be the facilitator if no-one else volunteers). This person will need to have an app or device that has a 30 second countdown timer.

Explain to participants that this is a simulation. The goal is not to “win” and game the system. The goal is to mimic what real life looks like

Instruct participants to act like a dysfunctional team and not communicate with each other (otherwise they start gaming the system)

They should all be in their locations as below

**The Rules**

-    An iteration lasts 30 seconds
-   Developers run to opposite wall, pick a story token (sticky note) from TODO and run back to their starting wall, placing the token in the TO TEST column
-   A Dev can only work on one story at a time
-   Testers wait by their Done board until they see stories ready to TEST and then run to (either) board, grab up to 3 stories (but no more than 3) and return them to their done board
-   Everyone must run (That is why they call it Sprinting!)
-   No collusion or working out a system. You are mimicking a dysfunctional team (Be sure to have explained this or else they game the system)
-   Each sprint (except for the first) you count the number of post-it notes in the done area(s) and that is the velocity for the sprint.
-   Make sure to run a sprint zero without measuring velocity. That is the practice sprint to ensure everyone understands the rules. (Velocity always goes up after this sprint so don’t measure it.)
-   BE CAREFUL!!! (Re-iterate and ask volunteers again if comfortable)

**BE CAREFUL!**

•Health and safety

•Don’t have anyone pregnant, wearing high heels or with physical disabilities that may cause risk to themselves or others in the volunteers

•Make sure volunteers are comfortable with exercise otherwise switch out

•Re-iterate to volunteers Safety First!

•Be careful!!!

**Start!**

**Sprint 0 – Practice**

Run this 30 second iteration with taking the velocity. Correct any misunderstanding and assumptions that anyone may have.

(There is another reason for running a practice sprint is because without doing so, the velocity for the next sprint will go up even if you put more obstacles in. The reason I believe is because once they understand the game, they get better at it. So give them a grace understanding sprint.)

**Sprint 1 – Calibration**

The goal of this sprint is to find out what their Scrum velocity is. Let them run the gauntlet with no obstacles. At the end record the velocity which is how many tasks are in the Done areas.

e.g. Sprint 1 – 13

During the sprint the facilitator can play the role of a pushy manager and shout at the team. See below for examples of things to shout.

Ask the team if they feel puffed out / exhausted. Ask if they think they can sustain this pace?

Point out that in scrum they call an iteration a sprint for a reason… (joke)

Reset the boards for the next sprint.

**Sprint 2 – Introduce technical debt**

Describe to the room that what they have just seen is what happens in scrum. Management want you to run as fast as you can and get features in.

But what is happening while you are introducing new features to the code base you are also introducing technical debt. For every story completed you left behind debt.

Ask the room if in their environment they have technical debt. (Yet to have a no come back to this question.)

Now grab chairs from the sidelines and place them randomly in the gauntlet area to represent the technical debt. Place them purposefully to make running the gauntlet difficult.

Re-iterate to the runners that this is a simulation and the goal isn’t to game the system and win. Re-iterate that they are simulating a dysfunctional team and are not to communicate with each other (to collude).

Double re-iterate safety! No jumping the chairs. Please be sensible and careful!!!

Now run the second sprint. Again take on the role of pushy manager and include in your taunts : –

-   why have things slowed down?
-   you developers are useless
-   why are your estimates wrong?
-   etc

Take the velocity of the second sprint.

e.g. Sprint 2 – 10

Note – it actually takes putting quite a few chairs in the gauntlet to impact velocity in this sprint. I usually put in 10-15.

**Sprint 2a – Legacy system (but don’t run this sprint as it’s too dangerous)**

Have the runners reset their boards for the next sprint.

While they do this – place more chairs in the gauntlet while explaining to the room “for every story you get done, you are adding more technical debt”.

Make the gauntlet almost impossible. Now speak to the room about this is how you create a legacy system. You leave debt behind on top of debt.

Point out to the managers in the room that this is what it is like for a developer. To come in and face a messy codebase and be expected to add value to the system every sprint without ever having time to clean it up.

Ask the room if the gauntlet is now representative of their codebase and running it representative of their job.

Ask them what they think will happen to velocity for this sprint. Ask them what they think will happen if they keep going forward in this way.

Do not run an iteration under these conditions – it is now too dangerous. You will break things (just as you break the code when you try to add new features to a legacy system).

Instead we are going to find a solution…

**Sprint 3 – Introduce refactoring and find what their sustainable pace is**

The new rule for this iteration is – refactoring.

For each story that you work on you are allowed to do some refactoring – cleaning up of the codebase. This is represented by being able to move one chair out of the gauntlet for each story you are working on.

You will also no longer run – but walk. We need to find a sustainable pace and we need to move more purposefully and carefully.

Walk, don’t run.

Go!

During this sprint the facilitator can call out management stressors like :-

-   who said they could refactor?
-   why are they pair programming?
-   what is this nonsense?
-   we are doomed if they work at this pace!
-   we don’t need refactoring, we need features!

At the end of the sprint record the velocity and have everyone return to their seats for the post exercise discussion.

**Management Abuse to shout at game players**

•Faster!

•I need more features!

•What is wrong with this team?

•Why are they so slow?

•Why are your estimates all wrong?

•More velocity!

•Development monkeys!

•Screw code practices – I need Features!

•Stop that pair programming nonsense!

•My last team was better than you guys

•Don’t make me fire you

•I should out source the lot of you

•Run, run, run!

•Lazy coders!

•I’m paying you too much!

•There’s going to be overtime!

**Post Exercise Discussion**

At this point your velocity will look something like :-

Sprint 1 – 14

Sprint 2 – 12

Sprint 3 – 8

Now talk about what the numbers mean.

Sprint one represents what happens when companies take on Scrum. They become excited about the ability to get things done quickly. Because Scrum does not include any technical practices the usual pattern is to ignore them but now the Product Owner and business is used to a certain cadence of delivery. What they don’t realize though is that it is not sustainable and they are incurring a debt with compounding interest. i.e Technical Debt

Sprint two represents what happens over time as the debt starts to build up. You are ignoring the agile principle (behind the Agile Manifesto) of :-

> Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.

Sprint three represents

 **Overview:**

A quick and easy demonstration/game to illustrate why an agile team needs to do refactoring and the related XP Practices in addition to Scrum. It never fails to create the A-HA moment for a team and team management as to why, when and how to do refactoring.

 **Learning Points:**

Scrum without XP will lead to technical debt and ultimately a legacy system.

 **Timing**: 30-40 minutes including prep and debrief

 **Materials:** Tools, supplies and environment

You will need an area/room where you can clear a game area we will call the gauntlet. Gauntlet area needs to be 15-30 feet long and 6-10 feet wide. Typically I find myself in a room where you just shove the tables and chairs out of the way to clear this space. Keep the chairs nearby as you will need them.

In addition to the space you will need :

-   Volunteers (7-12 volunteers)
-   Two opposing walls and two easels or use two easels in place of wall plus two more easels
-   Chairs (observers can give up theirs while watching if need be)
-   Sticky notes (small square size is better but any will work)
-   Flipchart (Sticky is best)
-   Blue tape
-   Something with a countdown timer (smartphone apps work)
-   Three surfaces for flipchart sheet. E.g. walls, whiteboard, easel
-   Marker pens to write on flipcharts (and whiteboard)

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5168"><figcaption class="wp-caption-text">Requirements</figcaption></figure>

**Instructions:**

**Volunteers and Roles**

You need 7-12 volunteers. Ask for volunteers with warning that it is a physical demonstration and there will be running. Do not volunteer unless comfortable with this.

Divide the volunteers into testers and developers using one of these formations depending on the number of volunteers

• 10 devs and 1 or 2 testers

• 8 devs and 1 or 2 testers

• 6 devs and 1 or 2 testers

Divide devs into two even groups

Have everyone in the room clear a space for the gauntlet and place one dev group at each end of the gauntlet in front of a To do/ To Test kanban board

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5174"><figcaption class="wp-caption-text">To Do / To Test</figcaption></figure>

Populate the TO DO portion of the board with sticky notes as shown.

You will need around 20.

(These empty notes represent a task or story.)

Place the tester(s) at the mid point of the gauntlet in front of the done board/flip chart/easel.

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5181"><figcaption class="wp-caption-text">Done</figcaption></figure>

Your gauntlet area should look something like this …

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5187"><figcaption class="wp-caption-text">Gauntlet game area layout</figcaption></figure>

Timer volunteer – (Can be the facilitator if no-one else volunteers). This person will need to have an app or device that has a 30 second countdown timer.

Explain to participants that this is a simulation. The goal is not to “win” and game the system. The goal is to mimic what real life looks like

Instruct participants to act like a dysfunctional team and not communicate with each other (otherwise they start gaming the system)

They should all be in their locations as below

**The Rules**

-    An iteration lasts 30 seconds
-   Developers run to opposite wall, pick a story token (sticky note) from TODO and run back to their starting wall, placing the token in the TO TEST column
-   A Dev can only work on one story at a time
-   Testers wait by their Done board until they see stories ready to TEST and then run to (either) board, grab up to 3 stories (but no more than 3) and return them to their done board
-   Everyone must run (That is why they call it Sprinting!)
-   No collusion or working out a system. You are mimicking a dysfunctional team (Be sure to have explained this or else they game the system)
-   Each sprint (except for the first) you count the number of post-it notes in the done area(s) and that is the velocity for the sprint.
-   Make sure to run a sprint zero without measuring velocity. That is the practice sprint to ensure everyone understands the rules. (Velocity always goes up after this sprint so don’t measure it.)
-   BE CAREFUL!!! (Re-iterate and ask volunteers again if comfortable)

**BE CAREFUL!**

•Health and safety

•Don’t have anyone pregnant, wearing high heels or with physical disabilities that may cause risk to themselves or others in the volunteers

•Make sure volunteers are comfortable with exercise otherwise switch out

•Re-iterate to volunteers Safety First!

•Be careful!!!

**Start!**

**Sprint 0 – Practice**

Run this 30 second iteration with taking the velocity. Correct any misunderstanding and assumptions that anyone may have.

(There is another reason for running a practice sprint is because without doing so, the velocity for the next sprint will go up even if you put more obstacles in. The reason I believe is because once they understand the game, they get better at it. So give them a grace understanding sprint.)

**Sprint 1 – Calibration**

The goal of this sprint is to find out what their Scrum velocity is. Let them run the gauntlet with no obstacles. At the end record the velocity which is how many tasks are in the Done areas.

e.g. Sprint 1 – 13

During the sprint the facilitator can play the role of a pushy manager and shout at the team. See below for examples of things to shout.

Ask the team if they feel puffed out / exhausted. Ask if they think they can sustain this pace?

Point out that in scrum they call an iteration a sprint for a reason… (joke)

Reset the boards for the next sprint.

**Sprint 2 – Introduce technical debt**

Describe to the room that what they have just seen is what happens in scrum. Management want you to run as fast as you can and get features in.

But what is happening while you are introducing new features to the code base you are also introducing technical debt. For every story completed you left behind debt.

Ask the room if in their environment they have technical debt. (Yet to have a no come back to this question.)

Now grab chairs from the sidelines and place them randomly in the gauntlet area to represent the technical debt. Place them purposefully to make running the gauntlet difficult.

Re-iterate to the runners that this is a simulation and the goal isn’t to game the system and win. Re-iterate that they are simulating a dysfunctional team and are not to communicate with each other (to collude).

Double re-iterate safety! No jumping the chairs. Please be sensible and careful!!!

Now run the second sprint. Again take on the role of pushy manager and include in your taunts : –

-   why have things slowed down?
-   you developers are useless
-   why are your estimates wrong?
-   etc

Take the velocity of the second sprint.

e.g. Sprint 2 – 10

Note – it actually takes putting quite a few chairs in the gauntlet to impact velocity in this sprint. I usually put in 10-15.

**Sprint 2a – Legacy system (but don’t run this sprint as it’s too dangerous)**

Have the runners reset their boards for the next sprint.

While they do this – place more chairs in the gauntlet while explaining to the room “for every story you get done, you are adding more technical debt”.

Make the gauntlet almost impossible. Now speak to the room about this is how you create a legacy system. You leave debt behind on top of debt.

Point out to the managers in the room that this is what it is like for a developer. To come in and face a messy codebase and be expected to add value to the system every sprint without ever having time to clean it up.

Ask the room if the gauntlet is now representative of their codebase and running it representative of their job.

Ask them what they think will happen to velocity for this sprint. Ask them what they think will happen if they keep going forward in this way.

Do not run an iteration under these conditions – it is now too dangerous. You will break things (just as you break the code when you try to add new features to a legacy system).

Instead we are going to find a solution…

**Sprint 3 – Introduce refactoring and find what their sustainable pace is**

The new rule for this iteration is – refactoring.

For each story that you work on you are allowed to do some refactoring – cleaning up of the codebase. This is represented by being able to move one chair out of the gauntlet for each story you are working on.

You will also no longer run – but walk. We need to find a sustainable pace and we need to move more purposefully and carefully.

Walk, don’t run.

Go!

During this sprint the facilitator can call out management stressors like :-

-   who said they could refactor?
-   why are they pair programming?
-   what is this nonsense?
-   we are doomed if they work at this pace!
-   we don’t need refactoring, we need features!

At the end of the sprint record the velocity and have everyone return to their seats for the post exercise discussion.

**Management Abuse to shout at game players**

•Faster!

•I need more features!

•What is wrong with this team?

•Why are they so slow?

•Why are your estimates all wrong?

•More velocity!

•Development monkeys!

•Screw code practices – I need Features!

•Stop that pair programming nonsense!

•My last team was better than you guys

•Don’t make me fire you

•I should out source the lot of you

•Run, run, run!

•Lazy coders!

•I’m paying you too much!

•There’s going to be overtime!

**Post Exercise Discussion**

At this point your velocity will look something like :-

Sprint 1 – 14

Sprint 2 – 12

Sprint 3 – 8

Now talk about what the numbers mean.

Sprint one represents what happens when companies take on Scrum. They become excited about the ability to get things done quickly. Because Scrum does not include any technical practices the usual pattern is to ignore them but now the Product Owner and business is used to a certain cadence of delivery. What they don’t realize though is that it is not sustainable and they are incurring a debt with compounding interest. i.e Technical Debt

Sprint two represents what happens over time as the debt starts to build up. You are ignoring the agile principle (behind the Agile Manifesto) of :-

> Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.

Sprint three represents

 **Overview:**

A quick and easy demonstration/game to illustrate why an agile team needs to do refactoring and the related XP Practices in addition to Scrum. It never fails to create the A-HA moment for a team and team management as to why, when and how to do refactoring.

 **Learning Points:**

Scrum without XP will lead to technical debt and ultimately a legacy system.

 **Timing**: 30-40 minutes including prep and debrief

 **Materials:** Tools, supplies and environment

You will need an area/room where you can clear a game area we will call the gauntlet. Gauntlet area needs to be 15-30 feet long and 6-10 feet wide. Typically I find myself in a room where you just shove the tables and chairs out of the way to clear this space. Keep the chairs nearby as you will need them.

In addition to the space you will need :

-   Volunteers (7-12 volunteers)
-   Two opposing walls and two easels or use two easels in place of wall plus two more easels
-   Chairs (observers can give up theirs while watching if need be)
-   Sticky notes (small square size is better but any will work)
-   Flipchart (Sticky is best)
-   Blue tape
-   Something with a countdown timer (smartphone apps work)
-   Three surfaces for flipchart sheet. E.g. walls, whiteboard, easel
-   Marker pens to write on flipcharts (and whiteboard)

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5168"><figcaption class="wp-caption-text">Requirements</figcaption></figure>

**Instructions:**

**Volunteers and Roles**

You need 7-12 volunteers. Ask for volunteers with warning that it is a physical demonstration and there will be running. Do not volunteer unless comfortable with this.

Divide the volunteers into testers and developers using one of these formations depending on the number of volunteers

• 10 devs and 1 or 2 testers

• 8 devs and 1 or 2 testers

• 6 devs and 1 or 2 testers

Divide devs into two even groups

Have everyone in the room clear a space for the gauntlet and place one dev group at each end of the gauntlet in front of a To do/ To Test kanban board

<figure class="wp-caption alignleft" aria-describedby="caption-attachment-5174"><figcaption class="wp-caption-text">To Do / To Test</figcaption></figure>

Populate the TO DO portion of the board with sticky notes as shown.

You will need around 20.

(These empty notes represent a task or story.)

Place the tester(s) at the mid point of the gauntlet in front of the done board/flip chart/easel.

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5181"><figcaption class="wp-caption-text">Done</figcaption></figure>

Your gauntlet area should look something like this …

<figure class="wp-caption alignnone" aria-describedby="caption-attachment-5187"><figcaption class="wp-caption-text">Gauntlet game area layout</figcaption></figure>

Timer volunteer – (Can be the facilitator if no-one else volunteers). This person will need to have an app or device that has a 30 second countdown timer.

Explain to participants that this is a simulation. The goal is not to “win” and game the system. The goal is to mimic what real life looks like

Instruct participants to act like a dysfunctional team and not communicate with each other (otherwise they start gaming the system)

They should all be in their locations as below

**The Rules**

-    An iteration lasts 30 seconds
-   Developers run to opposite wall, pick a story token (sticky note) from TODO and run back to their starting wall, placing the token in the TO TEST column
-   A Dev can only work on one story at a time
-   Testers wait by their Done board until they see stories ready to TEST and then run to (either) board, grab up to 3 stories (but no more than 3) and return them to their done board
-   Everyone must run (That is why they call it Sprinting!)
-   No collusion or working out a system. You are mimicking a dysfunctional team (Be sure to have explained this or else they game the system)
-   Each sprint (except for the first) you count the number of post-it notes in the done area(s) and that is the velocity for the sprint.
-   Make sure to run a sprint zero without measuring velocity. That is the practice sprint to ensure everyone understands the rules. (Velocity always goes up after this sprint so don’t measure it.)
-   BE CAREFUL!!! (Re-iterate and ask volunteers again if comfortable)

**BE CAREFUL!**

•Health and safety

•Don’t have anyone pregnant, wearing high heels or with physical disabilities that may cause risk to themselves or others in the volunteers

•Make sure volunteers are comfortable with exercise otherwise switch out

•Re-iterate to volunteers Safety First!

•Be careful!!!

**Start!**

**Sprint 0 – Practice**

Run this 30 second iteration with taking the velocity. Correct any misunderstanding and assumptions that anyone may have.

(There is another reason for running a practice sprint is because without doing so, the velocity for the next sprint will go up even if you put more obstacles in. The reason I believe is because once they understand the game, they get better at it. So give them a grace understanding sprint.)

**Sprint 1 – Calibration**

The goal of this sprint is to find out what their Scrum velocity is. Let them run the gauntlet with no obstacles. At the end record the velocity which is how many tasks are in the Done areas.

e.g. Sprint 1 – 13

During the sprint the facilitator can play the role of a pushy manager and shout at the team. See below for examples of things to shout.

Ask the team if they feel puffed out / exhausted. Ask if they think they can sustain this pace?

Point out that in scrum they call an iteration a sprint for a reason… (joke)

Reset the boards for the next sprint.

**Sprint 2 – Introduce technical debt**

Describe to the room that what they have just seen is what happens in scrum. Management want you to run as fast as you can and get features in.

But what is happening while you are introducing new features to the code base you are also introducing technical debt. For every story completed you left behind debt.

Ask the room if in their environment they have technical debt. (Yet to have a no come back to this question.)

Now grab chairs from the sidelines and place them randomly in the gauntlet area to represent the technical debt. Place them purposefully to make running the gauntlet difficult.

Re-iterate to the runners that this is a simulation and the goal isn’t to game the system and win. Re-iterate that they are simulating a dysfunctional team and are not to communicate with each other (to collude).

Double re-iterate safety! No jumping the chairs. Please be sensible and careful!!!

Now run the second sprint. Again take on the role of pushy manager and include in your taunts : –

-   why have things slowed down?
-   you developers are useless
-   why are your estimates wrong?
-   etc

Take the velocity of the second sprint.

e.g. Sprint 2 – 10

Note – it actually takes putting quite a few chairs in the gauntlet to impact velocity in this sprint. I usually put in 10-15.

**Sprint 2a – Legacy system (but don’t run this sprint as it’s too dangerous)**

Have the runners reset their boards for the next sprint.

While they do this – place more chairs in the gauntlet while explaining to the room “for every story you get done, you are adding more technical debt”.

Make the gauntlet almost impossible. Now speak to the room about this is how you create a legacy system. You leave debt behind on top of debt.

Point out to the managers in the room that this is what it is like for a developer. To come in and face a messy codebase and be expected to add value to the system every sprint without ever having time to clean it up.

Ask the room if the gauntlet is now representative of their codebase and running it representative of their job.

Ask them what they think will happen to velocity for this sprint. Ask them what they think will happen if they keep going forward in this way.

Do not run an iteration under these conditions – it is now too dangerous. You will break things (just as you break the code when you try to add new features to a legacy system).

Instead we are going to find a solution…

**Sprint 3 – Introduce refactoring and find what their sustainable pace is**

The new rule for this iteration is – refactoring.

For each story that you work on you are allowed to do some refactoring – cleaning up of the codebase. This is represented by being able to move one chair out of the gauntlet for each story you are working on.

You will also no longer run – but walk. We need to find a sustainable pace and we need to move more purposefully and carefully.

Walk, don’t run.

Go!

During this sprint the facilitator can call out management stressors like :-

-   who said they could refactor?
-   why are they pair programming?
-   what is this nonsense?
-   we are doomed if they work at this pace!
-   we don’t need refactoring, we need features!

At the end of the sprint record the velocity and have everyone return to their seats for the post exercise discussion.

**Management Abuse to shout at game players**

•Faster!

•I need more features!

•What is wrong with this team?

•Why are they so slow?

•Why are your estimates all wrong?

•More velocity!

•Development monkeys!

•Screw code practices – I need Features!

•Stop that pair programming nonsense!

•My last team was better than you guys

•Don’t make me fire you

•I should out source the lot of you

•Run, run, run!

•Lazy coders!

•I’m paying you too much!

•There’s going to be overtime!

**Post Exercise Discussion**

At this point your velocity will look something like :-

Sprint 1 – 14

Sprint 2 – 12

Sprint 3 – 8

Now talk about what the numbers mean.

Sprint one represents what happens when companies take on Scrum. They become excited about the ability to get things done quickly. Because Scrum does not include any technical practices the usual pattern is to ignore them but now the Product Owner and business is used to a certain cadence of delivery. What they don’t realize though is that it is not sustainable and they are incurring a debt with compounding interest. i.e Technical Debt

Sprint two represents what happens over time as the debt starts to build up. You are ignoring the agile principle (behind the Agile Manifesto) of :-

> Agile processes promote sustainable development. The sponsors, developers, and users should be able to maintain a constant pace indefinitely.

Sprint three represents
