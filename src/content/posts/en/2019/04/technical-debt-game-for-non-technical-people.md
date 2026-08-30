---
title: Technical Debt Game – for non-technical people
slug: technical-debt-game-for-non-technical-people
permalink: /2019/04/technical-debt-game-for-non-technical-people/
lang: en
description: >-
  Experience the difference between doing continuous refactoring ... or not A game for groups from 3
  to 5 people. Setup: 5 minIntroduction: 5 minTwo rounds of each 5-10 min so approx. 10-20
  minDebrief: 5-15 min Purpose of the game: Explain and experience the effects and consequences of
  adding feature after feature and cummulating technical debt
date: "2019-04-20T13:14:00+00:00"
dateSource: meta
updated: "2019-04-20T13:42:19+00:00"
author: olaf-bublitz
categories:
  - games
  - agile
  - development
  - project-management
  - product
tags:
  - clean-code
  - product-management
  - product-owner
  - refactoring
  - software-craftsmanship
  - sustainable-development
  - technical-debt
featuredImage: null
draft: false
wordpress:
  id: 9368
  sourceFile: output/2019/04/technical-debt-game-for-non-technical-people/index.html
  capture: modern
---

## Experience the difference between doing continuous refactoring … or not

<figure class="aligncenter is-resized"><img alt="" src="http://tjr.a54.mywebsitetransfer.com/wp-content/uploads/2019/04/Title-660x491.png" decoding="async"></figure>

A game for groups from 3 to 5 people.
Setup: 5 min
Introduction: 5 min
Two rounds of each 5-10 min so approx. 10-20 min
Debrief: 5-15 min

### Purpose of the game:

Explain and experience the effects and consequences of
adding feature after feature and cummulating technical debt or doing and investing in continuous refactoring.

### Background:

A team of developers has to add features (numbered cards) to a product (a stack of sorted cards). The product has to work correctly, that means all cards in the stack has to be sorted in ascending order and no doublettes are in it. For the correctness of the product/stack the quality assurance (QA) & of course the developers itself are responsible.

### Goal of the game:

_Deliver as fast as possible the error free product to the customer._

First place all the cards in the game area (development), then grab them to a stack (debugging and deployment). After a final quality check (debugging) deliver them to the customer (release).

### Rules

**§** Doublettes (two cards with the same number) are not allowed in the stack (product handed to the customer).

**§** The stack hast to be sorted in ascending order (lowest card on top).

**§** During development all cards has to be placed **strictly within** the game area.

### Material and Setup

You need cards with numbers from 1 to 100, plus up to 30 cards with doublettes. You can use two sets of “The Mind” Card game or print & cut out the attached PDF cards. From the complete set you can remove some cards to increase the unpredictability in the sorting process. Also add up to 30 doublettes cards. Shuffle the deck this will be your **_draw pile_** for the developers.

Define the roles: You need 2-3 (never tried it with 4) Developers and 1 QA and at least one observer/customer.

The **_game area_** for the development phase is 20 cm in height and 90 cm in length. You can use tape on a table or mark it on a flipchart. The size is the same as 3 DIN A4 paper side by side in landscape orientation.

<figure><img alt="" src="http://tjr.a54.mywebsitetransfer.com/wp-content/uploads/2019/04/GameArea-660x290.jpg" decoding="async" loading="lazy"></figure>

### Gameplay

Each round consists of 4 phases:

**Development**: Developers play cards from draw pile to the game area as fast as possible. Here try to get a good pre-sorting and throw out the doublettes (drop them out of the game area). You can use the game area in any way you like.
Measure the time for this phase and document it on a flipchart.
If the developer wants to plan a strategy, it is ok but time is ticking.
**Debug & Deploy**: One developer collects the (pre-sorted cards) cards to the final sorted stack as quick as possible.
Measure the also time for this phase and document it on a flipchart.
**QA & Debug:** QA checks the stack and throw out doublettes and reorder wrong cards. Also document the amount of errors.
**Release:** Hand over to the customer (one of the observers or the facilitator). He can finally check (again) the correctness of the product.
Also document the amount of errors.

You will play the same setting in **two rounds**:

**1st round without refactoring**. Here each card played on the game area during development phase must not be touched until deployment. The has the the consequence that every card has to be placed above the existing cards on the table. It will be hard to keep a good overview, but you have to develop features fast and there is no time to touch and clean up the existing code! (Sounds familiar?!)

**2nd round with continuous refactoring.** In this round every card placed on the table should result in a clean up of the other cards, so the developers has the possibility to rearrange all the cards in the game area as they like. Think about the following deployment phase. If you are smart here, you will get the deployment/stacking **very quick**!

### Debrief

After the two rounds compare the times and amount of errors.

Then make a debrief, how this setting is comparable to your own situation at work. Especially the relationship between sponsors, product management and product development.

**_Have fun!_**

### Credits

Martin Heider, Falk Kühnel, Michael Tarnowski, and me Olaf Bublitz

Special regards to Play4Agile for the wonderful inspiring people & environment.

#### Attachments:

-   <figure><img data-link="https://web.archive.org/web/20241206135323/http://tjr.a54.mywebsitetransfer.com/?attachment_id=9379" alt="" src="http://tjr.a54.mywebsitetransfer.com/wp-content/uploads/2019/04/TechnicalDebtGame_Thumb-660x645.jpg" decoding="async" loading="lazy"><figcaption>Instructions OnePager</figcaption></figure>

-   <figure><img data-link="https://web.archive.org/web/20241206135323/http://tjr.a54.mywebsitetransfer.com/?attachment_id=9380" alt="" src="http://tjr.a54.mywebsitetransfer.com/wp-content/uploads/2019/04/Stack-495x660.jpg" decoding="async" loading="lazy"><figcaption>Cards to print PDF</figcaption></figure>

TechnicalDebtGame OnePagerDownload

TDGCards\_front\_2x5Download

TDGCards\_back\_2x5Download
