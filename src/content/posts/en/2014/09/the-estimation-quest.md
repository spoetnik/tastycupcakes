---
title: The Estimation Quest
slug: the-estimation-quest
permalink: /2014/09/the-estimation-quest/
lang: en
date: "2014-09-08T00:00:00.000Z"
dateSource: page
author: stavros-stavru
categories:
  - games
  - agile
  - project-management
tags: []
featuredImage:
  src: https://www.agify.me/wp-content/uploads/2015/03/The-Estimation-Quest-Template.png
  alt: The Estimation Quest - Template
  derived: true
draft: false
wordpress:
  id: 4251
  sourceFile: output/2014/09/the-estimation-quest/index.html
  capture: modern
---

Adventure is defined as a bold, usually risky undertaking with uncertain outcome. How close is this definition to software estimation? I would say there are almost identical. The only difference is that adventure is more often exciting and enjoyable while software estimation is mainly tedious and frustrating. The main purpose of this exercise is: (1) _to lead the participants through some of the most popular estimation methods and techniques_ used to predict efforts (cost) in software engineering; and (2) _demonstrate the major principles and patterns of software estimation_. As such it should be a **peculiar quest in the world of software estimation**. I believe an adventurous one!

**Timing**
The timing largely depends on the number of software estimation methods and techniques covered as well as the thoroughness of explanation and discussion of different software estimation principles and patterns.

**Materials**
Papers, pens and calculators. Scales would be also needed as participants would be estimating body weights.

**Introduction**
Give paper, pen and calculator to each of the participants. Ask them to draw a table using the template given below. The number of the columns with empty headlines should be (N – 1) where N is the number of participants. If you would like to save some time you could prepare printed versions of the template beforehand.

![The Estimation Quest - Template](https://www.agify.me/wp-content/uploads/2015/03/The-Estimation-Quest-Template.png)

Get a list of participants’ names and ask participants to use these names as the headlines for the rest of the columns (skipping their own name and following the order from your list). The name of the participant should be written in the “Estimator” field above the table.
Example: Let’s say there are 3 people participating in the exercise – Jennifer, Oscar and Elizabeth. Then Jennifer’s table should look like (changes are grayed out):

![The Estimation Quest - Introduction](https://www.agify.me/wp-content/uploads/2015/03/The-Estimation-Quest-Introduction.png)

**I. Assignment One**
Give the participants the following assignment:

> Imagine you were sailing around the world with the rest of the participants. It was a wonderful journey up until you were caught in an ocean storm. Although it wasn’t so strong things quickly went wrong and the ship started sinking. In the panic you fall overboard and after some wrestle with the waves you lost consciousness. You woke up in a helicopter of the Coastal Rescue Service. The pilot said that you had been rescued and that they need your assistance in order to rescue the rest of the people. He then asked you “Could you tell us how many people were there on the ship? We need their total body weight in kilograms in order to send a safety boat to rescue them! But be careful – we need the total body weight to be as much accurate as possible! The acceptable range of error is between -10% and +10%. Otherwise the safety boat would be too light or too heavy and would eventually keel over and sink!”

Therefore each participant is an estimator and has to estimate the body weights of the rest of the participants.

**II. Individual Absolute Estimation**
In this phase each estimator should individually estimate the body weights of the rest of the participants in absolute values. The following estimation techniques might be used:
1) **Single-Point Estimation**: Estimates should be given as a single absolute value (e.g. 72 kilograms).
2) **Range Estimation**: Estimates should be given as a range of absolute MIN (Best Case) and MAX (Worst case) values (e.g. between 70 and 80 kilograms). Also a most likely estimate LIK should be provided (e.g. 64 kilograms). Then the following formulas might be used to calculate the actual absolute estimates:
– _Averaged Estimate_: Actual Estimate = (MIN + MAX) / 2.
– _Pessimistic Averaged Estimate_: Actual Estimate = (MIN + P\*MAX) / ( P + 1), where P is an integer (pessimistic factor), used to compensate the prevailing optimism in software estimation (e.g. for the purpose of this exercise you might use P = 2).
– _PERT_ (_Program Evaluation and Review Technique_) Estimate: Actual Estimate = (MIN + 4\*LIK + MAX) / 6 – _Pessimistic PERT_ Estimate: Actual Estimate = (MIN + 3\*LIK + 2\*MAX) / 6.
3) **Decomposed / Recomposed Estimation**: Estimates should be decomposed (e.g. product / function-based, activity-based, etc.) and then recomposed to form the actual estimates. For the purpose of this exercise estimates might be decomposed to head, torso and limbs.
– _Single-Point Estimation_: Estimates for the head, torso and limbs should be given as single absolute values. Then they should be summed up to form the actual estimate of the body weight: Actual Estimate = Head Estimate + Torso Estimate + Limbs Estimate.
– _Range Estimation_: MIN, MAX and LIK estimates should be given for the head, torso and limbs. Then the following formula (known as the Simple Standard Deviation Formula) might be used to calculate the actual estimate of the body weight: Actual Estimate = Sum of LIK + (C \* (Sum Of MAX – Sum of MIN) / 6), where C is the percentage confident (e.g. for 75% confidence – C = 0.67, for 90% confidence – C = 1.28).
…
n) **Combined Estimation**: Estimates are calculated based on the estimates provided through various estimation techniques. Given the ones above: Actual Estimate = Sum of estimates / Number of used estimation techniques.

