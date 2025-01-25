
const sqlite3 = require( "sqlite3")
const database  = new sqlite3.Database('.listing.db',  )

function createTables() {
    database.exec(`
    CREATE TABLE IF NOT EXISTS listing (
        listing_id INTEGER PRIMARY  KEY NOT NULL,
        price TEXT, 
        sqrft TEXT,
        beds TEXT,
        baths TEXT,
        type TEXT,
        location TEXT,
        dateListed TEXT,
        status TEXT,
        interestedPpl INTEGER
    )`)}
function listing(){
    database.exec(`
        INSERT INTO listing (price, sqrft, beds, baths, type, location, dateListed, status, interestedPpl) 
        VALUES( '203k', "2000", "4", "2", "Single Family Home", "123 Maple St, Greenview", "17-01-03", "Available", 38 )`,


        (error) => {
            if (error) { return error; }

        })


}
       
createTables()
listing()


       




