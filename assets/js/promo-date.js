/* Promotion month + date range, filled in from the visitor's clock so the
   banner never needs editing each month.

   Loaded with a plain <script src> immediately after the text it replaces,
   NOT at the bottom of <body> with agency.js. That position matters: agency.js
   runs late enough that the stale month baked into index.html would flash on
   screen before being replaced, and since the page is deployed once and runs
   for months, that flash would show a wrong month on nearly every page load.

   The plain text in index.html stays as the no-JS / crawler fallback. It is
   correct at deploy time and drifts after that, which is harmless. */
(function () {
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  var now = new Date();
  var month = MONTHS[now.getMonth()];
  var year = now.getFullYear();
  // Day 0 of next month is the last day of this one - covers 28/29/30/31.
  var lastDay = new Date(year, now.getMonth() + 1, 0).getDate();

  var set = function (selector, text) {
    var nodes = document.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; i++) nodes[i].textContent = text;
  };

  set('[data-promo-month]', month);
  set('[data-promo-range]', '1 ' + month + ' ' + year + ' - ' + lastDay + ' ' + month + ' ' + year);
})();
