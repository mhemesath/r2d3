d3.xhr = function(url, mime, callback) {
  var req;
  try {
    req = new ActiveXObject("Msxml2.XMLHTTP");
  }  catch (e) {
    try {
      req = new ActiveXObject("Microsoft.XMLHTTP");
    } 
    catch (e) {}
  }
  if (arguments.length < 3) callback = mime, mime = null;
  else if (mime && req.overrideMimeType) req.overrideMimeType(mime);
  req.open("GET", url, true);
  if (mime) req.setRequestHeader("Accept", mime);
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      var s = req.status;
      callback(!s && req.response || s >= 200 && s < 300 || s === 304 ? req : null);
    }
  };
  req.send(null);
};
