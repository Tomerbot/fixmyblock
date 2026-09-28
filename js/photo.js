// photo.js: makes phone photos small enough to save.
// A phone photo can be 4 MB, and the browser gives each site about 5 MB in total.
// So we draw the photo on a canvas at most 900 px wide and save it as a JPEG
// (usually 60 to 120 KB). That way dozens of reports fit.

var MAX_PHOTO_SIDE = 900;
var PHOTO_QUALITY = 0.7;

function shrinkPhoto(file) {
  return new Promise(function (resolve, reject) {
    if (!file || !file.type || file.type.indexOf("image/") !== 0) {
      reject(new Error("That file is not a picture. Choose a photo instead."));
      return;
    }
    var url = URL.createObjectURL(file);
    var img = new Image();
    img.onload = function () {
      var scale = Math.min(1, MAX_PHOTO_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
      var canvas = document.createElement("canvas");
      canvas.width = Math.round(img.naturalWidth * scale);
      canvas.height = Math.round(img.naturalHeight * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", PHOTO_QUALITY));
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
      reject(new Error("This photo could not be opened. Try a JPG or PNG photo."));
    };
    img.src = url;
  });
}
