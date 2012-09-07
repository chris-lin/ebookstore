// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

// App variables
var file_url = 'http://www.feedbooks.com/index.html';
var DOWNLOAD_DIR = './downloads/';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
var child = exec(mkdir, function(err, stdout, stderr) {
    if (err) throw err;
    else download_file_httpget(file_url);
});

// Function to download file using HTTP.get
var download_file_httpget = function(file_url) {
  console.log(url.parse(file_url).host)
  console.log(url.parse(file_url).pathname)
var options = {
    host: url.parse(file_url).host,
    port: 80,
    path: url.parse(file_url).pathname
};

var file_name = url.parse(file_url).pathname.split('/').pop();
var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

http.get(file_url, function(res) {
    console.log(res.statusCode);
    res.on('data', function(data, err) {
            console.log(data+'')
            //file.write(data);
        }).on('end', function() {
            //file.end();
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
        }).on('error', function(err) {
            //file.end();
            console.log('error : '+err);
            console.log('error : '+err.message);
        });
    });
};

//~ var req = http.request(options, function(res) {
  //~ console.log('STATUS: ' + res.statusCode);
  //~ console.log('HEADERS: ' + JSON.stringify(res.headers));
  //~ res.setEncoding('utf8');
  //~ res.on('data', function (chunk) {
    //~ console.log('BODY: ' + chunk);
  //~ });
//~ });
//~ 
//~ req.on('error', function(e) {
  //~ console.log('problem with request: ' + e.message);
//~ });
//~ 
//~ 
//~ req.end();
