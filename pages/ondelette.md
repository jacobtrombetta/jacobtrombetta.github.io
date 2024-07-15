---
layout: post
title: Ondelette
permalink: /projects/ondelette
---
{% include image_static.html image="o/o_1.jpg" %}

<div style="text-align: justify;">
A collaboration between ambient steel guitarist, Jacob Trombetta and saxophonist, Jennifer Howell, Ondelette (2012-2014) featured a meditative soundscape, characterized by a soft rhythmic shimmer. Drawing inspiration from Fripp & Eno's Evening Star, Jon Hassell, and Stars Of The Lid, Ondelette pushed the boundaries of ambient music away from the more standard use of synthesizers, in favor of a novel use of steel guitar.
</div>

<div align="center">
  <br>
  <a href="https://ondelette.bandcamp.com/music">Bandcamp</a> |
  <a href="https://open.spotify.com/artist/1Sj2lyz3AN0E0vLBCfROep?si=rSucvqTmRi6gqRbZzWOaCg">Spotify</a> |
  <a href="https://music.apple.com/us/artist/ondelette/789539782">Apple Music</a> |
  <a href="https://amazon.com/music/player/artists/B00HHIRNUS/ondelette?marketplaceId=ATVPDKIKX0DER&musicTerritory=US&ref=dm_sh_keTafQBqpfRlhkUu53NbIaR6A">Amazon Music</a>
</div>

<div>
  {% for post in site.posts %}
    {% if post.tags contains "ondelette" %}
      <h4 align="center">{{ post.title }}</h4>
      {% include image.html text=post.title image=post.image url=post.url %}
    {% endif %}
  {% endfor %}
</div>

<hr>
{% include image_static.html image="o/o_2.jpg" %}
{% include image_static.html image="o/o_3.jpg" %}
{% include image_static.html image="o/o_4.jpg" %}
