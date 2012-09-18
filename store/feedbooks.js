var opds = require('../opds2json'); //指定opds2json的位置將其載入

var catalog = 'application/atom+xml;profile=opds-catalog;kind=acquisition';
var buy = 'http://opds-spec.org/acquisition/buy';

var filterLink = function(json){
  var entry = JSON.parse(json);
  for(var idx in entry){
    if(entry[idx].link.constructor == Object){
      entry[idx].link = [entry[idx].link];
    } else if(entry[idx].link[3].rel == buy){
      entry[idx].link = entry[idx].link.slice(1,4);
      entry[idx].link[2].buy = true;
    } else {
      entry[idx].link = entry[idx].link.slice(4,6).concat(entry[idx].link.slice(1,4));
    }
    console.log(entry[idx])
  }
  return entry;
}

exports.catchEntry = function(file){
  var opdsParser = opds.init(file);  //指定xml檔案路徑並且回傳物件
  var json = opdsParser.findEntry(); //尋找該xml檔案現有的entry標籤抓取出來並且轉成json格式
  console.log('----- filter start -----')
  //console.log(JSON.parse(json)[0].link)
  return filterLink(json);
}

//~ var cataLink = function (entry){
  //~ for(var key in entry){
    //~ entry[key].link.href = path.basename(entry[key].link.href)
  //~ }
//~ }
