// map.js: the Leaflet map and the spray-paint rings on it.
// Leaflet draws the map. The map pictures ("tiles") come from OpenStreetMap,
// which is free and needs no API key.

var MapView = {
  map: null,
  layer: null,
  markers: {}, // report id -> marker on the map

  init: function () {
    this.map = L.map("map", { zoomControl: false, attributionControl: true });
    L.control.zoom({ position: "topright" }).addTo(this.map);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.layer = L.layerGroup().addTo(this.map);
  },

  // Draw one ring per report. Bigger ring = more urgent.
  draw: function (onTap) {
    var self = this;
    this.layer.clearLayers();
    this.markers = {};

    var open = Store.open();
    open.forEach(function (report, i) {
      self.addRing(report, i + 1, onTap);
    });
    Store.fixed().forEach(function (report) {
      self.addRing(report, 0, onTap);
    });
  },

  addRing: function (report, rank, onTap) {
    var marker = L.marker([report.lat, report.lng], {
      icon: ringIcon(report, rank),
      keyboard: true,
      title: ringTitle(report, rank),
      riseOnHover: true,
      zIndexOffset: report.status === "fixed" ? -1000 : report.seen * 10
    });
    marker.on("click", function () { onTap(report.id); });
    marker.addTo(this.layer);
    this.markers[report.id] = marker;
  },

  showAll: function () {
    var points = Store.reports.map(function (r) { return [r.lat, r.lng]; });
    if (points.length) {
      // extra room at the bottom for the "Report a problem" button
      this.map.fitBounds(points, { paddingTopLeft: [40, 40], paddingBottomRight: [40, 110], maxZoom: 17 });
    } else {
      this.map.setView([32.0795, 34.7745], 16);
    }
  },

  // A sheet covers the bottom of the map. This is the height (in px, from the
  // top of the map) of the middle of the part you can still see.
  visibleMiddle: function (sheet) {
    // (Measured from the sheet's height, because while the sheet slides in
    // its on-screen position is still changing.)
    var box = this.map.getContainer().getBoundingClientRect();
    var sheetTop = sheet ? window.innerHeight - sheet.offsetHeight : box.bottom;
    return (Math.min(sheetTop, box.bottom) - box.top) / 2;
  },

  // Move the map so a place ends up at height y (instead of the exact middle).
  showAt: function (latlng, zoom, y, animate) {
    var point = this.map.project(latlng, zoom);
    point.y += this.map.getSize().y / 2 - y;
    var center = this.map.unproject(point, zoom);
    if (animate) this.map.flyTo(center, zoom, { duration: 0.6 });
    else this.map.setView(center, zoom, { animate: false });
  },

  // Show a report in the visible part of the map, above the details sheet.
  focus: function (report, sheet) {
    var zoom = Math.max(this.map.getZoom(), 17);
    var animate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.showAt([report.lat, report.lng], zoom, this.visibleMiddle(sheet), animate);
  },

  // Where the crosshair points (used when saving a new report).
  pinPoint: function () {
    var crosshair = document.getElementById("crosshair");
    var y = crosshair.offsetTop + crosshair.offsetHeight / 2;
    return this.map.containerPointToLatLng([this.map.getSize().x / 2, y]);
  },

  // Move the map so a place ends up under the crosshair.
  putUnderPin: function (latlng, zoom) {
    var crosshair = document.getElementById("crosshair");
    this.showAt(latlng, zoom, crosshair.offsetTop + crosshair.offsetHeight / 2, false);
  }
};

function ringSize(report) {
  if (report.status === "fixed") return 30;
  return 34 + Math.min(report.seen, 12) * 2; // 36 px to 58 px
}

function ringIcon(report, rank) {
  var size = ringSize(report);
  var fixed = report.status === "fixed";
  var color = fixed ? "var(--fixed)" : "var(--paint)";
  var r = size / 2 - 6;
  var inner = fixed
    ? '<path d="M' + (size * 0.33) + " " + (size * 0.52) + "l" + (size * 0.12) + " " + (size * 0.12) + "l" + (size * 0.22) + " " + (-size * 0.26) + '" fill="none" stroke="var(--fixed)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>'
    : '<text x="50%" y="50%" dy="0.36em" text-anchor="middle">' + report.seen + "</text>";

  // The top 3 problems get a second, thinner ring: "fix this first".
  var outer = !fixed && rank >= 1 && rank <= 3
    ? '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + (size / 2 - 1.5) + '" fill="none" stroke="' + color + '" stroke-width="1.6" stroke-dasharray="3 3" />'
    : "";

  var html =
    '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + " " + size + '">' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + (r - 2) + '" fill="rgba(241,242,239,.88)"/>' +
    '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="5.5" filter="url(#spray)"/>' +
    outer + inner +
    "</svg>";

  return L.divIcon({
    html: html,
    className: "ring" + (fixed ? " ring-fixed" : "") + (Store.hasVoted(report.id) ? " ring-mine" : ""),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
}

function ringTitle(report, rank) {
  var label = getCategory(report.category).label;
  if (report.status === "fixed") return label + ", fixed";
  return label + ", number " + rank + " to fix, " + report.seen + " saw it";
}
