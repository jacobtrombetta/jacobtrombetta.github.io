---
layout: page
title: projects
permalink: /projects
---
<div align="center" style="margin: 10px;">
<a href="/projects/jacob_trombetta">Jacob Trombetta</a> |
<a href="/projects/video">Video</a> <br>

<a href="/projects/discrete_spectrum">Discrete Spectrum</a> |
<a href="https://www.horses4k.rodeo">Horses 4k</a> |
<a href="/projects/glenn_lazear">Glenn Lazear</a> |
<!-- <a href="/projects/greening">Greening</a> | -->
<a href="/projects/phantom_lease">Phantom Lease</a><br>

<a href="/projects/krumel">Krümel</a> |
<a href="/projects/ondelette">Ondelette</a> |
<a href="/projects/comfort_clouds">Comfort Clouds</a> |
<a href="/projects/watt">WATT</a> |
<a href="/projects/collaborations">Collaborations</a>
</div>

{% for post in site.posts %}
  {% include image.html text=post.title image=post.image url=post.url %}
{% endfor %}
