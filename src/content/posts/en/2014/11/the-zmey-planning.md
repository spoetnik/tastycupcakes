---
title: The Zmey Planning
slug: the-zmey-planning
permalink: /2014/11/the-zmey-planning/
lang: en
description: >-
  Zmey is a popular dragon form the Slavic mythology with three heads, wings and a snake's body. It
  personifies evil and often demands tribute from villages or small towns in the form of gold. In an
  attempt to defeat the Zmey and relieve the people from this odious creature many legendary heroes
  have lost their
date: "2014-11-25T09:38:32+00:00"
dateSource: meta
updated: "2015-04-30T08:58:41+00:00"
author: stavros-stavru
categories:
  - games
  - agile
  - development
  - project-management
tags: []
featuredImage:
  src: https://www.agify.me/wp-content/uploads/2015/03/The-Zmey-Planning-Estimation-Coins.png
  alt: The Zmey Planning - Estimation Coins
  derived: true
draft: false
wordpress:
  id: 4399
  sourceFile: output/2014/11/the-zmey-planning/index.html
  capture: modern
---

Zmey is a popular dragon form the Slavic mythology with three heads, wings and a snake’s body. It personifies evil and often demands tribute from villages or small towns in the form of gold. In an attempt to defeat the Zmey and relieve the people from this odious creature many legendary heroes have lost their lives. So have software engineers. But in their case the Zmey ruins software estimates and brings chaos to software schedules.
There might be many reasons why software estimates are so inaccurate. The presented estimation and planning technique focuses on three major ones. The first is **complexity**. It is defined by: (1) the difficulty of the problem to be solved (e.g. data complexity, decisional / branching complexity, etc.); (2) the impact on existing functionality; (3) the presence of non-functional requirements (aka. quality attributes); and (4) the existing level of technical debt (incl. feature creep and code bloat). The second one is related to **uncertainty**. It is measured by: (1) the need of knowledge creation (or gaining new skills and qualifications); (2) the uniqueness / variability / diversity of the requested change (or the need for creativity and innovation); (3) the presence of business, management or other type of social pressure; (4) the expected level of dynamicity (e.g. tasks switching / interruptions / hands-off, intensity of expected communication, etc.); (5) the presence of dependencies (e.g. 3-rd party integrations, distributed environments / teams, etc.); and (6) anticipated obstacles and impediments (e.g. problems with the used software engineering tools, working environments, etc.). The last concern is the **vagueness** of the requirements. It represents quality characteristics as: (1) correctness (or targeting a real business need); (2) completeness (or covering all aspects of the requested change – preferably documented into one place); (3) clarity (or specifying what is needed in an unambiguous and not confusing way); (4) consistency (or being aligned with already existing functionality and/or other requirements); and (5) testability (or specifying concrete acceptance criteria).
Complexity, uncertainty and vagueness are actually the **three heads of the Zmey**. They often tyrannize software engineers and make their estimating and scheduling efforts doomed to fail. The presented estimation and planning technique _could be used to determine the tribute demanded by the Zmey_ (aka the **zmey tax**) _and identify possible actions for minimizing its detrimental impact on software estimation and scheduling_. But remember – you could never relieve yourself from the Zmey. Even if you chop off his heads they would quickly re-grow for your next estimation and scheduling endeavor.

**Timing**
The timing should be similar to other estimation techniques as Planning poker, Table sorting, Ouija board estimation, etc. The major difference is that the Zmey Planning determines the complexity of the problem to be solved, the level of uncertainty and the vagueness of requirements in addition to the size (or the effort estimate) of the story.

**Materials**
Special **estimation coins** are used to represent the gold demanded by the Zmey. A simple format of these coins is given below (and could be downloaded here). The observe states “zmey” while the reverse represents value. There are five possible values: **0**; **1**; **2**;**5**; and **10**.

