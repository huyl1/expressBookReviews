const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function doesExist(username) {
  const user = users.find((user) => user.username === username);

  return !!user;
}
public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books), 600);
  });

  promise.then((result) => {
    return res.status(200).json({ books: result });
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  //Write your code here
  const promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(books[req.params.isbn]), 600);
  });

  const book = await promise;

  if (book) {
    return res.status(200).json({ book });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get("/author/:author", async function (req, res) {
    const authorName = req.params.author;
  
    try {
      const booksFilteredByAuthor = Object.values(books).filter(b => b.author === authorName);
  
      if (booksFilteredByAuthor.length > 0) {
        res.status(200).json({ books: booksFilteredByAuthor });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
    const title = req.params.title;
  
    try {
      const booksFilteredByTitle = Object.values(books).filter(b => b.title === title);
  
      if (booksFilteredByTitle.length > 0) {
        res.status(200).json({ books: booksFilteredByTitle });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  });

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).json({ reviews: books[isbn].reviews });
});

module.exports.general = public_users;