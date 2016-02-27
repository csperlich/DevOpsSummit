var express = require('express'),
    morgan = require('morgan'),
    app = express(),
    bodyParser = require('body-parser'),
    config = require('./config/config'),
    port = config.defaultPort || 8080;

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

app.use(express.static('./public'));
/*
app.use(function(req, res, next) {
  res.status(404);
  res.render('common/pages/404', {url: req.url});
});
*/
app.listen(port);
console.log('listening on port ' + port);