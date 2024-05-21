---
layout: post
title: WATT
permalink: /projects/watt
---

<div align="center">
  A minimalist garage rock band with Jacob Trombetta and Bob Ethington.
</div>

<div>
  {% for post in site.posts %}
    {% if post.tags contains "watt" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>