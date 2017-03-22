var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/polydex';

var dba = null;

// Use connect method to connect to the server
exports.init = function(callback) {
  MongoClient.connect(url, function(err, db) {
    dba = db;
    callback();
  });
}

exports.addServiceCallback = function(key, data, callback) {

  var collection = dba.collection('services');

  collection.insertOne({"key": key, "data": data}, function(err, r) {
    assert.equal(null, err);
    assert.equal(1, r.insertedCount);
  });
}

exports.getServiceData = function(key, callback) {

  var collection = dba.collection('services');

  collection.find({'key': key}).toArray(function(err, docs) {
    if(docs.length > 0)
      callback(docs[0].data);
    else
      callback();
  });
}

exports.deleteServiceData = function(key, callback) {

  var collection = dba.collection('services');

  collection.deleteOne({ 'key' : key }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    callback();
  });
}

exports.getDropboxKey = function(user, callback) {

  var collection = dba.collection('users');

  collection.find({'name': user}).toArray(function(err, docs) {
    if(docs.length > 0)
    callback(docs[0].keys.dropbox);
    else
    callback("No Results");
  });
}

exports.deleteDropboxKey = function(user, callback) {

  var collection = dba.collection('users');

  collection.deleteOne({ 'name' : user }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });
}

exports.setDropboxAccount = function(user, info, callback) {

  var collection = dba.collection('users');
  console.log("updating user: " + user);

  collection.update(
   {"name": user},
   {$set: {"keys.dropbox": info}},
   {
     upsert: true,
     multi: false
   });
}
