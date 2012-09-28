
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

var storeMemory = new express.session.MemoryStore({
    reapInterval: 60000 * 10
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: 'ebooks',
    store: storeMemory
  }));
  app.use(routes.locals);
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.locals.pretty = true;

app.get('/', routes.index);
app.get('/books', routes.books);
app.get('/previous', routes.previous);
app.get('/next', routes.next);
app.get('/feedbooks', routes.feedbooks);
app.get('/cbeta', routes.cbeta);
app.get('/ossiibooks', routes.ossiibooks);


//app.get('/users', user.list);

app.post('/post', routes.post);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
