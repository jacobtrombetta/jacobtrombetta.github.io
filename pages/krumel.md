---
layout: post
title: Krümel
permalink: /projects/krumel
---

<div align="center">
A group of Mario ghosts.
</div>

<div>
  {% for post in site.posts %}
    {% if post.tags contains "krumel" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>