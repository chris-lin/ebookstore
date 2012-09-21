var path = require('path');
var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var download_file_wget = function(file_url, cb){
  var data, file_name;
  var DOWNLOAD_DIR = './tmp/';
  // compose the wget command
  var wget = 'wget -P ' + DOWNLOAD_DIR + ' ' + file_url;
  // excute wget using child_process' exec function
  var child = exec(wget, function(err, stdout, stderr){
    if (err) throw err;
    //file_name = fs.readdirSync(DOWNLOAD_DIR);
    file_name = stderr.match(/\.\/tmp\/.+/)[0].split("'")[0];
    data = fs.readFileSync(file_name) + '';
    fs.unlinkSync(file_name);
    console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
    cb(data);
  });
};

exports.download = download_file_wget;
