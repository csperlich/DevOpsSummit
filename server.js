var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    mongoose = require('./config/mongoose'),
    bodyParser = require('body-parser'),
    config = require('./config/config'),
    port = config.defaultPort || 8080;

var db = mongoose();

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

if (config.logging) {
  app.use(morgan('dev'));
}

require('./app/routes/common.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);

app.use(express.static('./public'));

app.use(function(req, res, next) {
  res.status(404);
  res.render('common/pages/404', {url: req.url});
});

//catch all error handler
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ error: err });
}

app.use(errorHandler);

app.listen(port);
console.log('listening on port ' + port);
