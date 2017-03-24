var rq = require("request");

exports.search = function(query, access_token, callback) {
  console.log("search");
  rq.get({url: "https://graph.microsoft.com/beta/me/drive/root/search?q="+query,
  headers: {
    "Content-Type": "text/plain",
    "Authorization": "Bearer " + access_token
  }},
  function (err,httpResponse,body) {
    console.log("Microsoft");
    console.log(JSON.parse(body));
  })
};
