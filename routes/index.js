
/*
 * GET home page.
 */
var path = require('path');
var opds = require('opds2json'); //指定opds2json的位置將其載入

var catchEntry = function (file){
  var opdsParser = opds.init(file);  //指定xml檔案路徑並且回傳物件
  var json = opdsParser.findEntry(); //尋找該xml檔案現有的entry標籤抓取出來並且轉成json格式
  return JSON.parse(json)
}

var entry = catchEntry('catalog.atom');

var cataLink = function (){

}

for(var key in entry){
  entry[key].link.href = path.basename(entry[key].link.href)
}

exports.index = function(req, res){
  res.render('cata', { entry: entry });
};

exports.free_books = function(req, res){
  entry = catchEntry('free_books.atom');
  res.render('cata', { entry: entry });
};

exports.books = function(req, res){
  entry = catchEntry('top.atom');
  res.render('books', { entry: entry });
};