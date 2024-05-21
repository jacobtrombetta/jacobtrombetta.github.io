---
layout: post
title: Collaborations
permalink: /projects/collaborations
---

<div>
  {% for post in site.posts %}
    {% if post.tags contains "collaboration" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>