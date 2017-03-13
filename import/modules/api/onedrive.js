var rq = require("request");

exports.search = function(query, access_token, callback) {
  console.log("search");
  rq.get({url: "https://www.googleapis.com/drive/v3/files?q=name+contains+%27"+query+"%27&access_token=" + access_token,
  headers: {
    "Content-Type": "application/json"
  }},
  function (err,httpResponse,body) {
    console.log("Google");
    console.log(JSON.parse(body));
    callback(JSON.parse(body).files);
  })
};
