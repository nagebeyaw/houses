import express from 'express';
import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('listing.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('Connected to the SQLite database.');
    }
  });
  
const router = express.Router();
// Get all houses
router.get('/', (req, res) => {
    db.all('SELECT * FROM listing', (err, rows) => {
      if (err) {
        console.error(err.message);
        res.status(500).send('Internal server error');
      } else {
        res.send(rows);
      }
    });
  });
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.get('SELECT * FROM listing WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).send('Internal server error');
    } else if (!row) {
      res.status(404).send('Listing not found');
    } else {
      res.send(row); // Ensure it's sending a single row
    }
  });
});

router.post('/:id', (req, res) => {
    console.log(req.body); // Log the request body to debug
  
    const { price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl } = req.body;
  
    db.run(
      'INSERT INTO listing (price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.status(201).json({ message: 'Listing added successfully', data: req.body });
      }
    );
  });
/// PUT update product by ID
router.put('/:id', (req, res) => {
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
  // Delete a house listing by ID
router.delete('/:id', (req, res) => {
    console.log(req.params); // Log request params to check if ID is populated
    const { id } = req.params; 
  
    const sql = 'DELETE FROM listing WHERE id = ?';
  
    db.run(sql, [id], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: 'Internal server error', error: err.message });
      }
  
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Listing not found' });
      }
  
      res.status(200).json({ message: `Listing with id ${id} has been deleted` });
    });
  });
  

export default router;
