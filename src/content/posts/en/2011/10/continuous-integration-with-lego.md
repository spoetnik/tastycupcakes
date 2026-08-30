---
title: Continuous Integration with LEGO
slug: continuous-integration-with-lego
permalink: /2011/10/continuous-integration-with-lego/
lang: en
description: >-
  This activity teaches continuous integration concepts and value without resorting to code, a
  continuous integration server, or any hardware or software.
date: "2011-10-06T14:46:40+00:00"
dateSource: meta
updated: "2017-08-14T13:18:24+00:00"
author: doc-list
categories:
  - games
  - agile
  - development
tags:
  - continuous-delivery
  - continuous-integration
  - lego
featuredImage: null
draft: false
wordpress:
  id: 1726
  sourceFile: output/2011/10/continuous-integration-with-lego/index.html
  capture: modern
---

This activity was designed to teach continuous integration concepts and value without resorting to code, a continuous integration server, or any hardware or software.  While the participants will experience some frustration in trying to complete the activity, they will also have a great deal of fun and will learn.

## **Timing**:

-   Prep time: 30 – 60 minutes
-   Execution time: 45 – 60 minutes

## **Materials:**

## One set of LEGO per team. Each set should include the necessary pieces to build a cube (see images in ZIP file) plus some random pieces. You can include base pieces or not. I don’t, because it adds to the challenge and the fun, having them figure out how to make the pieces stick together. Include at least a few flat pieces in each set, though, because it’s almost impossible without.

## **Instructions:**

The participants should be divided into project teams that have between 4 and 8 people (smaller teams are preferable). Each project team should have two halves, call them left half and right half. Each half will have between 2 and 4 people. There should be as many project teams as necessary to include all participants.

> Say you have 15 participants in the room (typical size). Since it’s an odd number, some grouping(s) will be off-by-one (which is acceptable). Here are the sizes of the various groupings:

> Room = 15 people
> Project Team = 5 people (3 project teams in room)
> Left Half: 3 people
> Right Half = 2 people
>
> Here’s another way to split 15 people:
>
> Project Team: 7 or 8 people (2 project teams)
> Left Half: 4 people
> Right Half: 3 or 4 people
>
> With a group of 10 people:

> Project Team: 5 people (2 project teams)
> Left Half: 3 people
> Right Half: 2 people

This exercise will be done in two rounds. In round one (The Waterfall Way), the halves of each project team will build a specific object, using LEGO, based on a set of “specs” – three pictures of their finished “subsystem.”

In round two (Continuous Integration), the halves of each project team will build the same object, but in iterations, performing integration at the end of each iteration.

Both rounds lead to the same goal: at the end of the round, the two subsystems fit together cleanly to create the final “system.”

The pictures below reflect the finished “system.”

<figure class="gallery-item"><div class="gallery-icon landscape"><a href="/2011/10/continuous-integration-with-lego/finished-cube-real-1/"><img alt="" src="/media/2011/10/finished-cube-real-1.jpg" decoding="async" width="800" height="533"></a></div></figure>

<figure class="gallery-item"><div class="gallery-icon landscape"><a href="/2011/10/continuous-integration-with-lego/finished-cube-real-2/"><img alt="" src="/media/2011/10/finished-cube-real-2.jpg" decoding="async" loading="lazy" width="800" height="533"></a></div></figure>

<figure class="gallery-item"><div class="gallery-icon landscape"><a href="/2011/10/continuous-integration-with-lego/finished-cube-real-3/"><img alt="" src="/media/2011/10/finished-cube-real-3.jpg" decoding="async" loading="lazy" width="800" height="533"></a></div></figure>

<figure class="gallery-item"><div class="gallery-icon landscape"><a href="/2011/10/continuous-integration-with-lego/finished-cube-real-4/"><img alt="" src="/media/2011/10/finished-cube-real-4.jpg" decoding="async" loading="lazy" width="800" height="533"></a></div></figure>

## The Waterfall Way (Round One)

Each half of each project team (left and right) receives their specs, and is given 3 minutes to look over their LEGO and to discuss what they’re going to build.

Left Half builds the object specified in the set of specs named left-finished-xxx.pdf.

Right Half builds the object specified in the set of specs named right-finished-xxx.pdf.

-   Neither pair gets to see the other pair’s specs
-   Neither pair gets to see the other pair’s work in progress
-   Both pairs first get to see the other pair’s “subsystem” when both pairs are done
-   When both pairs are done, they will try to fit their subsystems together
-   They will make modifications until they are successful
-   Record the time when both pairs first say they’re done, and then record the time it takes to get the two subsystems to fit together (_build time, integration time, total time_)
-   You will probably need to get the pairs or project teams to track their own times, depending on the size of your group
-   Expect that the teams will not finish simultaneously, so track the time _per team_ for build
-   Expect that the two subsystems will not fit together properly – let them struggle with deciding which team should make which modifications
-   Encourage them to talk about the “specs” and figure out how to get the subsystems to fit together properly
-   Hopefully, this will be somewhat painful and frustrating for them

## The Agile/Continuous Integration Way (Round Two)

As with the Waterfall examples, the project teams will be divided into two halves.

This exercise will be conducted in five iterations.

Before starting this second half, give the following instructions:

> Please completely disassemble your systems down to individual blocks, and return the blocks to their buckets/boxes/bags.
>
> Members of each left half, please get up and trade places with the right half of your project team.
>
> For the second part of this exercise, you have now switched – left halves have become right halves, and right halves have become left halves.

> For each iteration, there is a set of specs that incrementally add to the previous iteration’s results.

Iteration one is very simple – just a flat rectangle – in order to get them accustomed to building and working together in pairs, plus giving them their first experience of continuous integration with an easy one that can’t fail.

**_Before starting this exercise, have the pairs switch – that is, Pair Left becomes Pair Right and vice versa._**

Each Iteration follows the same pattern:

1.  Receive specs
2.  2 minutes to review and discuss specs
3.  Build (they will record the time to build)
4.  Integrate (they will record the time to integrate)

Instructions are the same as for the first exercise:

-   Neither pair gets to see the other pair’s specs for each iteration
-   Neither pair gets to see the other pair’s work in progress during an iteration
-   Both pairs first get to see the other pair’s “subsystem” when both pairs are done in each iteration
-   When both pairs are done, they will try to fit their subsystems together at the end of the iteration

At the end, they will total their build and integration times.

**Learning Points:**

_There is a bug in the specs. In the waterfall first round, the two halves cannot come together without a couple of tweaks. The same is true in round two, but they should get there more quickly._

-   While it is expected that each Integration stage will take a bit longer than the last in round two, each should still be pretty quick
-   One or more teams will not complete their cubes during round one. This is an opportunity for learning.
-   Some may not finish in round two, but that’s less likely.
-   Learning questions for the final debrief:
    -   Did your team feel more confident in the product you were delivering each iteration?
    -   How long was the integration phase in Waterfall compared to the total time spent in integration over the several XP iterations? (When overall time is roughly equal, this could be a key insight: XP teams have an easier time integrating even when the overall project timeline appears roughly identical to a waterfall Gantt chart)
    -   Were there any features that could not be delivered in Waterfall because integration was too difficult/costly, whereas in XP the same features were delivered successfully?

_**Handouts and the slide deck I use are here:**_

http://www.stevenlist.com/files/ciwithlego/continuous-integration-with-lego.zip
