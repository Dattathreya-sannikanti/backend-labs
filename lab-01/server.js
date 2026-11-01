const express = require('express');
const app = express();

// GET / : Welcome text
app.get('/', (req, res) => {
    res.status(200).send('Welcome to Lab 1 Express Server');
});

// GET /about : JSON with name and section
app.get('/about', (req, res) => {
    res.status(200).json({
        name: "Venkata Datthathreya Sannikanti",
        section: "CSE"
    });
});

// GET /time : Current date and time
app.get('/time', (req, res) => {
    res.status(200).send(new Date().toString());
});

// 404 message for any unknown path
app.use((req, res) => {
    res.status(404).send('404: Route Not Found');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});