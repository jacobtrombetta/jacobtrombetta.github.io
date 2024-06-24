---
layout: post
title: Phantom Lease
permalink: /projects/phantom_lease
---

**Phantom Lease**, Jacob Trombetta and Brenden Vencel, met while working on algorithms to inspect beer cans. Brenden wanted to make ska, Jacob wanted to make new age music, so they combined forces to make neither. Mary Riley joined the band for the upcoming album Goldline my Coffin, in order to scream about the things that make a middle aged suburban woman angry. 

Deco Danger, released on June 30, 2023, is the third album by Phantom Lease. This collection of music was exclusively composed for an arcade game that had a fleeting existence of just one week. This ephemeral gem was showcased at an aluminum can exhibition in 2019.

Memories of Happier and Less Complicated Times explores the world of fish and chips. It was released on June 30, 2022, the fiftieth anniversary of the final Arthur Treacher's Fish & Chips restaurant and first anniversary of Arthur Treacher's day in Cuyahoga Falls, Ohio. The title Memories of Happier and Less Complicated Times is taken from a quote by the owner of the restaurant. Due to the cultural impact of the album, Arthur Treacher's was able to open a second location in Ohio.

The album Home chronicles two evangelical grifters who conned Phantom Lease into writing music for their line of promotional videos about healthy eating. The album was governed by only two rules: songs should be a minute long and include a nylon string guitar part. Home was released on November 19, 2021.

<div>
  {% for post in site.posts %}
    {% if post.tags contains "phantomlease" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>

For more info, visit [Phantom Lease's homepage](https://sites.google.com/view/phantomlease/home).