var express = require('express');
var app = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
//var mustacheExpress = require('mustache-express');
var pug = require('pug');
let Book = require('./models/book');
mongoose.connect('mongodb://localhost/test');

var books  = require('./routes/books');

//var app = express();

//app.engine('mustache', mustacheExpress());


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'pug')
app.set('views', __dirname + '/views');

app.use('/api/books', books);

app.get('/', function (req, res) {
  Book.find(function (err, books) {
    if (err) return console.error(err);
    console.log(books);
    res.render('index', { books: books });
  })
});

app.get('/books/new', function (req, res) {
  res.render('bookForm', { title: "New Book",book: {} });
});

app.post('/books/new', function(req, res, next) {
  let bookToCreate = new Book(req.body);
  bookToCreate.save(function(err, book){
    res.redirect('/books/' + book.id);
  });
});

app.get('/books/:id/update', function (req, res) {
  let id = req.params["id"]
  Book.findOne({_id: id}, function(err, book) {
    res.render('bookForm', { title: book.name, book: book });
  });
});

app.post('/books/:id/update', function (req, res) {
  let id = req.params["id"]
  Book.findOneAndUpdate({_id: id}, req.body, function(err, book) {
    if (err) return next(err);
    res.redirect('/books/' + id);
  });
});

app.post('/books/:id/delete', function (req, res) {
  let id = req.params["id"]
  Book.deleteOne({_id: id}, function(err, book) {
    res.redirect("/");
  });
});

app.get('/books/:id', function (req, res) {
  Book.findOne({_id: req.params["id"]}, function(err, book) {
    if (err) return next(err);
    res.render('book', { book: book });
  });
});
// catch
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
