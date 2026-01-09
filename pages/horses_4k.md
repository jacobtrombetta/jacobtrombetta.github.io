---
layout: post
title: Horses 4k
permalink: /projects/horses_4k
---

<div style="text-align: center;">
    <a href="https://www.horses4k.rodeo/">horses4k.rodeo</a>
</div>

<div>
  {% for post in site.posts %}
    {% if post.tags contains "horses4k" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>
