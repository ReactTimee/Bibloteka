const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port =  3000;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database('gramatas.db', (err) => {
  if (err) {
    console.error('Datubaze neiet:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT,
            book_name TEXT
        )`);
    db.run(`CREATE TABLE IF NOT EXISTS requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reader_name TEXT,
            email TEXT,
            book_name TEXT,
            status TEXT
        )`);
    db.run(`CREATE TABLE IF NOT EXISTS book_status (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reader_name TEXT,
            email TEXT,
            book_name TEXT,
            status TEXT,
            take_date TEXT DEFAULT (strftime('%Y-%m-%d', 'now')),
            return_date TEXT DEFAULT (strftime('%Y-%m-%d', 'now', '+14 days'))
        )`);
  }
});

app.post('/addBook', (req, res) => {
  const { author, bookName } = req.body;
  db.run('INSERT INTO books (author, book_name) VALUES (?, ?)', [author, bookName]), 
    console.log('Gramata pievienota:', bookName);

});

app.post('/takeBook', (req, res) => {
  const { readerName, email, bookName } = req.body;
  db.run('INSERT INTO requests (reader_name, email, book_name, status) VALUES (?, ?, ?, ?)', [readerName, email, bookName, 'taken']),
    console.log('LasitajsPievienots:', bookName);
    db.run('INSERT INTO book_status (reader_name, email, book_name, status) VALUES (?, ?, ?, ?)', [readerName, email, bookName, 'taken']),
      console.log('GramatasStatus:', bookName);
   

});

app.get('/bookStatus', (req, res) => {
  db.all('SELECT * FROM book_status', (err, rows) => {
    res.json(rows);
  });
});

app.get('/books', (req, res) => {
  db.all('SELECT book_name FROM books', (err, rows) => {
    if (err) {
      return res.status(500).send('Error fetching books');
    }
    const bookNames = rows.map(row => row.book_name);
    res.json(bookNames);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
