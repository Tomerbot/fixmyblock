// app.js: the screens and buttons. It uses Store (data), MapView (map)
// and shrinkPhoto (photos), and connects them to what the user taps.

var $ = function (id) { return document.getElementById(id); };

var draft = { category: null, photo: null }; // the report being written
var openReportId = null;                     // the report shown in the details sheet
var toastTimer = null;

// ---------- Start ----------

function start() {
  Store.load();
  MapView.init();
  buildCategoryPicker();
  refresh();
  MapView.showAll();
  wireEvents();
}

// Redraw everything that depends on the data.
function refresh() {
  MapView.draw(openDetail);
  renderFixFirst();
  renderFixed();
  var open = Store.open().length;
  $("openCount").textContent = open ? String(open) : "";
}

// ---------- Tabs ----------

function showTab(name) {
  closeSheets();
  ["map", "first", "fixed"].forEach(function (tab) {
    $("view-" + tab).hidden = tab !== name;
    $("view-" + tab).classList.toggle("is-active", tab === name);
  });
  document.querySelectorAll(".tab").forEach(function (btn) {
    var active = btn.dataset.tab === name;
    btn.classList.toggle("is-active", active);
    if (active) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
  if (name === "map") MapView.map.invalidateSize();
}

// ---------- Sheets ----------

function openSheet(id, withScrim) {
  closeSheets();
  $(id).hidden = false;
  $("scrim").hidden = !withScrim;
  document.body.classList.add("has-sheet");
  var first = $(id).querySelector("[data-close]");
  if (first) first.focus({ preventScroll: true });
}

function closeSheets() {
  document.querySelectorAll(".sheet").forEach(function (s) { s.hidden = true; });
  $("scrim").hidden = true;
  document.body.classList.remove("has-sheet", "is-reporting");
  openReportId = null;
}

// ---------- Report a problem ----------

function buildCategoryPicker() {
  $("catPicker").innerHTML = CATEGORIES.map(function (c) {
    return '<label class="cat">' +
      '<input type="radio" name="category" value="' + c.id + '">' +
      '<span class="cat-face">' + categoryIcon(c.id) + "<span>" + c.label + "</span></span>" +
      "</label>";
  }).join("");
}

function startReport() {
  showTab("map");
  var center = MapView.map.getCenter();
  draft = { category: null, photo: null };
  $("reportForm").reset();
  $("photoPreview").hidden = true;
  $("photoPreview").removeAttribute("src");
  $("photoEmpty").hidden = false;
  $("formError").textContent = "";

  openSheet("reportSheet", false);
  document.body.classList.add("is-reporting");
  placeCrosshair();
  MapView.putUnderPin(center, Math.max(MapView.map.getZoom(), 17));
}

// Put the crosshair in the middle of the part of the map you can still see.
function placeCrosshair() {
  var crosshair = $("crosshair");
  var middle = MapView.visibleMiddle($("reportSheet"));
  crosshair.style.top = Math.round(middle - crosshair.offsetHeight / 2) + "px";
}

function useMyLocation() {
  if (!navigator.geolocation) {
    showToast("This browser can't share your location. Move the map by hand.");
    return;
  }
  $("locateBtn").textContent = "Finding you…";
  navigator.geolocation.getCurrentPosition(function (pos) {
    $("locateBtn").textContent = "Use my location";
    MapView.putUnderPin([pos.coords.latitude, pos.coords.longitude], 18);
  }, function () {
    $("locateBtn").textContent = "Use my location";
    showToast("Location is off. Move the map by hand instead.");
  }, { enableHighAccuracy: true, timeout: 10000 });
}

function onPhotoChosen(event) {
  var file = event.target.files[0];
  if (!file) return;
  $("formError").textContent = "";
  shrinkPhoto(file).then(function (dataUrl) {
    draft.photo = dataUrl;
    $("photoPreview").src = dataUrl;
    $("photoPreview").hidden = false;
    $("photoEmpty").hidden = true;
  }).catch(function (err) {
    $("formError").textContent = err.message;
  });
}

function saveReport(event) {
  event.preventDefault();
  var picked = document.querySelector('input[name="category"]:checked');
  if (!picked) {
    $("formError").textContent = "Choose what's wrong first.";
    return;
  }
  var where = MapView.pinPoint();
  var report = Store.add({
    category: picked.value,
    note: $("noteInput").value.trim(),
    photo: draft.photo,
    lat: where.lat,
    lng: where.lng
  });
  if (!report) {
    $("formError").textContent = "The storage on this device is full. Reset the demo data in About, then try again.";
    return;
  }
  closeSheets();
  refresh();
  pulseRing(report.id);
  showToast("Added to the map. Share it so neighbors can confirm.");
}

// A short "new paint" animation on the ring that was just added.
function pulseRing(id) {
  var marker = MapView.markers[id];
  if (marker && marker.getElement()) marker.getElement().classList.add("ring-new");
}

// ---------- Details ----------

function openDetail(id) {
  var report = Store.get(id);
  if (!report) return;
  showTab("map");
  openSheet("detailSheet", true);
  openReportId = id;
  renderDetail(report);
  MapView.focus(report, $("detailSheet"));
}

function renderDetail(report) {
  var cat = getCategory(report.category);
  var fixed = report.status === "fixed";
  var rank = Store.open().indexOf(report) + 1;
  var voted = Store.hasVoted(report.id);

  $("detailSheet").classList.toggle("is-fixed", fixed); // green instead of orange
  $("detailTitle").innerHTML = categoryIcon(report.category, "title-icon") + " " + cat.label;

  var status = fixed
    ? '<p class="status status-fixed">Fixed ' + ago(report.fixedAt) + ", after " + plural(daysOpen(report), "day") + ".</p>"
    : '<p class="status">Number ' + rank + " on the Fix first list. Reported " + ago(report.createdAt) + ".</p>";

  var seen = '<p class="seen"><span class="seen-num">' + report.seen + "</span> " +
    (report.seen === 1 ? "person saw this" : "neighbors saw this") + "</p>";

  var voteBtn = "";
  if (!fixed) {
    if (report.mine) {
      voteBtn = '<button class="vote-btn" type="button" disabled>You reported this</button>';
    } else {
      voteBtn = '<button class="vote-btn' + (voted ? " is-on" : "") + '" type="button" id="voteBtn" aria-pressed="' + voted + '">' +
        (voted ? "You saw it too" : "I saw it too") + "</button>";
    }
  }

  var actions = fixed
    ? '<button class="secondary-btn" type="button" id="shareBtn">Share with city</button>' +
      '<button class="text-btn" type="button" id="reopenBtn">Not fixed? Reopen it</button>'
    : '<button class="secondary-btn" type="button" id="fixBtn">Mark fixed</button>' +
      '<button class="secondary-btn" type="button" id="shareBtn">Share with city</button>';

  $("detailBody").innerHTML =
    '<div class="detail-grid">' +
      photoTag(report, "detail-photo") +
      '<div class="detail-text">' +
        (report.note ? '<p class="note">' + escapeHtml(report.note) + "</p>" : "") +
        status + seen +
      "</div>" +
    "</div>" +
    voteBtn +
    '<div class="detail-actions">' + actions + "</div>";

  if ($("voteBtn")) $("voteBtn").onclick = function () { vote(report.id); };
  if ($("fixBtn")) $("fixBtn").onclick = function () { markFixed(report.id); };
  if ($("reopenBtn")) $("reopenBtn").onclick = function () { reopen(report.id); };
  $("shareBtn").onclick = function () { shareWithCity(report); };
}

function vote(id) {
  Store.toggleVote(id);
  refresh();
  renderDetail(Store.get(id));
  var report = Store.get(id);
  showToast(Store.hasVoted(id)
    ? "Counted. " + report.seen + " neighbors saw this now."
    : "Your vote was taken back.");
}

function markFixed(id) {
  Store.markFixed(id);
  refresh();
  renderDetail(Store.get(id));
  showToast("Marked fixed.", "Undo", function () {
    Store.reopen(id);
    refresh();
    if (openReportId === id) renderDetail(Store.get(id));
  });
}

function reopen(id) {
  Store.reopen(id);
  refresh();
  renderDetail(Store.get(id));
  showToast("Reopened. It is back on the Fix first list.");
}

// Send the report to the city: the phone's share menu (email, WhatsApp…),
// or copy the text if the browser has no share menu.
function shareWithCity(report) {
  var cat = getCategory(report.category);
  var text = cat.label + (report.note ? ": " + report.note : "") + "\n" +
    report.seen + (report.seen === 1 ? " person saw" : " neighbors saw") + " this. " +
    (report.status === "fixed" ? "Fixed after " + plural(daysOpen(report), "day") + "." : "Waiting " + plural(daysOpen(report), "day") + ".") + "\n" +
    "Map: " + osmLink(report) + "\n" +
    "Sent from FixMyBlock";

  var data = { title: "FixMyBlock: " + cat.label, text: text };
  var file = report.photo ? dataUrlToFile(report.photo, "fixmyblock-" + report.category + ".jpg") : null;
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) data.files = [file];

  if (navigator.share) {
    navigator.share(data).catch(function () { /* the user closed the share menu */ });
    return;
  }
  copyText(text).then(function () {
    showToast("Copied. Paste it into an email or a message to your city.");
  }, function () {
    showToast("Couldn't copy. Take a screenshot of this report instead.");
  });
}

// ---------- Lists ----------

function renderFixFirst() {
  var open = Store.open();
  var fixed = Store.fixed();
  $("firstSummary").textContent = open.length
    ? plural(open.length, "problem") + " waiting. " +
      (fixed.length ? plural(fixed.length, "fix", "fixes") + " so far, " + averageFixText(fixed) + "." : "Nothing fixed yet.")
    : "";
  $("csvBtn").hidden = !open.length;

  if (!open.length) {
    $("firstList").innerHTML = '<li class="empty">Nothing to fix right now. Seen something broken? Report it from the map.</li>';
    return;
  }
  $("firstList").innerHTML = open.map(function (r, i) {
    return rowHtml(r, '<span class="rank">' + (i + 1) + "</span>",
      plural(r.seen, "person", "people") + " saw it, waiting " + plural(daysOpen(r), "day"));
  }).join("");
}

function renderFixed() {
  var fixed = Store.fixed();
  $("fixedSummary").textContent = fixed.length
    ? plural(fixed.length, "problem") + " fixed on this block, " + averageFixText(fixed) + "."
    : "";
  if (!fixed.length) {
    $("fixedList").innerHTML = '<li class="empty">No fixes yet. When a problem is fixed, open it on the map and tap Mark fixed.</li>';
    return;
  }
  $("fixedList").innerHTML = fixed.map(function (r) {
    return rowHtml(r, '<span class="rank rank-fixed" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>',
      "Fixed in " + plural(daysOpen(r), "day") + ", " + ago(r.fixedAt));
  }).join("");
}

function rowHtml(r, lead, meta) {
  var cat = getCategory(r.category);
  return '<li><button class="row" type="button" data-report="' + r.id + '">' +
    lead + photoTag(r, "row-photo") +
    '<span class="row-text"><span class="row-title">' + cat.label + "</span>" +
    (r.note ? '<span class="row-note">' + escapeHtml(r.note) + "</span>" : "") +
    '<span class="row-meta">' + meta + "</span></span>" +
    "</button></li>";
}

function averageFixText(fixed) {
  var total = fixed.reduce(function (sum, r) { return sum + daysOpen(r); }, 0);
  var avg = Math.round(total / fixed.length * 10) / 10;
  return "in " + (avg === 1 ? "1 day" : avg + " days") + " on average";
}

function downloadCSV() {
  var blob = new Blob([reportsToCSV(Store.open())], { type: "text/csv" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "fixmyblock-fix-first.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  showToast("Downloaded the Fix first list.");
}

// ---------- Small helpers ----------

function photoTag(r, className) {
  if (r.photo) return '<img class="' + className + '" src="' + r.photo + '" alt="Photo of the problem">';
  if (r.demo) return '<img class="' + className + '" src="' + demoPicture(r.category) + '" alt="Sample drawing of a ' + getCategory(r.category).label.toLowerCase() + ' problem">';
  return '<span class="' + className + ' no-photo">' + categoryIcon(r.category) + "</span>";
}

function ago(time) {
  var days = Math.floor((Date.now() - time) / DAY);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return days + " days ago";
}

function plural(n, word, many) {
  return n + " " + (n === 1 ? word : (many || word + "s"));
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, function (ch) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
  });
}

function dataUrlToFile(dataUrl, name) {
  var parts = dataUrl.split(",");
  var mime = parts[0].match(/:(.*?);/)[1];
  var bytes = atob(parts[1]);
  var arr = new Uint8Array(bytes.length);
  for (var i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
  return new File([arr], name, { type: mime });
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  return new Promise(function (resolve, reject) {
    var area = document.createElement("textarea");
    area.value = text;
    document.body.appendChild(area);
    area.select();
    var ok = document.execCommand("copy");
    area.remove();
    if (ok) resolve(); else reject(new Error("copy failed"));
  });
}

function showToast(message, actionLabel, action) {
  var toast = $("toast");
  toast.innerHTML = "";
  var span = document.createElement("span");
  span.textContent = message;
  toast.appendChild(span);
  if (actionLabel) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = actionLabel;
    btn.onclick = function () { toast.classList.remove("is-shown"); action(); };
    toast.appendChild(btn);
  }
  toast.classList.add("is-shown");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { toast.classList.remove("is-shown"); }, actionLabel ? 6000 : 3500);
}

