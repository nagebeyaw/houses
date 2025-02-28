import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('listing.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

export default db;
