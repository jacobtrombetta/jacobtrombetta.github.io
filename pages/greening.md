---
layout: post
title: Greening
permalink: /projects/greening
---

<div>
  {% for post in site.posts %}
    {% if post.tags contains "greening" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>