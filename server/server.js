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
app.use(express.json());  // This allows req.body to contain parsed JSON data

const port = 3001

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
      res.send(rows);
    }
  });
});
app.post('/house', (req, res) => {
  console.log(req.body); // Log the request body to check if it's populated
  const data = req.body 
  const price = data.price
  const sqrft = data.sqrft
  const beds = data.beds
  const baths = data.baths
  const type = data.type
  const location = data.location
  const dateListed = data.dateListed
  const status = data.status
  const interestedPpl = data.interestedPpl
  console.log(data.price)
  console.log(sqrft, beds, location)
  
  
    
  db.run('INSERT INTO listing (price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl],(err) => {if (err) 
    console.error(err);
    return (err)
  })

  res.status(200)?
  res.json({message:'This was put into the database', data: req.body})
  :
  res.json({message: 'data inputted'})
  
})


// PUT update product by ID
app.put('/house/:id', (req, res) => {
  const { id } = req.params;  // Get product ID from params
  
  // Check for missing fields
  if (!price || !location) {
    return res.status(400).send('id and price are required');
  }
  else {
  // SQL to update product by ID
  const sql = 'UPDATE listing SET id = ?, price = ? WHERE id = ?';
  
  db.run(sql, [id, price, location], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).send('Internal server error');
    }
      else if (this.changes === 0)
    // Check if any row was updated
      return res.status(404).send('listing not found');
    
    else {
    // Send response with updated data
      res.status(200).send({ id, price, location });
      }
    });
  }
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

