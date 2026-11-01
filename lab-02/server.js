const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, 'books.db');
let db = null;

const initializeDBAndServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server Running at http://localhost:${PORT}/`);
        });
    } catch (error) {
        console.log(`DB Error: ${error.message}`);
        process.exit(1);
    }
};

initializeDBAndServer();

// 1. GET all books
app.get('/books/', async (req, res) => {
    const getBooksQuery = `SELECT * FROM book;`;
    const booksArray = await db.all(getBooksQuery);
    res.status(200).send(booksArray);
});

// 2. GET one book by ID
app.get('/books/:bookId/', async (req, res) => {
    const { bookId } = req.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);
    res.status(200).send(book);
});

// 3. POST (Add) a new book
app.post('/books/', async (req, res) => {
    const { title, author, price, pages } = req.body;
    const addBookQuery = `
        INSERT INTO book (title, author, price, pages)
        VALUES (?, ?, ?, ?);`;
    await db.run(addBookQuery, [title, author, price, pages]);
    res.status(201).send({ message: "Book Added Successfully" });
});

// 4. PUT (Update) a book
app.put('/books/:bookId/', async (req, res) => {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;
    const updateBookQuery = `
        UPDATE book
        SET title = ?, author = ?, price = ?, pages = ?
        WHERE id = ?;`;
    await db.run(updateBookQuery, [title, author, price, pages, bookId]);
    res.status(200).send({ message: "Book Updated Successfully" });
});

// 5. DELETE a book
app.delete('/books/:bookId/', async (req, res) => {
    const { bookId } = req.params;
    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteBookQuery, [bookId]);
    res.status(200).send({ message: "Book Deleted Successfully" });
});