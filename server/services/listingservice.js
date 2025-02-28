import db from '../database.js'

export const getAllListings = async () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM listing', (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

export const getListingById = async (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM listing WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const addListing = async (listingData) => {
    const { price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl } = listingData;
    return new Promise((resolve, reject) => {
        db.run(
            'INSERT INTO listing (price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl],
            function (err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, ...listingData });
            }
        );
    });
};

export const updateListing = async (id, updateData) => {
    const { price, location } = updateData;
    return new Promise((resolve, reject) => {
        db.run(
            'UPDATE listing SET price = ?, location = ? WHERE id = ?',
            [price, location, id],
            function (err) {
                if (err) reject(err);
                else resolve(this.changes);
            }
        );
    });
};

export const deleteListing = async (id) => {
    return new Promise((resolve, reject) => {
        db.run('DEL\ETE FROM listing WHERE id = ?', [id], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
};
