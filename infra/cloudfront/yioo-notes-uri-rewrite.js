function handler(event) {
  var request = event.request;
  var uri = request.uri;

  if (uri === "/notes" || uri === "/notes/") {
    request.uri = "/notes/index.html";
    return request;
  }

  if (uri.indexOf("/notes/") === 0 && uri.charAt(uri.length - 1) === "/") {
    request.uri = uri + "index.html";
  }

  return request;
}
