var rq = require("request");

exports.search = function(query, access_token, callback) {
  console.log("search");
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
    console.log(body.matches);
    callback(body.matches);
  });
}

exports.getLink = function(path, access_token, callback) {
  rq.post({url: "https://api.dropboxapi.com/2/sharing/get_file_metadata",
  headers: {
    "Authorization": "Bearer "+ access_token,
    "Content-Type": "application/json"
  },
  json:{
    "file": path.id,
    "actions": []
  }
},
  function (err,httpResponse,body) {
    callback({"link": body.preview_url, "name": path.name});
  });
}
