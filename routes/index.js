
/*
 * GET home page.
 */
var url = require('url');
var feedbooks = require('../store/feedbooks');
var cbeta = require('../store/cbeta');
var ossiibooks = require('../store/ossiibooks');
var wget = require('../wget');

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

var download_file_wget = function(file_url, cb){
  var data;
  var DOWNLOAD_DIR = './';
  // extract the file name
  var file_name = url.parse(file_url).path.split('/').pop();
  // compose the wget command
  var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + file_url;
  // excute wget using child_process' exec function
  var cat = 'cat ' + DOWNLOAD_DIR + file_name;

  var child = exec(wget, function(err, stdout, stderr){
    if (err) throw err;
    console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
    data = fs.readFileSync(DOWNLOAD_DIR + file_name);
    fs.unlinkSync(DOWNLOAD_DIR + file_name);
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
  var store = feedbooks.getObject();
  var fileUrl;

  if (req.query.level){
    fileUrl = req.query.level[req.query.level.length - 1];
  } else {
    fileUrl = store.config.HOME_URL;
  }
  console.log(fileUrl)
  wget.download(fileUrl, function(data){
    //console.log(data);
    store.catchEntry(data, req, function(ebooks){
      managePage({
        categories: ebooks.categories,
        books : ebooks.books
      });
      console.log(JSON.stringify(ebooks.books, null, 4));
      console.log(JSON.stringify(ebooks.categories, null, 4));
      res.render('books', {
          categories: ebooks.categories,
          entry: ebooks.books
      });
    });
  })
};

// ------- cbeta ------- //
exports.cbeta = function(req, res, next){
  var store = cbeta.getObject();
  var fileUrl;
  
  console.log(req.query.level)
  console.log(req.url)
  console.log(url.parse(req.url))
  
  if (req.query.level){
    fileUrl = req.query.level[req.query.level.length - 1];
  } else {
    fileUrl = store.config.HOME_URL;
  }
  console.log(fileUrl)
  wget.download(fileUrl, function(data){
    //console.log(data);
    store.catchEntry(data, req, function(ebooks){
      managePage({
        categories: ebooks.categories,
        books : ebooks.books
      });
      //console.log(categories);
      res.render('books', {
          categories: ebooks.categories,
          entry: ebooks.books
      });
    });
  })
};

// ------- ossiibooks ------- //
exports.ossiibooks = function(req, res, next){
  var store = ossiibooks.getObject();
  var fileUrl;

  store.catchEntry(function(ebooks){
    managePage({
      categories: ebooks.categories,
      books : ebooks.books
    });
    res.render('books', {
        categories: ebooks.categories,
        entry: ebooks.books
    });
  });
};
