const Agent = {
  post: function(url, data) {
    let xhr = new XMLHttpRequest();
    // xhr.responseType = 'text';
    xhr.open("POST", window.location.origin + url, false);
    xhr.send(JSON.stringify(data));
    return JSON.parse(xhr.responseText);
  }
}