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

// GET single house by ID
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
app.post('/house', (req, res) => {
  console.log(req.body); // Log the request body to check if it's populated
  const { listing_id, price } = req.body;
  
  if (!listing_id || !price) {
    return res.status(400).send('Listing id and price are required');
  }

  const sql = 'INSERT INTO listing(listing_id, price) VALUES (?, ?)';
  
  db.run(sql, [listing_id, price], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal server error');
    }
    const id = this.lastID;
    res.status(201).send({ listing_id, price });
  });
});


// PUT update product by ID
app.put('/house/:id', (req, res) => {
  const { id } = req.params;  // Get product ID from params
  const { listing_id, price } = req.body;
  
  // Check for missing fields
  if (!listing_id || !price) {
    return res.status(400).send('Listing id and price are required');
  }

  // SQL to update product by ID
  const sql = 'UPDATE listing SET listing_id = ?, price = ? WHERE id = ?';
  
  db.run(sql, [listing_id, price, id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal server error');
    }

    // Check if any row was updated
    if (this.changes === 0) {
      return res.status(404).send('Product not found');
    }

    // Send response with updated data
    res.status(200).send({ listing_id, price });
  });
});


// DELETE remove product by ID
app.delete('/house/:id', (req, res) => {
  const { id } = req.params;  // Get the listing ID from the URL params

  // SQL to delete the product by ID
  const sql = 'DELETE FROM listing WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal server error');
    }

    // Check if any row was affected (i.e., if the listing existed)
    if (this.changes === 0) {
      return res.status(404).send('Listing not found');
    }

    // Successfully deleted
    res.status(200).send({ message: `Listing with id ${id} has been deleted` });
  });
});