With the completion of this phase the absolute estimates on each row should be summed up and written down under the “Sum” column (representing the total body weight of the rest of the participants).
Example: Jennifer’s table should now look like (changes are grayed out):

![The Estimation Quest - Individual Absolute Estimation](https://www.agify.me/wp-content/uploads/2015/03/The-Estimation-Quest-Individual-Absolute-Estimation.png)

**III. Group Absolute Estimates**
As part of this phase participants should give a collective absolute estimates. This could be achieved through different estimation techniques, including:
1) **Aggregation** (of individual estimates): Actual Estimate = Sum of individual estimates / Number of individual estimates. For the purpose of this exercise you might use the combined individual estimates given in the previous phase.
2) **Consensus-Based Estimation**: To keep the exercise short you might try only one of the following consensus-based estimation techniques:
– _Wideband Delphi_: The facilitator might play the role of the coordinator. You might also need a whiteboard where to write down the individual estimates and let the participants revise / discuss / update these estimates.
– _Planning Poker_: The facilitator might play the role of the moderator. As the standard planning poker card decks are not applicable you might collect the individual estimates in person and then write them down publicly on a whiteboard for further discussion.

When the group absolute estimates are given, these should be written down on participants’ table and summed up to form the total body weight.
Example: Jennifer’s table should now look like (changes are grayed out):

![The Estimation Quest - Group Absolute Estimates](https://www.agify.me/wp-content/uploads/2015/03/The-Estimation-Quest-Group-Absolute-Estimates.png)

**IV. Break**
Announce a break for X minutes with a concrete purpose (e.g. having breakfast / lunch, do a number of paper planes, etc.). Then observe how the participants are spending their time. Look for the manifestation of:

-   The Parkinson’s law (is the break taking exactly X minutes and no less)?
-   The Hofstadter’s law (is the break taking more than X minutes, although you’ve added a buffer of Y minutes for delays)?
-   The Goldratt‘s Student syndrome (is the purpose of the break fulfilled by some participants in the last possible minute)?

**V. Assignment Two**
Continue with the following assignment:

> You gave the total body weight to the pilot and then he said “I see you don’t feel very comfortable with the estimates you’re giving. Let’s try something else. Could you specify the clothing sizes of the people. More specifically we need to know whether they wear XS, S, M, L, XL or XXL sized shirts. Then we could use a specific algorithm to calculate the optimal capacity of the safety boat. I believe it would be easier for you. Could you do this for us?”

You might use different algorithms to calculate a numeric representation of the total body weight from the clothing sizes. One possible approach would be to map XS, S, M, L, XL and XXL with 1, 2, 3, 4, 5 and 6.
Example: Let’s say Jeniffer’s estimates are L for Oscar and M for Elizabeth. Then the total body weight of Oscar and Elizabeth would be: Total Body Weight = 5.

**VI. Individual and Group Relative Estimates**
In this phase each participant should individually estimate the clothing sizes of the rest of the participants. Then you might use any of the consensus-based estimation techniques introduced above to get the collective clothing size estimates.
Example: Jeniffer’s table might look like (changes are grayed out):

![The Estimation Quest - Individual and Group Relative Estimates](https://www.agify.me/wp-content/uploads/2015/03/The-Estimation-Quest-Individual-and-Group-Relative-Estimates.png)

**VII. Estimate Accuracy**
Get the actual body weights and clothing sizes of all of the participants. Then for each row on participants’ table calculate the estimate accuracy. You could use different formulas to measure estimate accuracy:
1) **Ratio measures**: Estimate accuracy is measured as a ratio between the estimated (EST) and the actual (ACT) values. The most commonly used ratio measure for estimate accuracy is the _relative error_ (RE): Relative Error = (ACT – EST) / ACT. A popular variation of the relative error is the Relative Percentage Error of Residues (RPER): RPER = ((EST – ACT) / ACT)\*100.
2) **Difference measures**: Estimate accuracy is measured by the difference between the estimated (EST) and the actual (ACT) values. The most commonly used difference measure for estimate accuracy is the _absolute error_ (AR): Absolute Error = ACT – EST.
For the purpose of this exercise you might calculate RPER. Once this is done you could identify the most efficient expert judgment estimation techniques and further discuss their applicability. Furthermore you might check whether each participant has provided a +/- 10% accurate estimate for the total body weight of the rest of the participants (and thus rescued the rest of the survivors of the shipwreck).
Example: Jeniffer’s table might look like (changes are grayed out):

