
/*
 * GET home page.
 */
var http = require('http');
var path = require('path');
var opds = require('../opds2json'); //指定opds2json的位置將其載入

//~ var cataLink = function (entry){
  //~ for(var key in entry){
    //~ entry[key].link.href = path.basename(entry[key].link.href)
  //~ }
//~ }

var catchEntry = function (file){
  var opdsParser = opds.init(file);  //指定xml檔案路徑並且回傳物件
  var json = opdsParser.findEntry(); //尋找該xml檔案現有的entry標籤抓取出來並且轉成json格式
  return JSON.parse(json)
}
var entry
  , books
  , categories;


exports.post = function(req, res, next){
  //console.log(req.body);
  entry = catchEntry(req.body.data);
  if(entry[0].link.type){  // if category
    categories = entry;
  } else {
    books = entry;
  }
  res.redirect( '/books' );
}

exports.index = function(req, res, next){
  categories = catchEntry('catalog.atom');
  books = undefined;
  //cataLink(entry);
  res.render('books', {
      categories: categories,
      entry: books
  });
};

exports.category = function(req, res){
  res.render('category', { entry: entry });
};


exports.books = function(req, res){
  res.render('books', {
      categories: categories,
      entry: books
  });
};

