document.addEventListener('DOMContentLoaded', function () {
  const baseURL = 'http://localhost:3000/';

  class Book {
    constructor(bookName, author) {
      this.bookName = bookName;
      this.author = author;
    }
  }

  class Request {
    constructor(readerName, email, bookName, status) {
      this.readerName = readerName;
      this.email = email;
      this.bookName = bookName;
      this.status = status;
    }
  }

  async function ShowBooks() {
    const bookSelect = document.getElementById('bookSelect');
    bookSelect.innerHTML = '';

    const response = await fetch(baseURL + 'books');
    const bookNames = await response.json();

    bookNames.forEach(bookName => {
      const option = document.createElement('option');
      option.textContent = bookName;
      bookSelect.appendChild(option);
    });
  }

  ShowBooks();

  document.getElementById('addBookForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const author = document.getElementById('author').value;
    const bookName = document.getElementById('bookName').value;

    const newBook = new Book(bookName, author);

    const addBookResponse = await fetch(baseURL + 'addBook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    });

    const addBookMessage = await addBookResponse.text();
    document.getElementById('addBookMessage').textContent = addBookMessage;
    document.getElementById('addBookForm').reset();

    ShowBooks();
  });

  document.getElementById('takeBookForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const readerName = document.getElementById('readerName').value;
    const email = document.getElementById('email').value;
    const bookName = document.getElementById('bookSelect').value;

    const newRequest = new Request(readerName, email, bookName, 'taken');

    const takeBookResponse = await fetch(baseURL + 'takeBook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRequest),
    });

    const takeBookMessage = await takeBookResponse.text();
    document.getElementById('takeBookMessage').textContent = takeBookMessage;
    document.getElementById('takeBookForm').reset();

    ShowBooks();
    DisplayOnScreen();
  });
  
  async function DisplayOnScreen() {
    const response = await fetch(baseURL + 'bookStatus');
    const booksWithStatus = await response.json();
    displayBooksWithStatus(booksWithStatus);
  }
  
  function displayBooksWithStatus(booksWithStatus) {
    const bookStatusElement = document.getElementById('bookStatus');
    bookStatusElement.innerHTML = '';

    booksWithStatus.forEach(book => {
      const bookStatusEntry = document.createElement('div');
      bookStatusEntry.textContent = `Grāmata: ${book.book_name} - Lasītājs: ${book.reader_name}, Epasts: ${book.email}, Izņemšanas datums: ${book.take_date}, Atgriežšans datums: ${book.return_date}`;
      bookStatusElement.appendChild(bookStatusEntry);
    });
  }
  
  DisplayOnScreen();
});
