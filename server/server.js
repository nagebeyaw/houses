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


/// PUT update product by ID
app.put('/house/:id', (req, res) => {
  console.log(req.body);  // Log the request body to check if it's populated
  const { id } = req.params;  // Get house ID from params
  const data = req.body;  // Extract the request body

  const price = data.price;
  const location = data.location;

  console.log(price, location);  // Log price and location for debugging

  // Check for missing fields
  if (!price || !location) {
    return res.status(400).json({ message: 'Price and location are required' });
  }

  // SQL to update product by ID
  const sql = 'UPDATE listing SET price = ?, location = ? WHERE id = ?';

  db.run(sql, [price, location, id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Internal server error' });
    } else if (this.changes === 0) {
      // Check if any row was updated
      return res.status(404).json({ message: 'Listing not found' });
    } else {
      // Send response with updated data
      return res.status(200).json({
        message: 'Listing updated successfully',
        data: { id, price, location }
      });
    }
  });
});


// DELETE remove product by ID
app.delete('/house/:id', (req, res) => {
  console.log(req.params);  // Log the request params to check if the ID is populated
  const { id } = req.params;  // Get the listing ID from the URL params
  
  // SQL to delete the product by ID
  const sql = 'DELETE FROM listing WHERE id = ?';

  db.run(sql, [id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
    }

    // Check if any row was affected (i.e., if the listing existed)
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Successfully deleted
    res.status(200).json({ message: `Listing with id ${id} has been deleted` });
  });
});
