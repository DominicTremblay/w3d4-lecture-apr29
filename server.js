const express = require('express');
const morgan = require('morgan');
const Mongo = require('mongodb');
const bodyParser = require('body-parser');
const ObjectID = require('mongodb').ObjectID;

const port = process.env.PORT || 8000;
const app = express();
const MongoClient = Mongo.MongoClient;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/movieQuotes';

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use static files from public folder
app.use(express.static('public'));

let db = null;

// Establish connection to the mongo db and assign the mongoDb object to db
MongoClient.connect(MONGODB_URI, (err, mongoDb) => {
  if (err) {
    console.log('Cannot connect to MongoDB:', err);
    process.exit(1);
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  db = mongoDb;
});

// List the quotes
app.get('/quotes', (req, res) => {
  // Do the DB request to get all the quotes

  db.collection('quotes')
    .find()
    .toArray()
    .then(quotes => res.json(quotes));
});

// Show only one quote
app.get('/quotes/:id', (req, res) => {});

// Create a quote
app.post('/quotes', (req, res) => {
  // Ex traction the quote content for req.body
  console.log('req.body:', req.body);
  const { quote } = req.body;
  // Create a new quote in the db
  db.collection('quotes')
    .insertOne({
      quote: quote,
      comments: [],
    })
    .then(result => res.json(result.ops[0]));
});

// Update an existing quote
app.put('/quotes/:id', (req, res) => {
  // get the id from req.params
  // retrieve the quote in the DB with that id
  // Update the quote in the db
});

// Delete an existing quote
app.delete('/quotes/:id', (req, res) => {
  // delete the quote with that id in the db
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
