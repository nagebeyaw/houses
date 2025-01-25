import express from 'express';
const app = express()
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('listing.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

const port = 3000

app.get('/house', (req, res) => {
  //Gets all houses
  db.all('SELECT * FROM listing', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else {
      res.send(rows);
    }
  }); 
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// GET single product by ID
app.get('/house/:listing_id', (req, res) => {
  const  listing_id  = parseInt(req.params.listing_id);
  db.get('SELECT * FROM listing WHERE listing_id = ?', [listing_id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else if (!row) {
      res.status(404).send('Listing not found');
    } else {
      res.send(row);
    }
  });
});

app.delete('')