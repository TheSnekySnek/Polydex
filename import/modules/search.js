var Datastore = require('nedb');
var ini = false;
var db = new Datastore({ filename: 'indexes.pdx'});
console.log("init DB");
db.loadDatabase(function (err) {
  ini = true;
  db.persistence.setAutocompactionInterval(10000)
});

Array.prototype.unique = function() {
  var re = this;
  var arr = {};
  for ( var i=0, len = re.length; i < len; i++ )
      arr[re[i]['path']] = re[i];

  re = new Array();
  for ( var key in arr )
      re.push(arr[key]);
      return re;
}

exports.search = function(q, callback) {
  if(ini && q != ""){
    var res = [];
    var reg = new RegExp(q);
    console.log(reg);
    db.loadDatabase(function (err) {
      console.log("re");
      db.find({ "word": reg }, function (err, docs) {

        for (var i = 0; i < docs.length; i++) {
          res.push(docs[i].matches.unique());
        }
        console.log("cb");
        callback(res);
      });
    });
    var rq = require("request");
    rq({url:"https://dev.villagrasa.ch/testuser/dropbox/search/" + q, "rejectUnauthorized": false}, function(error, response, body) {
      console.log(error);
      var response = JSON.parse(body);
      console.log(response);
      console.log(error);
      for (var t = 0; t < response.matches.length; t++) {
        var doc =
          [{"line": -1,
            "path": response.matches[t].metadata.path_lower,
            "source": "Dropbox"
          }];
          res.push(doc);
        }
        callback(res);
    });
  }
}

exports.insertKeyword = function(q){

}

exports.insertDocument = function(doc, callback) {
  db.update({ "word": doc.word, $not:{ $and: [{"matches.document.line": doc.matches[0].line, "matches.document.path": doc.matches[0].path}]}}, { $push: {"matches": doc.matches[0]} }, {upsert: true}, function () {
    process.send("updated");
    callback();
  });
}
