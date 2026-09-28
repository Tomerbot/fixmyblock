// The kinds of problems people can report.
// "danger" is how risky the problem is (1 = annoying, 3 = someone can get hurt).
// It is one part of the urgency score in store.js.
var CATEGORIES = [
  {
    id: "pothole",
    label: "Pothole",
    danger: 3,
    icon: '<path d="M3.5 13.5 6 10.5l3.5.5 2-2 3.5 1 3 .5 2.5 3-2.5 2.5-4 .5-2 1.5-3.5-1-3.5-.5z" fill="currentColor" fill-opacity=".22" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M11.5 9 10.8 5.8M18 10.5l1.6-2.3M5 16.8l-2 1.6M17 16.5l2 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
  },
  {
    id: "light",
    label: "Streetlight",
    danger: 3,
    icon: '<path d="M8 21V7a4 4 0 0 1 4-4h2a3 3 0 0 1 3 3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 6h6l-1 3h-4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M5 21h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>'
  },
  {
    id: "sidewalk",
    label: "Sidewalk",
    danger: 2,
    icon: '<rect x="2.5" y="8" width="19" height="8.5" rx="1" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8.8 8v8.5M15.2 8v8.5" stroke="currentColor" stroke-width="2"/><path d="m12.6 8-1.6 3 2 1.6-1.4 3.9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>'
  },
  {
    id: "water",
    label: "Water leak",
    danger: 2,
    icon: '<path d="M12 3.5c3 4 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.5-6 5.5-10z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>'
  },
  {
    id: "trash",
    label: "Trash",
    danger: 1,
    icon: '<path d="M5 7h14M10 7V4.5h4V7M6.5 7l1 13h9l1-13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.5 11v5.5M13.5 11v5.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>'
  },
  {
    id: "other",
    label: "Something else",
    danger: 1,
    icon: '<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 7.5v5.5M12 16.2v.1" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>'
  }
];

function getCategory(id) {
  for (var i = 0; i < CATEGORIES.length; i++) {
    if (CATEGORIES[i].id === id) return CATEGORIES[i];
  }
  return CATEGORIES[CATEGORIES.length - 1];
}

function categoryIcon(id, className) {
  return '<svg class="' + (className || "cat-icon") + '" viewBox="0 0 24 24" aria-hidden="true">' +
    getCategory(id).icon + "</svg>";
}

// A drawn picture for the sample reports (they have no real photo).
// It is clearly a drawing, so nobody thinks it is a real photo.
function demoPicture(id) {
  var svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">' +
    '<rect width="400" height="300" fill="#5a5f64"/>' +
    '<path d="M0 225h400v75H0z" fill="#4a4e52"/>' +
    '<path d="M0 222h400" stroke="#c9ccc8" stroke-width="6"/>' +
    '<path d="M40 262h60M170 262h60M300 262h60" stroke="#ffc72c" stroke-width="7"/>' +
    '<g transform="translate(125 45) scale(6.25)" color="#f1f2ef">' + getCategory(id).icon + "</g>" +
    '<circle cx="200" cy="120" r="98" fill="none" stroke="#ff5a1f" stroke-width="12" stroke-dasharray="40 12"/>' +
    '<text x="386" y="290" text-anchor="end" font-family="sans-serif" font-size="16" fill="#c9ccc8">Sample drawing</text>' +
    "</svg>";
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}
