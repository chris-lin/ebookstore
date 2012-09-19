var opds = require('../opds2json'); //指定opds2json的位置將其載入

var catalog = 'application/atom+xml;profile=opds-catalog;kind=acquisition';
var buy = 'http://opds-spec.org/acquisition/buy';
var cbetaHref = 'http://www.cbeta.org';

var filterLink = function(json){
  var entry = JSON.parse(json);
  //console.log(entry)
  if(entry.constructor == Object){
    entry = [entry];
  }
  for(var idx in entry){

    if(entry[idx].link.constructor == Object){
      entry[idx].link.href = cbetaHref + entry[idx].link.href;
      entry[idx].link = [entry[idx].link];
    } else {
      entry[idx].link[0].cbeta = true;
      entry[idx].link = [entry[idx].link[1], entry[idx].link[2], entry[idx].link[0]];
    }
    //console.log(entry[idx])
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
