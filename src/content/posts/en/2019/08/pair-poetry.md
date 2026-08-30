---
title: Pair Poetry
slug: pair-poetry
permalink: /2019/08/pair-poetry/
lang: en
description: >-
  This is an exercise to help people understand why pair programming works; in particular why it
  produces better code. It has some usefulness for helping technical team members understand this,
  but I have found it even better for helping managers understand why pair collaboration works. Each
  team of two needs Rory's Story Dice (or other
date: "2019-08-30T15:19:05+00:00"
dateSource: meta
updated: "2019-08-30T15:19:09+00:00"
author: paul-boos
categories:
  - games
tags: []
featuredImage: null
draft: false
wordpress:
  id: 10039
  sourceFile: output/2019/08/pair-poetry/index.html
  capture: modern
---

This is an exercise to help people understand why pair programming works; in particular why it produces better code. It has some usefulness for helping technical team members understand this, but I have found it even better for helping managers understand why pair collaboration works.

Each team of two needs Rory’s Story Dice (or other forms of picture dice). I suppose picture-oriented cards shuffled and split into two decks would work as well. People also need paper (or large index cards) and pens (standard pens will do).

You play this in 3 rounds, with an optional 4th.

**Common Goals in Each Round**

Each round the pair is trying to construct a Limerick using the images rolled on the dice. Here is an example:

> There once was a young man named Bob
>
> Maintaining old apps was his job
>
> One fine day he did pair
>
> With David who did care
>
> Refactoring code using glob.

The 1st, 2nd, and 5th lines of a Limerick always rhyme with each other, as do the 3rd and 4th lines. In addition, the 1st, 2nd, and 5th lines are between 8-11 syllables in length and the 3rd and 4th lines are 5-7 syllables in length. These are analogous to a programming language’s syntax. The specific choices (rhymes and line lengths) made could be said to be analogous to the API of the program.

Each round, the pair will be using the images rolled on the dice as the subject matter of their program ….er…. poem. The images on the dice are not unlike the story the poem is supposed to be about. A successful poem will have identical line lengths and rhymes as required. It will also successfully convey something about the two dice images.

If for any reason you have an odd number of people, I recommend one person become an observer.

So let’s talk what happens in each round…

**Round 1: Independent Work, Integrate at the End**

In round 1, the pair rolls the dice. They look at the images and _SILENTLY_ work. They may not talk about the images and what they mean, OR anything about the construct of the poem. They may also NOT show their work to the other until it is completed.

One person is responsible for lines 1, 3, and the first 5 syllables of line 5. The other person in the pair is responsible for lines 2, 4, and the remaining syllables of line 5.

_Round 1 Debrief_

After each poetry developer has finished their work, then they may integrate the lines which is simply choosing a person to read them as the debrief. Also as a part of the debrief, the pair should say what they rolled for images. So depending on how many pairs you have, read through a few or all of the poems that were created with each pair revealing the dice roll.

Usually the poems wind up being pretty discombobulated, particularly the last line. Little rhyming, sentence structures are way off. Perhaps even the pictures got interpreted differently.

_Analogy_

Round 1 is similar to people working on tasks independently and never doing any form of collaboration. You’ll also note that integration is at the end, which is common with teams that don’t collaborate, particularly if they don’t use any form of continuous integration.

**Round 2: Periodic Check-Ins/Integration without Collaboration**

The second round will put the code into a common visible space. They will use their pens to write the poem out on one piece of paper It is still a SILENT exercise though. No discussions on what the dice mean or the poem. The pair are still responsible for the same lines (OR they can decide to switch which lines for which they are responsible for crafting). So they will be writing a line, then passing the paper to the other. The prior line can not be changed, they just have to work with it.

_Round 2 Debrief_

Again have a person in each pair say what their dice had and what their poems were. Usually at this point the poems meet the technical constraints well; the lines match in the number of syllables and now actually rhyme. Usually, though, the story of the limerick could be better, leading to some weird twists and turns. After all, the pair wasn’t talking about making the story together, they could just see what was written prior.

_Analogy_

This is like having periodic check-ins of the work to a common source code repository (the sheet of paper), so the prior work is reviewable, but why it took the path it did is not well understood. A great story path wasn’t selected.

**Round 3: Pairing**

So now we’re going to ask one person to put aside a pen. One person will be writing and the other collaborating with that person to create the story. When they roll the dice, they discuss what the two images are and what they represent. The writer in discussion with the other starts writing the story. If the other person wants to write, they ask for the pen, swapping roles. If both people agree, earlier lines can be changed to make rhymes better or to improve the storyline.

_Round 3 Debrief_

Again read what came out on the dice and resulting poems. It is good at this time to ask how did this way of working feel for the results you got?

_Analogy_

One person is the driver and the other the navigator. They are working fully together, not only in the repository, but as it was being developed. The “why” of each individual line can be discussed to improve the story of the limerick.

**Full Debrief**

After the three rounds have been ‘played’, we then turn our attention to the full debrief. Here are some questions that can prove useful:

What is your interpretation of the results between the 3 rounds? What changes did you see from round to round?

What is similar to what you know about how you or your teams work and pairing? What is different?

Is round 2 a sufficient way of getting ‘good enough’ results? Why or why not? What seemed to be caused in this manner?

What feels more natural to you for how you like to work? What would make pairing easier in this natural way? What would make it difficult?

If you are a team facilitator (e.g. Scrum Master) or a manager, how can you help teams begin this journey? What factors (room, space, system set-up, etc.) help effective pairing? What hinders it?

Besides development pairs, what other pairs could exist? When would you want to do these? Why are these useful?

What do teams need from management in order to effectively allow/encourage pair?

If people aren’t going to pair, what might produce some of the same effects as pairing? How well will these work compared against pairing? What is your rationale for this? (I only ask these questions if there is a hard resistance to pairing in the group.)

**Optional Round 4: Let’s Swap Pairs Around and Make the Problem Harder**

In a 4th round, I have people swap to make up a new pair. I also take away one die (if a pair has one of their dice from the Rory’s Action set, that is usually what I remove). The group is now going to write a haiku. This particular option is great to push to do if you had to resort to those last questions because the resistance is still high; particularly if the resistance is management related.

Haikus are non-rhyming, three lie poems that use a syllable pattern of the the 1st and 3rd lines being 5 syllables and the 2nd line being 7 syllables. What really makes them difficult is that these 3 lines are to juxtapose 2 images to creatively allow the reader to envision a 3rd image, the subject of the poem itself. Here are two examples:

Sailboat

> Puffing fills ‘til taut
>
> Bobbing gently like a cork
>
> Deep sighs match the waves

Potter’s Wheel

> Fingers stained in red
>
> Build up the whirring column
>
> Tornado of mud

So the people will roll the one die, and then work as in round 3 to create a haiku.

Round 4 _Debrief_

Read the haikus and share the die image. Here are some additional questions that build on the full debrief:

How did this new problem (making a haiku) feel? What did you do first after agreeing on what the die represented?

What was easier or harder about it? How did pairing help? What advantages did you realize by pairing?

How did working with a different person feel? What differences come into play when the pair changes? What are reasons to change the pairs?

_Analogy_

While the basic analogy is the same, this adds the fact that the depth of problems change as people work. Sometimes pairing will be more needed on more difficult problems or where creativity and diversity in thinking are necessary. In addition, you want to exchange pairs as it helps spread knowledge and skills across a team as well as improve decision-making and shared understanding.
