
/*
 * GET home page.
 */
var http = require('http');
var path = require('path');
var fs = require('fs');
var feedbooks = require('../store/feedbooks');
var cbeta = require('../store/cbeta');

var entry
  , books
  , categories;

var pagestorage = [],
  pageIndex = 0;

var managePage = function(obj){
  pagestorage.splice(pageIndex + 1);
  pagestorage.push(obj);
  pageIndex = pagestorage.length - 1;
}

var downXml = function(url, cb) {
  var data = '';
  console.log('----- download start ------')
  http.get(url, function(res) {
    console.log('ststus Code = ' + res.statusCode);
    res.on('data', function(chunk, err) {
            data += chunk;
            console.log(data)
        }).on('end', function() {
            cb(data);
            console.log('downloaded to complete');
        }).on('error', function(err) {
            console.log('error : '+err);
            console.log('error message : '+err.message);
        });
    });
}

exports.post = function(req, res, next){
  entry = feedbooks.catchEntry(req.body.data);
  //console.log(entry[0].link);
  if(entry[0].link.length == 1){  // if category
    categories = entry;
  } else {
    books = entry;
  }
  managePage({
    categories: categories,
    books : books
  });
  res.redirect( '/books' );
}

exports.locals = function(req, res, next) {
  //console.log('save session')
  //console.log(req.url)
  res.locals.session = req.session;
  next();
}

exports.index = function(req, res, next){
  res.render('home', {
      store: '歡迎光臨晟鑫書城'
  });
};

exports.previous = function(req, res){
  console.log(req.session)
  if(!(pageIndex <= 0)) {
    pageIndex--;
    console.log(pageIndex);
    categories = pagestorage[pageIndex].categories;
    books = pagestorage[pageIndex].books;
  }
  res.redirect( '/books' );
};

exports.next = function(req, res){
  req.session.pageMax = true;
  if(!(pageIndex >= pagestorage.length - 1)) {
    pageIndex++;
    console.log(pageIndex);
    categories = pagestorage[pageIndex].categories;
    books = pagestorage[pageIndex].books;
  }
  res.redirect( '/books' );
};

exports.books = function(req, res){
  res.render('books', {
      categories: categories,
      entry: books
  });
};

// ------- feedbooks ------- //
exports.feedbooks = function(req, res, next){
  var url = 'http://www.feedbooks.com/catalog.atom';
  downXml(url, function(data){
    categories = feedbooks.catchEntry(data);
    books = undefined;
    //console.log(categories);
    res.render('books', {
        categories: categories,
        entry: books
    });
  })
};

// ------- cbeta ------- //
exports.cbeta = function(req, res, next){
  var url = 'http://www.cbeta.org/opds';
  downXml(url, function(data){
    //console.log(data);
    categories = cbeta.catchEntry(data);
    books = undefined;
    //console.log(categories);
    res.render('books', {
        categories: categories,
        entry: books
    });
  })
};