// ---------- Events ----------

function wireEvents() {
  document.querySelectorAll(".tab").forEach(function (btn) {
    btn.addEventListener("click", function () { showTab(btn.dataset.tab); });
  });
  document.querySelector("[data-tab-link]").addEventListener("click", function (e) {
    e.preventDefault();
    showTab("map");
  });

  $("reportBtn").addEventListener("click", startReport);
  $("locateBtn").addEventListener("click", useMyLocation);
  $("photoInput").addEventListener("change", onPhotoChosen);
  $("reportForm").addEventListener("submit", saveReport);
  $("catPicker").addEventListener("change", function () { $("formError").textContent = ""; });

  $("aboutBtn").addEventListener("click", function () { openSheet("aboutSheet", true); });
  $("resetBtn").addEventListener("click", function () {
    if (!confirm("Delete all reports on this device and bring back the sample data?")) return;
    Store.reset();
    closeSheets();
    refresh();
    MapView.showAll();
    showToast("Demo data is back.");
  });

  $("csvBtn").addEventListener("click", downloadCSV);

  document.querySelectorAll("[data-close]").forEach(function (btn) {
    btn.addEventListener("click", closeSheets);
  });
  $("scrim").addEventListener("click", closeSheets);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeSheets();
  });

  // Tapping a row in a list opens that report on the map.
  ["firstList", "fixedList"].forEach(function (id) {
    $(id).addEventListener("click", function (e) {
      var row = e.target.closest("[data-report]");
      if (row) openDetail(row.dataset.report);
    });
  });

  window.addEventListener("resize", function () {
    if (document.body.classList.contains("is-reporting")) placeCrosshair();
  });
}

start();
