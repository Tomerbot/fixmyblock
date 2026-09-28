// store.js: everything about saving and loading reports.
// Right now the data lives in localStorage (inside this browser).
// To make FixMyBlock work for a whole city, only this file needs to change:
// the same functions would talk to a server instead.

var STORE_KEY = "fixmyblock.reports.v1";
var VOTES_KEY = "fixmyblock.myVotes.v1";
var DAY = 24 * 60 * 60 * 1000;

var Store = {
  reports: [],
  myVotes: [], // ids of reports this device said "I saw it too" about (or reported)

  load: function () {
    var saved = localStorage.getItem(STORE_KEY);
    if (saved) {
      this.reports = JSON.parse(saved);
    } else {
      this.reports = makeDemoReports();
      this.save();
    }
    this.myVotes = JSON.parse(localStorage.getItem(VOTES_KEY) || "[]");
  },

  // Returns true if it worked, false if the browser storage is full.
  save: function () {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.reports));
      localStorage.setItem(VOTES_KEY, JSON.stringify(this.myVotes));
      return true;
    } catch (err) {
      return false;
    }
  },

  get: function (id) {
    for (var i = 0; i < this.reports.length; i++) {
      if (this.reports[i].id === id) return this.reports[i];
    }
    return null;
  },

  add: function (data) {
    var report = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      category: data.category,
      note: data.note || "",
      photo: data.photo || null,
      lat: data.lat,
      lng: data.lng,
      createdAt: Date.now(),
      seen: 1, // the person who reported it saw it
      status: "open",
      fixedAt: null,
      demo: false,
      mine: true // made on this device
    };
    this.reports.push(report);
    this.myVotes.push(report.id);
    if (!this.save()) {
      // Storage is full: undo, so the app and the saved data stay the same.
      this.reports.pop();
      this.myVotes.pop();
      return null;
    }
    return report;
  },

  hasVoted: function (id) {
    return this.myVotes.indexOf(id) !== -1;
  },

  // "I saw it too". Tapping again takes the vote back.
  toggleVote: function (id) {
    var report = this.get(id);
    if (!report) return;
    if (this.hasVoted(id)) {
      this.myVotes.splice(this.myVotes.indexOf(id), 1);
      report.seen = Math.max(1, report.seen - 1);
    } else {
      this.myVotes.push(id);
      report.seen += 1;
    }
    this.save();
  },

  markFixed: function (id) {
    var report = this.get(id);
    if (!report) return;
    report.status = "fixed";
    report.fixedAt = Date.now();
    this.save();
  },

  reopen: function (id) {
    var report = this.get(id);
    if (!report) return;
    report.status = "open";
    report.fixedAt = null;
    this.save();
  },

  reset: function () {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(VOTES_KEY);
    this.load();
  },

  open: function () {
    return this.reports
      .filter(function (r) { return r.status === "open"; })
      .sort(function (a, b) { return urgency(b) - urgency(a); });
  },

  fixed: function () {
    return this.reports
      .filter(function (r) { return r.status === "fixed"; })
      .sort(function (a, b) { return b.fixedAt - a.fixedAt; });
  }
};

// How urgent a problem is. Higher = fix it sooner.
//   every neighbor who saw it  = 2 points
//   danger (1 to 3)            = 3 points each
//   every day it waits         = 1 point (up to 30)
function urgency(report) {
  var danger = getCategory(report.category).danger;
  return report.seen * 2 + danger * 3 + Math.min(daysOpen(report), 30);
}

function daysOpen(report) {
  var end = report.status === "fixed" ? report.fixedAt : Date.now();
  return Math.floor((end - report.createdAt) / DAY);
}

// A table the city can open in Excel or Google Sheets.
function reportsToCSV(reports) {
  var rows = [["rank", "problem", "note", "neighbors_saw_it", "days_open", "urgency", "latitude", "longitude", "map_link"]];
  reports.forEach(function (r, i) {
    rows.push([
      i + 1,
      getCategory(r.category).label,
      r.note,
      r.seen,
      daysOpen(r),
      urgency(r),
      r.lat.toFixed(6),
      r.lng.toFixed(6),
      osmLink(r)
    ]);
  });
  return rows.map(function (row) {
    return row.map(function (cell) {
      return '"' + String(cell).replace(/"/g, '""') + '"';
    }).join(",");
  }).join("\n");
}

function osmLink(r) {
  return "https://www.openstreetmap.org/?mlat=" + r.lat.toFixed(6) + "&mlon=" + r.lng.toFixed(6) + "#map=19/" + r.lat.toFixed(6) + "/" + r.lng.toFixed(6);
}

// Sample reports for the demo, in a public area of central Tel Aviv.
// They are marked demo: true and use a drawn picture instead of a photo.
function makeDemoReports() {
  var now = Date.now();
  function demo(id, category, note, lat, lng, seen, daysAgo, fixedDaysAgo) {
    return {
      id: "demo-" + id,
      category: category,
      note: note,
      photo: null,
      lat: lat,
      lng: lng,
      createdAt: now - daysAgo * DAY - 3 * 60 * 60 * 1000,
      seen: seen,
      status: fixedDaysAgo === undefined ? "open" : "fixed",
      fixedAt: fixedDaysAgo === undefined ? null : now - fixedDaysAgo * DAY,
      demo: true
    };
  }
  return [
    demo(1, "pothole", "Deep hole in the right lane. Cars swerve around it.", 32.07905, 34.77428, 9, 6),
    demo(2, "light", "Streetlight on the corner is out. Very dark at night.", 32.08075, 34.77250, 7, 4),
    demo(3, "sidewalk", "Lifted tiles next to the bus stop.", 32.07720, 34.77180, 4, 9),
    demo(4, "trash", "Old sofa dumped next to the bins.", 32.08120, 34.77590, 5, 2),
    demo(5, "water", "Water running from under the sidewalk all day.", 32.07640, 34.77560, 3, 1),
    demo(6, "light", "Flickers on and off all night.", 32.07960, 34.77720, 2, 3),
    demo(7, "other", "Stop sign is turned the wrong way.", 32.08210, 34.77380, 1, 0),
    demo(8, "pothole", "Hole at the crosswalk.", 32.07800, 34.77330, 11, 12, 8),
    demo(9, "light", "Two lights out in the park path.", 32.08010, 34.77560, 6, 7, 5),
    demo(10, "trash", "Overflowing bins after the weekend.", 32.07680, 34.77380, 3, 5, 4)
  ];
}
