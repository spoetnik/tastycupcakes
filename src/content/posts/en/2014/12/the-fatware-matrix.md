---
title: The Fatware Matrix
slug: the-fatware-matrix
permalink: /2014/12/the-fatware-matrix/
lang: en
description: >-
  The human desire for choice is unlimited. At least this is advocated in many psychological
  theories of human motivation and economic theories of rational choice. And this is so natural -
  after all having multiple options gives us the freedom to select the ones which suit us best.
  However scientists have recently found just the
date: "2014-12-29T07:36:37+00:00"
dateSource: meta
updated: "2015-04-30T08:57:48+00:00"
author: stavros-stavru
categories:
  - games
  - agile
  - lean
  - project-management
  - product
  - requirements
tags: []
featuredImage:
  src: https://www.agify.me/wp-content/uploads/2015/03/The-Fatware-Matrix.png
  alt: The Fatware Matrix
  derived: true
draft: false
wordpress:
  id: 4465
  sourceFile: output/2014/12/the-fatware-matrix/index.html
  capture: modern
---

The human desire for choice is unlimited. At least this is advocated in many psychological theories of human motivation and economic theories of rational choice. And this is so natural – after all having multiple options gives us the freedom to select the ones which suit us best. However scientists have recently found just the opposite – **having “too many” choice might be demotivating and even repellent to consumers**. The most popular demonstration of this is the so called Jam experiment. It was conducted at a grocery store with two different tasting booths – one offering a limited number of flavors of jam (just 6) and one with quite an extensive collection (of 24). What researchers found was striking. Although the variety in the extensive-choice condition was initially more attractive, the percentage of consumers who subsequently purchased jars of jam was much lower than in the limited-choice condition – 3% vs. 30%!
The features of a particular software system could be defined as the options available to its consumers (whether functional or non-functional). Following the same fundamental assumption that rich set of choices is desirable – а tendency emerged to steadily and persistently increase the number of features. As this expansion never stops, software systems often become vulnerable to feature creep (or creeping featurism, featuritis, bloatware, etc.). And **feature creep** is proved to be a major contributor for most of the cost and schedules overruns, and is one of the root causes for software overengineering, software bloat and technical debt. Now taking into consideration recent scientific findings that ‘too many” options actually reduce consumers’ motivation to buy (the argument towards feature-rich software systems) – it is quite intriguing **why is this trend still so strong today**?
The Fatware Matrix is a tool to visualize the **fat in a software system** – all the features which do not bring any value to consumers but are costly to change and maintain. As such _it could be used to manage and continuously improve the levels of feature creep and technical dept_.

**I. The Fatware Matrix**
The Fatware Matrix is a six celled matrix which provides a graphical representation of the feature composition of your software system (by plotting each feature on its corresponding quadrant). The horizontal axis denotes the cost of maintenance (Low, Medium and High) while the vertical represents the value to consumers (None, Expectable and Additional). The **cost of maintenence** for a particular feature could be determined simply through measuring the cost of
change, the time spent on corrective/adaptive/perfective maintenance or enhancements, the perceived maintenance costs by the engineering team, etc. As for its **consumer value** – various models could be incorporated, including stated or derived importance questionnaires, A/B or mutli-variant testing, frequency of use, conversion rates, etc. **None** includes features which do not bring any value to consumers. Such features correspond to the _indifferent and reverse features_ from the Kano model and the _neutrals_ from Cadotte and Turgeon‘s one. **Expectable** are features which are expected and if not presented consumers would be dissatisfied. They could be mapped to the _must-be and one-dimensional features_ from the Kano model, the _dissatisfiers_ from Cadotte and Turgeon and the _givens_ from Hill, Roche and Allen. strong>Additional covers features which bring additional (unexpected) value to consumers. They correspond to the _attractive features_ in the Kano model, the _satisfiers_ from Cadotte and Turgeon and the _satisfaction drivers_ from Hill, Roche and Allen. The Fatware Matrix is presented below.

