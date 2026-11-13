'use strict';

// Map of in-person talk locations on the Talks page.
// The map is created the first time the Talks page becomes visible,
// because Leaflet cannot measure a container that is display: none.

(function () {
  const container = document.querySelector("[data-talks-map]");
  const page = document.querySelector('[data-page="talks"]');
  const dataEl = document.getElementById("talk-locations");
  if (!container || !page || !dataEl || typeof L === "undefined") return;

  const locations = JSON.parse(dataEl.textContent);
  let map = null;

  // Sort each place's events newest first, using the "(Mon. YYYY)" suffix.
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const eventDate = function (label) {
    const m = label.match(/\((?:(\w{3})[^)]*?)?(\d{4})\)\s*$/);
    if (!m) return 0;
    return Number(m[2]) * 12 + Math.max(0, MONTHS.indexOf(m[1]));
  };
  locations.forEach(function (loc) {
    loc.events.sort(function (a, b) { return eventDate(b) - eventDate(a); });
  });

  const purple = getComputedStyle(document.documentElement)
    .getPropertyValue("--orange-yellow-crayola").trim() || "#8c3cdd";

  const initMap = function () {
    map = L.map(container, { scrollWheelZoom: false });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const europe = [];

    locations.forEach(function (loc) {
      const items = loc.events.map(function (e) { return "<li>" + e + "</li>"; }).join("");
      L.circleMarker([loc.lat, loc.lon], {
        radius: 7,
        color: "#ffffff",
        weight: 2,
        fillColor: purple,
        fillOpacity: 0.95
      })
        .bindPopup('<strong>' + loc.place + '</strong><ul class="talks-popup-list">' + items + "</ul>")
        .addTo(map);

      // Frame the map on Europe; distant venues stay reachable by zooming out.
      if (loc.lon > -30 && loc.lon < 45) europe.push([loc.lat, loc.lon]);
    });

    map.fitBounds(europe, { padding: [20, 20] });
  };

  const showMap = function () {
    if (!page.classList.contains("active")) return;
    if (!map) initMap();
    else map.invalidateSize();
  };

  new MutationObserver(showMap).observe(page, { attributes: true, attributeFilter: ["class"] });
  showMap();
})();
