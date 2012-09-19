
/*
 * GET home page.
 */
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
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
            //console.log(data)
        }).on('end', function() {
            cb(data);
            console.log( url + ' downloaded to complete ');
        }).on('error', function(err) {
            console.log('error : '+err);
            console.log('error message : '+err.message);
        });
    });
}

var download_file_wget = function(file_url, cb){
  var data, file_name;
  var DOWNLOAD_DIR = './tmp/';
  // compose the wget command
  var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + file_url;
  // excute wget using child_process' exec function
  var child = exec(wget, function(err, stdout, stderr){
    if (err) throw err;
    file_name = fs.readdirSync(DOWNLOAD_DIR);
    data = fs.readFileSync(DOWNLOAD_DIR + file_name);
    fs.unlinkSync(DOWNLOAD_DIR + file_name);
    console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
    cb(data);
  });
};

exports.post = function(req, res, next){
  req.session.catalogURL = req.body.data;
  if(req.session.locale == 'feedbooks'){
    res.redirect('/feedbooks:true');
  } else if(req.session.locale == 'cbeta'){
    res.redirect('/cbeta:true');
  }
}

exports.locals = function(req, res, next) {
  //console.log('save session')
  //console.log(req.url)
  res.locals.session = req.session;
  next();
}

exports.index = function(req, res, next){
  res.render('menubar', {
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
    var fileUrl;
  req.session.locale = 'feedbooks';

  if (req.params.id == ':true'){
    fileUrl = req.session.catalogURL;
  } else {
    fileUrl = 'http://www.feedbooks.com/catalog.atom';
  }
  console.log(fileUrl)
  download_file_wget(fileUrl, function(data){
    //console.log(data);
    entry = feedbooks.catchEntry(data, req);
    //console.log(entry);

    if(entry[0].link.length == 1){  // if category
      categories = entry;
    } else {
      books = entry;
    }
    managePage({
      categories: categories,
      books : books
    });
    //console.log(categories);
    res.render('books', {
        categories: categories,
        entry: books
    });
  })
};

// ------- cbeta ------- //
exports.cbeta = function(req, res, next){
  var fileUrl;
  req.session.locale = 'cbeta';
  console.log(req.params.id)

  if (req.params.id == ':true'){
    fileUrl = req.session.catalogURL;
  } else {
    fileUrl = 'http://www.cbeta.org/opds';
  }
  console.log(fileUrl)
  download_file_wget(fileUrl, function(data){
    //console.log(data);
    entry = cbeta.catchEntry(data);
    //console.log(entry);
    if(entry[0].link.length == 1){  // if category
      categories = entry;
    } else {
      books = entry;
    }
    managePage({
      categories: categories,
      books : books
    });
    //console.log(categories);
    res.render('books', {
        categories: categories,
        entry: books
    });
  })
};