![The Fatware Matrix](https://www.agify.me/wp-content/uploads/2015/03/The-Fatware-Matrix.png)

The color (and the letter) represents the type of the feature in terms of feature composition. In analogy to physical fitness and body composition, there are three major types: **Fat** (red), **Bone** (yellow) and **Muscle** (green). The number represents the cost of maintenance. As such “**F3 Type Feature**” for example is a feature which brings no or minimal value to consumers (stands for F) and has high maintenance cost (stands for 3).

**II. Feature composition**
The percentages of fat, bone and muscle determines the **Feature composition** of the software system. That percentage is calculated using the following procedure:

1.  Count the number of features for each quadrant.
2.  Multiple this number by the cost of maintenance for its particular quadrant (either 1, 2 or 3).
3.  Sum up the results per row to get the amount of Fat, Bone or Muscle.
4.  Divide the sum of Fat, Bone and Muscle to their total sum (Fat + Bone + Muscle) to retrieve the percentages of Fat, Bone and Muscle (aka the Feature composition).

Given below is an example of a software system with total of 19 features. Based on the distribution of these features on the Fatware Matrix, the software system consists of 32% fat, 46% bones and 22% muscles.

![The Fatware Matrix - Example](https://www.agify.me/wp-content/uploads/2015/03/The-Fatware-Matrix-Example.png)

**III. Fatware, Boneware or Muscleware?**
Depending on the percentage of fat, bone and muscle there might be three major types of feature compositions (in analogy to somatotypes). The first is the **Fatware** (or **Endomorph**). It is characterized with too many fat and under-developed muscles. Software systems with such feature composition are quite heavy-weight (or flab) and tend to consume a lot of energy (efforts and time) and/or are cumbersome in terms of improving and further developing. The second major type is **Boneware** (or **Ectomorph**). Typically such systems are very skinny – they have many bones but small amounts of muscles. This makes them less attractive to consumers and risks their survival in the long run. The last major type is **Muscleware** (or **Mesomorph**). It is characterized with large amounts of bones and muscles. Software systems with such feature composition are quite lean and have great potential to gain a leadership status. Of course there might be feature compositions in between (e.g. endo-mesomorph, ecto-mesomorph, etc.). Examples of the three major feature compositions (Fatware, Boneware and Muscleware) are given below.

![The Fatware Matrix - Fatware, Boneware & Muscleware](https://www.agify.me/wp-content/uploads/2015/03/The-Fatware-Matrix-Fatware-Boneware-Muscleware.png)

**IV. Diets and exercises**
**Diets** determine whether and what type of new features could be added to the software system depending on its feature composition. For example the diet for the Fatware should be restricted to not allow any new features to be added until the fat is reduced to acceptable levels or cautiously adding new features (if this cannot be avoided) which are either bones or muscles (but not fat). On the other hand the diet for the Boneware should include lots of muscles and fewer bones. As for the Muscleware – it is recommended to be muscles- and bones-rich. The fitness of the software system could be secured also with exercising. The **exercises** could be defined as specific actions towards particular features depending on their quadrant within the Fatware Matrix. Some recommended exercises are presented below.

![The Fatware Matrix - Exercises](https://www.agify.me/wp-content/uploads/2015/03/The-Fatware-Matrix-Exercises.png)

**V. How to be Muscleware?**
The Fatware Matrix just shows you whether you are suffering from feature creep and technical debt and if so – recommends you different diets and exercises. However there are many other things you could do to make your software system Muscleware, including (but not limited to):

-   Strictly adhere to proven software development **principles** as KISS (_Keep it simple, stupid_), YAGNI (_You aren’t gonna need it_), WIB (_Worse is better_), LIM (_Less is more_), POGE (_Principle of good enoug_h), 80/20 (_Pareto principle_),
    _The best code is no code at all_, etc.
-   Follow **best software development practices**, including Refactoring, Simple Design, limiting Coupling and promoting Cohesion, Plug-in or Service-Oriented Architectures, Off-The-Shelf (vs. In-House), Cloud Computing, etc.
-   Establish **software configuration management processes** and secure **requirements traceability** (e.g. through specification trees, traceability matrix, etc.)
-   Continuously assess **software quality** through static and dynamic code analysis, control and data-flow analysis,
    etc.
-   Continuously retrieve **feedback from consumers** about features (whether implicit or explicit) and measure **consumers’ value**. Some techniques which could be incorporated are stated or derived importance questionnaires, A/B or mutli-variant testing, frequency of use, conversion rates, etc.

And remember – being a Muschleware is not a one-time effort! Lacking balanced diets, continuous exercising and special fitness efforts (with some of them just listed above) would quickly bring back the fat in your software system and turn it into Fatware.

**Original article**: https://www.agify.me/the-fatware-matrix/
