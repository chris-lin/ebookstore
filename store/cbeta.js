var opds = require('../opds2json'); //指定opds2json的位置將其載入
var url = require('url');
var wget = require('../wget');
var store;

function cbeta (){
  this.config = {
    HOME_URL: 'http://www.cbeta.org/opds',
    catalog: 'application/atom+xml;profile=opds-catalog;kind=acquisition',
    buy: 'http://opds-spec.org/acquisition/buy',
    level: null
  }
  this.ebooks = {};
}

cbeta.prototype._checkEntryType = function(entry){
  if(entry.link.constructor == Object){
    return 'categories';
  } else {
    return 'Free';
  }
}

cbeta.prototype._modifyLinkHref = function(href, level){
  var cbeta = '/cbeta?';
  var sumLevel = '';
  var idx;
  href = this.config.HOME_URL.replace('/opds', href);
  //console.log(' -- modify href -- ' + level);
  if(level.length) {
    for(idx in level){
      if(idx == 0){
        sumLevel += 'level[' + idx + ']=' + level[idx];
      } else {
        sumLevel += '&level[' + idx + ']=' + level[idx];
      }
    }
    href = cbeta + sumLevel + '&level[' + (++idx) + ']=' + href;
  } else {
    href = cbeta + 'level[0]=' + href;
  }
  //console.log(' ---- ' + href + ' ---- ');
  return href;
}

cbeta.prototype._modifyEntry = function(entry, level){
  for(var idx in entry){
    switch (this._checkEntryType(entry[idx])) {
      case 'categories':
        entry[idx].link.href = this._modifyLinkHref(entry[idx].link.href, level);
        entry[idx].link = [entry[idx].link];
        break;
      case 'Free':
        entry[idx].link = [entry[idx].link[1], entry[idx].link[2], entry[idx].link[0]];
    }
    //console.log(entry[idx])
  }
  return entry;

}

cbeta.prototype._filterEntry = function(json){
  var xml_url;
  var ebooks = {};
  var entry = JSON.parse(json);

  entry = entry.constructor == Object ? [entry] : entry;

  //onsole.log('link link link link')
  //console.log(entry[0].link)

  if (this._checkEntryType(entry[0]) == 'categories') {
    console.log('--- categories ---')
    ebooks.categories = this._modifyEntry(entry, this.config.level);
    this.callback(ebooks);
  } else {
    console.log('--- this is Books then search parent categories ---')
    this.config.level.pop();
    xml_url = this.config.level.length ? this.config.level[this.config.level.length -1] : this.config.HOME_URL;
    ebooks.books = this._modifyEntry(entry, this.config.level);
    wget.download(xml_url, function(data){
      entry = JSON.parse(opds.init(data).findEntry());
      entry = entry.constructor == Object ? [entry] : entry;
      ebooks.categories = store._modifyEntry(entry, store.config.level);
      store.callback(ebooks)
    })
  }
}

cbeta.prototype.catchEntry = function(file, req, cb){
  var opdsParser = opds.init(file);  //指定xml檔案路徑並且回傳物件
  var json = opdsParser.findEntry(); //尋找該xml檔案現有的entry標籤抓取出來並且轉成json格式
  console.log('----- catchEntry start ----- ')
  //console.log(req.query.level);
  this.callback = cb;
  this.config.level = req.query.level ? req.query.level : [];
  this.ebooks = this._filterEntry(json);

  //console.log(JSON.parse(json)[0].link)
  //return filterEntry(json, req);
}

exports.getObject = function(){
  store = new cbeta();
  return store;
}
