var url = require('url');
var mongo = require('../db');
var opds = require('../opds2json'); //指定opds2json的位置將其載入
var wget = require('../wget');
var storeObj;

var db = mongo.createDB('books');

function Store (){
  this.config = {
    HOME_URL: 'http://www.cbeta.org/opds',
    catalog: 'application/atom+xml;profile=opds-catalog;kind=acquisition',
    buy: 'http://opds-spec.org/acquisition/buy',
    level: null
  }
  this.ebooks = {};
}

Store.prototype._buildBooks = function(name, last_upload, links){
  return {
    title: name,
    author: {
      name: '無名氏'
    },
    updated: last_upload,
    link: [
      {
        type: 'image/png',
        rel: 'http://opds-spec.org/image',
        href: './images/test.jpg'
      },
      {
        type: 'image/png',
        rel: 'http://opds-spec.org/image/thumbnail',
        href: 'images/test.jpg' 
      },
      {
        cbeta: true,
        type: "application/epub+zip",
        rel: "http://opds-spec.org/acquisition",
        href: links[0].zip 
      }
    ]
  }
}

Store.prototype._filterEntry = function(json){
  var xml_url;
  var ebooks = {};
  var entry;
  
  db.open(function(error, client) {
    entry = [];
    if (error) throw error;
    //console.log(client)
    var collection = client.collection('book');
    //console.log(collection)
    collection.find().toArray(function(err, docs) {
      //console.log(docs)
      docs.forEach(function(book){
        book = book.book;
        console.log(book)
        entry.push(storeObj._buildBooks(book.title, book.last_upload, book.links));  
      })
      ebooks.books = entry;
      //console.log(ebooks.books)
      //console.log(assert.equal(null, err));
      //console.log(assert.equal(2, docs.length));
      db.close();
      storeObj.callback(ebooks)
    });
  });
}

Store.prototype.catchEntry = function(cb){
  this.callback = cb;
  this._filterEntry();
}

exports.getObject = function(){
  storeObj = new Store();
  return storeObj;
}
