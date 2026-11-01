const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./books.db');

db.serialize(() => {
  // Create the table as required by the lab
  db.run(`CREATE TABLE IF NOT EXISTS book(
    id INTEGER PRIMARY KEY, 
    title TEXT, 
    author TEXT, 
    price INTEGER, 
    pages INTEGER
  )`);

  // Insert 8 rows of data
  const insertQuery = `INSERT INTO book (title, author, price, pages) VALUES 
    ('The Great Gatsby', 'F. Scott Fitzgerald', 300, 180),
    ('To Kill a Mockingbird', 'Harper Lee', 450, 281),
    ('1984', 'George Orwell', 350, 328),
    ('Pride and Prejudice', 'Jane Austen', 250, 432),
    ('The Catcher in the Rye', 'J.D. Salinger', 400, 277),
    ('The Hobbit', 'J.R.R. Tolkien', 500, 310),
    ('Fahrenheit 451', 'Ray Bradbury', 320, 249),
    ('Moby-Dick', 'Herman Melville', 600, 635)`;
    
  db.run(insertQuery, (err) => {
    if (err) console.log(err);
    else console.log("Success: Table created and 8 rows inserted!");
  });
});

db.close();