![The Zmey Planning - Estimation Coins](https://www.agify.me/wp-content/uploads/2015/03/The-Zmey-Planning-Estimation-Coins.png)

**Scales**
The Zmey Planning uses 5-point Likert scale to assess the complexity, uncertainty and vagueness of a given story. Possible rates are **Minimal**, **Low**, **Medium**, **High** and **Extreme** (but they might be changed to reflect the individual preferences of the participants). Still the rates should be differentiated from story points and ideal days. The latter represents effort estimates while the former evaluates complexity, uncertainty and vagueness. The scale is reflected on the reverse of the coin (see the format given above). The mapping between rates and values is Minimal = 0, Low = 1, Medium = 2, High = 5 and Extreme = 10.

**Estimating**
The presented technique is based on the Wideband Delphi method. It includes the following steps:

1.  **Present the story** to be estimated.
2.  **Distribute estimation coins** so each participant has at least 15 – 3 of each value (e.g. 3×0, 3×1, 3×2, 3×5 and 3×10).
3.  Ask participants to **anonymously rate the complexity of the story** and put their respective coins on the table with the reverse faced down (so their value is not visible to others). The coins should be simultaneously turned over when everybody is ready. Invite the participants with the highest and lowest numbers to justify their rates and initiate a discussion. Give all a second chance to switch their coins.
4.  Repeat Step 3 for **uncertainty** and **vagueness**.
5.  Pile the coins in the middle of the table. Calculate the **zmey tax** by dividing the total sum of these coins by the number of participants. Then ask participants **whether the tribute to the Zmey is too high**? Invite them to make a decision through voting. If the zmey tax is too high (e.g. is above a predefined threshold) – reject the story and ask participants to decide **who would fight the Zmey** (and become a legendary hero)? The goal is to reduce the complexity, uncertainty and vagueness of the rejected story (e.g. through breaking it down into smaller stories, carrying out an analysis or building a spike, reducing technical debt through refactoring, improving the quality of provided requirements, etc.). If the tax is below the threshold continue with Step 7.
6.  Use any consensus-based estimation technique to **determine the efforts to develop and deliver the story**. _Alternatively you could use the zmey tax to measure the velocity of the team (as a unit of work)_.

In summary:
– The zmey tax represents the tribute demanded by the Zmey and could be used to **formally reject a story** (if the zmey tax is above a predefined threshold);
– The technique requires participants to take **ownership and carry out actions** to reduce the complexity, uncertainty and vagueness of rejected stories;
– The technique assumes that by evaluating the complexity, uncertainty and vagueness of a story, participants would give **more accurate estimates**;
– The zmey tax could be used for **risk management**.

**Planning**
The presented technique could be **used for planning** as well. There are various planning strategies which could be incorporated:
– Correlate the zmey tax with the relative estimation error. Then use the correlation to **determine contingencies and buffers**. The drawback of this strategy is the need of historical data;
– **Adjust the story estimate** to reflect the zmey tax. You might use a progressive taxation. For example let’s assume that the story estimate is X hours and the zmey tax is Y (0 <= Y <= 10). Then the adjusted story estimate would be (1 + Y/10) \* X hours. The disadvantage of this strategy is the introduction of a new control knob (which is not a recommended practice);
– **Reduce the capacity of the team** based on the averaged tax demanded by the Zmey. The same progressive taxation might be used as in the previous strategy. In this case X is the capacity of the team (e.g. in ideal days) and Y is the averaged zmey tax of the stories in the targeted period. Then the adjusted capacity would be (1 – Y/10) \* X days;
– **Measure velocity** in zmey tax (instead of story points). In this case you should use different values for the estimation coins – e.g. 1, 2, 3, 5 and 8 (following the popular Fibonacci sequence). You might also call the zmey tax – zmey points or story coins (as tax is not appropriate in this case). Again there should be enough historical data before you could use this strategy effectively.

**Original article**: https://www.agify.me/the-zmey-planning/
