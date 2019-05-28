// These are the basic required imports
var express = require('express');
var router = express.Router();

// These are the imports that are specific to the tutorial
// const pg = require('pg');

// const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/todo';
// const connectionString = 'postgresql://dbuser:secretpassword@database.server.com:3211/mydb'

// Use connection pooling to supply a different user name and password
// https://node-postgres.com/features/connecting
// Connection pooling is preferred when there may be many different users eg. web app
const { Pool, Client } = require('pg');
const path = require('path');
// Change this to use the config file?
// const pool = new Pool({
//   user: 'test',
//   host: 'localhost',
//   database: 'todo',
//   password: 'test',
//   port: 5432
// })

// Can also use the Client method. Change this to use the config file?
const client = new Client({
  user: 'test',
  host: 'localhost',
  database: 'todo',
  password: 'test',
  port: 5432
})

// Often we only need to run a single query on the database, so as convenience the pool has a method 
// to run a query on the first available idle client and return its result.
// https://node-postgres.com/api/pool
// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   pool.end()
// })

// you can also use async/await
// const res = await pool.query('SELECT NOW()')
// await pool.end()

// NOTE: ONLY ACCEPTS REQUESTS THAT ARE X-WWW-FORM-URLENCODED (DEFAULT IN CURL)

// These are the endpoints

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});

router.get('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Get a Postgres client from the connection pool
  client.connect((err, client, done) => {
    // Handle connection errors
    if(err) {
      // done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC;');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      // done();
      return res.json(results);
    });
  });
});

// change to use promises
router.post('/api/v1/todos', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {text: req.body.text, complete: false};
  // Get a Postgres client from the connection pool
  // pg.connect(connectionString, (err, client, done) => {
    // callback - checkout a client
    //pool.connect((err, client, done) => { // using pool method
    client.connect((err, client, done) => { // using client method
    // Handle connection errors
    if(err) {
      // done();  // done is not a function?
      console.log(err);
      // client.release(); // release client to the pool
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    client.query('INSERT INTO items(text, complete) values($1, $2)',
    [data.text, data.complete]);
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM items ORDER BY id ASC');
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', () => {
      // done();  // done is not a function? 
      // client.release(); // release client to the pool?
      return res.json(results);
    });
  });
});

// UPDATE
router.put('/api/v1/todos/:todo_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.todo_id;
  console.log('id: ' + id);
  console.log('req.body.text: ' + req.body.text);

  // Grab data from http request
  const data = {text: req.body.text, complete: req.body.complete};
  // const data = {text: req.params.text, complete: req.params.complete};
  // Get a Postgres client from the connection pool
  // pg.connect(connectionString, (err, client, done) => {
    client.connect((err, client, done) => { // using client method
    // Handle connection errors
    if(err) {
      // done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    } else {
      console.log(req.body.text);
    }
    // SQL Query > Update Data
    client.query('UPDATE items SET text=($1), complete=($2) WHERE id=($3)',
    [data.text, data.complete, id]);
    console.log('update succeeded');
    // SQL Query > Select Data
    const query = client.query("SELECT * FROM items ORDER BY id ASC");
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      // done();
      return res.json(results);
    });
  });
});


module.exports = router;
