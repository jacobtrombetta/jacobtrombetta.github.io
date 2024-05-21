---
layout: post
title: Comfort Clouds
permalink: /projects/comfort_clouds
---

<div>
  {% for post in site.posts %}
    {% if post.tags contains "comfortclouds" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>