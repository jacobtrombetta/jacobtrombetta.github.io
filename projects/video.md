---
layout: post
title: 'video'
---

{% for post in site.categories.video %}
  {% include image.html text=post.title image=post.image url=post.url %}
{% endfor %}