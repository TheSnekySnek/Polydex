module.exports = function(app, db, dropbox, google, onedrive){

  app.post('/listener', function (req, res, next) {
    var token = req.body.token;
    db.getServiceData(token, function(data) {
      if(data){
        res.send(data);
        db.deleteServiceData(token, function() {
          console.log("Deleted " + token);
        });
      }
      else{
        res.send("err");
      }
    });
  });

  app.get('/accountlink', function (req, res, next) {
    const path = require('path');
    res.sendFile(path.join(__dirname, '/front/accountlink.html'));
  });

  app.get('/oauth/dropbox', function (req, res, next) {
    console.log(req.query);
    res.redirect("/accountlink");
    dropbox.getToken(req.query.code,function(resp) {
      resp = JSON.parse(resp);
      db.addServiceCallback(req.query.state, resp, function() {
        console.log("Done");
      });
    })
  });

  app.get('/oauth/google', function (req, res, next) {
    res.redirect("/accountlink");
    console.log(req.query.code);
    google.getToken(req.query.code,function(resp) {
      resp = JSON.parse(resp);
      console.log(resp);
      console.log(req.query.state);
      db.addServiceCallback(req.query.state, resp, function() {
        console.log("Done");
      });
    })
  });

  app.get('/oauth/onedrive', function (req, res, next) {
    res.redirect("/accountlink");
    console.log(req.query.code);
    onedrive.getToken(req.query.code,function(resp) {
      resp = JSON.parse(resp);
      console.log(resp);
      console.log(req.query.state);
      db.addServiceCallback(req.query.state, resp, function() {
        console.log("Done");
      });
    })
  });
}
