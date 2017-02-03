var search = require('node-filesearch').search;

exports.search = function(keyword) {
  search('.doc',function(results){
      console.log(results);
  });
}
