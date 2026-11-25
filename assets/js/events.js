// The events page is built at deploy time. If the site hasn't been rebuilt
// since an event happened, move it from "Upcoming" to "Past" using the
// visitor's own date.
(function () {
  var upcoming = document.getElementById("upcoming-list");
  var past = document.getElementById("past-list");
  if (!upcoming || !past) return;
  var d = new Date();
  var today = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  var items = Array.prototype.slice.call(upcoming.querySelectorAll("[data-date]"));
  items.forEach(function (el) {
    if (el.getAttribute("data-date") < today) past.insertBefore(el, past.firstChild);
  });
  if (!upcoming.querySelector("[data-date]")) document.getElementById("no-upcoming").hidden = false;
})();
