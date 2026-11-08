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

// 1. GET /books/ with Query Parameters & Price Filter
app.get('/books/', async (req, res) => {
    const {
        search_q = '',
        order_by = 'id',
        order = 'ASC',
        limit = 10,
        offset = 0,
        min_price = 0,
        max_price = 100000
    } = req.query;

    // Whitelist column names and sort direction to prevent SQL injection in ORDER BY
    const validColumns = ['id', 'title', 'author', 'price', 'pages'];
    const sortColumn = validColumns.includes(order_by) ? order_by : 'id';
    const sortOrder = order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const getBooksQuery = `
        SELECT * FROM book
        WHERE title LIKE ?
          AND price BETWEEN ? AND ?
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT ? OFFSET ?;
    `;

    const booksArray = await db.all(getBooksQuery, [
        `%${search_q}%`,
        Number(min_price),
        Number(max_price),
        Number(limit),
        Number(offset)
    ]);

    res.status(200).send(booksArray);
});

// 2. GET /books/:bookId/ with 404 Check
app.get('/books/:bookId/', async (req, res) => {
    const { bookId } = req.params;
    const getBookQuery = `SELECT * FROM book WHERE id = ?;`;
    const book = await db.get(getBookQuery, [bookId]);

    if (!book) {
        return res.status(404).send({ message: "Book not found" });
    }
    res.status(200).send(book);
});

// 3. POST /books/ with 400 Input Validation
app.post('/books/', async (req, res) => {
    const { title, author, price, pages } = req.body;

    if (!title || String(title).trim() === '') {
        return res.status(400).send({ message: "Title is required" });
    }
    if (!author || String(author).trim() === '') {
        return res.status(400).send({ message: "Author is required" });
    }
    if (price === undefined || price === null || price === '' || isNaN(Number(price))) {
        return res.status(400).send({ message: "Price must be a valid number" });
    }

    const addBookQuery = `
        INSERT INTO book (title, author, price, pages)
        VALUES (?, ?, ?, ?);
    `;
    const dbResponse = await db.run(addBookQuery, [
        title.trim(),
        author.trim(),
        Number(price),
        pages ? Number(pages) : null
    ]);

    res.status(201).send({
        message: "Book Added Successfully",
        bookId: dbResponse.lastID
    });
});

// 4. PUT /books/:bookId/ with 404 and 400 Checks
app.put('/books/:bookId/', async (req, res) => {
    const { bookId } = req.params;
    const { title, author, price, pages } = req.body;

    const existingBook = await db.get(`SELECT * FROM book WHERE id = ?;`, [bookId]);
    if (!existingBook) {
        return res.status(404).send({ message: "Book not found" });
    }

    if (!title || !author || price === undefined || isNaN(Number(price))) {
        return res.status(400).send({ message: "Valid title, author, and numeric price are required" });
    }

    const updateBookQuery = `
        UPDATE book
        SET title = ?, author = ?, price = ?, pages = ?
        WHERE id = ?;
    `;
    await db.run(updateBookQuery, [title, author, Number(price), pages, bookId]);
    res.status(200).send({ message: "Book Updated Successfully" });
});

// 5. DELETE /books/:bookId/ with 404 Check
app.delete('/books/:bookId/', async (req, res) => {
    const { bookId } = req.params;

    const existingBook = await db.get(`SELECT * FROM book WHERE id = ?;`, [bookId]);
    if (!existingBook) {
        return res.status(404).send({ message: "Book not found" });
    }

    const deleteBookQuery = `DELETE FROM book WHERE id = ?;`;
    await db.run(deleteBookQuery, [bookId]);
    res.status(200).send({ message: "Book Deleted Successfully" });
});