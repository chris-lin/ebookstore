
/*
 * GET home page.
 */
var path = require('path');
var opds = require('opds2json'); //指定opds2json的位置將其載入

var cataLink = function (entry){
  for(var key in entry){
    entry[key].link.href = path.basename(entry[key].link.href)
  }
}

var catchEntry = function (file){
  var opdsParser = opds.init(file);  //指定xml檔案路徑並且回傳物件
  var json = opdsParser.findEntry(); //尋找該xml檔案現有的entry標籤抓取出來並且轉成json格式
  return JSON.parse(json)
}

var entry;

exports.index = function(req, res){
  entry = catchEntry('catalog.atom');
  cataLink(entry);
  res.render('cata', { entry: entry });
};

exports.free_books = function(req, res){
  entry = catchEntry('free_books.atom');
  cataLink(entry);
  res.render('cata', { entry: entry });
};

exports.categories = function(req, res){
  entry = catchEntry('categories.atom');
  cataLink(entry);
  res.render('cata', { entry: entry });
};

exports.FBFIC000000 = function(req, res){
  entry = catchEntry('FBFIC000000.atom');
  cataLink(entry);
  res.render('cata', { entry: entry });
};

exports.books = function(req, res){
  console.log(res);
  entry = catchEntry('top.atom');
  res.render('books', { entry: entry });
};