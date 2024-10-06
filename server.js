const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware to parse request body
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection Setup
const db = mysql.createConnection({
    host: 'localhost', // Replace with your database host
    user: 'root', // Replace with your MySQL username
    password: 'Devi@2002', // Replace with your MySQL password
    database: 'gaming_website' // Replace with your database name
});

db.connect(err => {
    if (err) {
        console.error('Database connection error: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});


app.get('/',(req,res) => {
    res.send('Hello this is index page')
})
// Route for handling signup form submission
app.post('/Signup.html', (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    if (password !== confirm_password) {
        return res.status(400).send('Passwords do not match.');
    }

    // Insert user data into the database
    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            return res.status(500).send('Error inserting user into database.');
        }
        res.send('Signup successful!');
    });
});

// Route for handling login form submission
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).send('Error querying the database.');
        }

        if (result.length > 0) {
            res.send('Login successful!');
        } else {
            res.status(401).send('Invalid email or password.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
