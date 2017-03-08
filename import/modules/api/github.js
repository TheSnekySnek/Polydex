var rq = require("request");

exports.fetchPage = function(pageToken, pageFn, callback) {
  drive.files.list({
    q: "mimeType='image/jpeg'",
    fields: 'nextPageToken, files(id, name)',
    spaces: 'drive',
    pageToken: pageToken
  }, function(err, res) {
    if(err) {
      callback(err);
    } else {
      res.files.forEach(function(file) {
        console.log('Found file: ', file.name, file.id);
      });
      if (res.nextPageToken) {
        console.log("Page token", res.nextPageToken);
        pageFn(res.nextPageToken, pageFn, callback);
      } else {
        callback();
      }
    }
  });
};
