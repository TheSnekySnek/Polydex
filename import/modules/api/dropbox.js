var rq = require("request");

exports.search = function(query, access_token, callback) {
  rq.post({url: "https://api.dropboxapi.com/2/files/search",
  headers: {
    "Authorization": "Bearer "+ access_token,
    "Content-Type": "application/json"
  },
  json:{"path": "",
        "query": query,
        "start": 0,
        "max_results": 100,
        "mode": "filename_and_content"}},
  function (err,httpResponse,body) {
    callback(body);
  });
}

exports.getLink = function(path, access_token, callback) {
  rq.post({url: "https://api.dropboxapi.com/2/files/get_temporary_link",
  headers: {
    "Authorization": "Bearer "+ access_token,
    "Content-Type": "application/json"
  },
  json:{"path": path}},
  function (err,httpResponse,body) {
    callback(body);
  });
}
