var mongodb = require('mongodb');
var assert = require('assert');
var config = {
  host: '127.0.0.1',
  port: 27017,
}

var server = new mongodb.Server(config.host, config.port, {});

exports.createDB = function(name){
  return new mongodb.Db(name, server, {})
}

function abc(){
  new mongodb.Db('books', server, {}).open(function (error, client) {
    if (error) throw error;
    var collection = new mongodb.Collection(client, 'test_collection');
    collection.update({hi: 'here'}, {$set: {hi: 'there'}}, {safe:true},
                      function(err) {
      if (err) console.warn(err.message);
      else console.log('successfully updated');
    });
  });
}


