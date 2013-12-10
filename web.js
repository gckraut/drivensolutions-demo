var path = require('path');
var express = require("express");
var app = express();
var twilio = require('twilio');
var ejs = require('ejs');
app.use(express.logger());

app.get('/', function(request, response) {
  response.redirect('index.html');
});



// var capability = new twilio.Capability(
//         process.env.TWILIO_ACCOUNT_SID,
//         process.env.TWILIO_AUTH_TOKEN
//     );

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

app.get('/getTwilioToken', function(req, res) {
    var identifier = req.query.id;
    // Create an object which will generate a capability token
    // Replace these two arguments with your own account SID
    // and auth token:
    var capability = new twilio.Capability(
        'AC4f89351042185b1bf4b0e37bc853be88',
        '8df2133ca1415a4595be15a653188daf'
    );
 
    // Give the capability generator permission to accept incoming
    // calls to the ID "kevin"
    capability.allowClientIncoming(identifier);

    capability.allowClientOutgoing('AP52cefad5d73c2f7035f23af96e1b567d');
 
    // Render an HTML page which contains our capability token
    // res.render('token.ejs', {
    //     token:capability.generate()
    // });
  res.send({token:capability.generate()});
});