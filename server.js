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
app.use(bodyParser.json());
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

// Read
app.get('/quotes', (req, res) => {
  db.collection('quotes')
    .find()
    .toArray()
    .then(quotes => res.json(quotes))
    .catch(err => console.log('Error: ', err));
});

app.get('/quotes/:id', (req, res) => {
  const { id } = req.params;
  db.collection('quotes')
    .findOne({ _id: ObjectID(id) })
    .then(quote => res.json(quote))
    .catch(err => console.log('Error: ', err));
});

app.post('/quotes', (req, res) => {
  console.log(req.body);
  const { quoteContent } = req.body;
  db.collection('quotes')
    .insertOne({ quote: quoteContent, comments: [] })
    .then(result => {
      res.json(result.ops[0]);
    })
    .catch(err => console.log('Error:', err));
});

app.put('/quotes/:id', (req, res) => {
  const { quoteContent } = req.params;
  const { id } = req.params;
  console.log(req.body, req.params);
  db.collection('quotes')
    .updateOne({ _id: ObjectID(id) }, { $set: { quote: quoteContent } })
    .then(result => res.send(quoteContent))
    .catch(err => console.log(`Error: ${err}`));
});

app.delete('/quotes/:id', (req, res) => {
  console.log('DELETE...');
  const { id } = req.params;

  db.collection('quotes')
    .deleteOne({ _id: ObjectID(id) })
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`);
});
