/* opds to xml */

var parser = require('xml2json');
var fs = require('fs');
var path = require('path');
var assert = require('assert');

var init = function (file) {
  return new opds2json(file);
}

var opds2json = function(file) {
  this._file;
  this._json;
  var ext = path.extname(file),
      xml;
  if (ext == '.xml' || ext == '.atom') {
    xml = fs.readFileSync(file) + '';
    this.setFile(file);
  } else {
    xml = file;
  }
  this.xml2json(xml);
}

opds2json.prototype.xml2json = function(xml) {
  var json = parser.toJson(xml);
      //obj = parser.toJson(xml, {object: true, space: true});
  this.setJson(json);
  return this;
}

opds2json.prototype.findEntry = function() {
  var obj = JSON.parse(this.getJson());
  var entry_books = JSON.stringify(obj.feed.entry, null, 4);
  return entry_books;
}

opds2json.prototype.json2file = function(json, filepath) {
  var json = json ? json : this.getJson(),
      filename = filepath ? filepath : this.getFile(),
      ext = path.extname(filename),
      dirname = path.dirname(filename),
      basename = path.basename(filename, ext);
      filepath = dirname + '/' + basename + '.json';
  fs.writeFileSync(filepath, json);
  return this;
}

opds2json.prototype.setJson = function(json) {
  this._json = json;
  return this;
}

opds2json.prototype.getJson = function() {
  return this._json;
}

opds2json.prototype.setFile = function(file) {
  this._file = file;
  return this;
}

opds2json.prototype.getFile = function() {
  return this._file;
}

module.exports.init = init;
