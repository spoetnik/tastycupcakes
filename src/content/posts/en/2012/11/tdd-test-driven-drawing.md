---
title: "TDD: Test Driven Drawing"
slug: tdd-test-driven-drawing
permalink: /2012/11/tdd-test-driven-drawing/
lang: en
description: >-
  Timing: 30 minutes Materials: Preferably an even number of players as they play in pairs, but you
  can have one team of 3. Each team needs 4 sheets of paper and pens. One of these sheets of paper
  needs a number of basic shapes drawn on them in a fairly simple layout. For example the shape
date: "2012-11-07T22:18:53+00:00"
dateSource: meta
updated: "2012-11-07T22:21:10+00:00"
author: simon-morris
categories:
  - agile
  - development
tags: []
featuredImage: null
draft: false
wordpress:
  id: 2664
  sourceFile: output/2012/11/tdd-test-driven-drawing/index.html
  capture: modern
---

**Timing**: 30 minutes

**Materials:**

Preferably an even number of players as they play in pairs, but you can have one team of 3.

Each team needs 4 sheets of paper and pens. One of these sheets of paper needs a number of basic shapes drawn on them in a fairly simple layout.

For example the shape page could contain a circle containing a diamond, two squares and a rectangle.

If you want to be **really** prepared you could do them on a computer, if not just draw them. Have a couple of different layouts so the teams have different challenges.

**Instructions:**

Ask the group to form teams of two. In the team of two one person acts as the Product Owner, the other as a developer.

If you have a team of 3 you will have one Product Owner and two developers.

Inform the teams that they are going to embark on a new project that will last for 2 iterations.

Have the pairs sit back to back. Instruct the teams not to peek at each others paper that you are about to hand out.

Give the developer a sheet of blank paper. Give the Product Owner the sheet with shapes drawn on it.

Tell the teams that in the first 3 minute iteration the Product Owner must describe the product the developer is going to build (or draw!!). Confirm that the Product Owners can describe the shapes, the layout and everything they want to verbally.

Start the iteration and watch the Product Owners try and describe the shapes to the developers. Lots of conversation should ensue.

Stop the first iteration and ask the teams to remain sitting back to back. Do not look at each others paper just yet.

The Product Owners now have 2 minutes to write 4 “tests” on a fresh sheet of paper. The tests might read:

-   There are 2 trianges, 2 circles and a square on the paper
-   One triangle contains a circle
-   One circle overlaps the lower edge of the square
-   The triangle that does not contain a circle is in the lower right corner

When we ran this exercise we had some AWFUL tests

-   It all looks right
-   The triangle has 3 sides (!!!)

But that might be quite realistic for some teams.

The first iteration is now over – the Product Owner and Developer can now compare notes and see how well they did.

It’s now time for the second iteration. The Product Owner keeps the tests he wrote and the developer moves to another team (i.e. Product Owners sit still, Developers swop seats)

In the second iteration with a new team the Developer receives a set of tests to work from. Get the teams sitting back-to-back and start the iteration.

The Product Owner is still giving instructions but they can be validated against the tests the developer has.

**Learning Points:**

A Product Owner can describe features with different levels of success. However, no matter how good the description is there are different interpretations of what is required.

Having some guidance with tests gives the developer constraints to work with and the final result is going to be better.

There is also a good discussion to be had about good and bad styles of tests.
