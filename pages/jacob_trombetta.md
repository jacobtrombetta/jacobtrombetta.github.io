---
layout: post
title: Jacob Trombetta
permalink: /projects/jacob_trombetta
---
<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1825594284&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>

__Jacob Trombetta__ is a multi-media artist, bringing novel applications of technology to bear in artistic spaces.

Haunted by ambient goth soundscapes and an eye for the shadows, he crafts evocative musical textures and code-manipulated video art.
        
With the pedal steel as a focal point, Trombetta brings compositional expertise and a background spanning robotics, computer vision, and cryptography to produce uniquely atmospheric experiences.
        
If you like ambient electro-acoustic music made by an Appalachian man, you are in the right place.

{% include image_static.html image="jt/jt_credit_s.g._inskeep.jpg" %}

<div align="center">
  Works
</div>

<div>
  {% for post in site.posts %}
    {% if post.tags contains "jacobtrombetta" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>