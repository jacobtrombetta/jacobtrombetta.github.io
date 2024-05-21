---
layout: post
title: Glenn Lazear
permalink: /projects/glenn_lazear
---

__Glenn Lazear__ is a middle-management collar dad rock band from Akron, Ohio. Jacob Trombetta (The Six Parts Seven, Richard Buckner), Friday Mike Wilkinson (Half Cleveland, The May Company), and Robert Ethington (Unit 5, Tin Huey) make up the combo. Their first album, MAN FROM MINGO, debuted in 2018. They also starred in the Glenn Lazear Christmas Special in 2019. 2022 saw the release of their sophomore effort, RESTLAND.

<div>
  {% for post in site.posts %}
    {% if post.tags contains "glennlazear" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>

For more info, visit [Glenn Lazear's homepage](https://www.glennlazear.com/).