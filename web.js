var path = require('path');
var express = require("express");
var app = express();
app.use(express.logger());

app.get('/', function(request, response) {
  response.send('Hello World!');
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('dirtylittlesecret'));
  app.use(express.session({ secret: "string" }));
  app.use(express.errorHandler({ showStack: true, dumpExceptions: true
}));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.set("view options", { layout: false });
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});