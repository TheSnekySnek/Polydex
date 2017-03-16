var rq = require("request");

exports.search = function(query, access_token, callback) {
  console.log("search");
  rq.get({url: "https://www.googleapis.com/drive/v3/files?q=name+contains+%27"+query+"%27"+
  "&access_token=" + access_token,
  headers: {
    "Content-Type": "application/json"
  }},
  function (err,httpResponse,body) {
    callback(JSON.parse(body).files);
  })
};

exports.getFileLink = function(file, access_token, callback) {
  console.log("search");
  rq.get({url: "https://www.googleapis.com/drive/v3/files/"+file.id+"?access_token=" + access_token + "&fields=webContentLink",
  headers: {
    "Content-Type": "application/json"
  }},
  function (err,httpResponse,body) {
    console.log("Google File");
    console.log(JSON.parse(body));
    callback({"name": file.name, "path": JSON.parse(body).webContentLink});
  })
};