![The Estimation Quest - Estimate Accuracy](https://www.agify.me/wp-content/uploads/2015/03/The-Estimation-Quest-Estimate-Accuracy.png)

**VIII. Assignment Three**
Finish with the following assignment:

> Great! The safety boat has now rescued the rest of the people and the mission is successfully completed… But wait a minute! What about the captain! I’m afraid we’ve missed the captain! We should go back with the helicopter and try to rescue him. But then… I’m afraid we need his body weight and clothing size. I hope it would be much easier for you now, when you have the actual body weights and clothing sizes of the rest of the people. Probably you could base your
> estimates on this knowledge?

The captain is the facilitator of the exercise. Now each estimator has to give an absolute and relative estimate for the body weight of the facilitator.

**IX. Analogy-Based Estimates**
In this phase the estimator should use analogy-based estimation to determine the body weight of the estimator: The following estimation techniques might be used:
1) **The Closest Match Estimation**: The estimator should find out the participant whose body weight / clothing size B is closest to the one of the facilitator and rate this closeness C (e.g. as a positive or negative percentage). Then the absolute estimate is: Actual Estimate = B + (B \* C). As for the relative estimate the estimator might give the one of the closest match.
2) **The Sorting Estimation**: The estimator should sort the rest of the participants based on their actual body weight / clothing size. Then the facilitator should be inserted into that sorted list. The body weights / clothing sizes of the participants on the left L and on the right R side of the facilitator should be taken into account. For the absolute estimate the following formula might be used: Actual Estimate = L + R / 2. If you would like to be more accurate, you might define weights of closeness WL and WR (WL + WR = 1) and use the following formula: Actual Estimate = (WL\*L + WR\*R) / 2. As for the relative estimate, if both participants have the same clothing size, then the facilitator has the same size as theirs. If their clothing sizes are different the estimator might rate closeness again in order to determine which of both clothing size to use for the facilitator.
When all of the participants are ready with their analogy-based estimates the estimate accuracy should be calculated and compared to the expert judgment estimates given in the previous phases.

**Debrief**
Software estimation methods that could be hardly covered as part of this exercise are the parametric / formal / algorithmic / empirical ones (including software estimation techniques as COCOMO, COCOMO II, COSYSMO, COSMIC, WMFP, SEER-SEM, Monte Carlo Simulation, UCP, etc.).
Software estimation principles and patterns that could be introduced and discussed during this exercise are:

-   Accuracy and precision in software estimation
-   Wild guesses / guesstimates / ansatz vs. Estimates
-   Cone of uncertainty
-   Diseconomy of scale
-   Wishful thinking / Planning fallacy / Anchoring
-   Confirmation bias / Self-fulfilling prophecy / Conformity (authority, group pressure, deindividuation, etc.)
-   Abilene paradox / [Bandwagon effect](/2014/09/the-estimation-quest/Bandwagon%20effect.html "http://en.wikipedia.org/wiki/Bandwagon_effect") / Groupthink
-   Elephant in the room / The Ostrich effect
-   Collusion of optimists
-   The law of large numbers
-   Garbage in, garbage out (GIGO) principle
-   **The unknown unknowns (UU) principle** (as I often tend to call it) – It’s very hard or even impossible to estimate things that you don’t know you don’t know (unlike the known knowns and known unknowns)
-   Parkinson’s law
-   Hofstadter’s law
-   Student syndrome
-   Pygmalion effect
-   The 800 pound gorilla / Gorilla in the the room

**Variations**: Instead of estimating the individual body weights of participants you might ask teams to estimate a predefined group of individuals taken from http://www.cockeyed.com/photos/bodies/heightweight.html (this would save you a lot of time as well). You might also try estimating height, age, etc. However in the latter case you would have to adapt the exercise accordingly.

**Original article**: https://www.agify.me/the-estimation-quest/
