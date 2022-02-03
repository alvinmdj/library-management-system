# Library Management System

Library Management System is a full stack monolith web application build with Node.js, Express.js and MongoDB (and Bootstrap).

This app is build for practice purpose and available publicly, where user can view all books, popular books, recently added books, filter book by genres, and search book by title.

Some features requires user authentication to be available, such as accessing the book cart, borrowing book(s), view currently borrowed book(s), view their profile, and their borrow history.

User authenticated as admin can access the admin dashboard where admin can perform CRUD for books, view borrow history of all user, and view all user public information.

The live application is only for demo and fully hosted on Heroku. Uploaded file won't be stored permanently because of [Heroku ephemeral file system](https://devcenter.heroku.com/articles/active-storage-on-heroku).

## Links

- [Repository](https://github.com/alvinmdj/library-management-system "Library Management System Repo")

- [Live Demo](https://alvinmd-library.herokuapp.com/ "Live Demo")

## Build With
- [Node.js](https://nodejs.org/en/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Bootstrap 5](https://getbootstrap.com/)

# Getting Started

## Prerequisites
These are the requirements to run this project.
- [Node.js v16+](https://nodejs.org/en/)
- [npm v8+](https://www.npmjs.com/)

## Installation

Clone this repository

```sh
git clone https://github.com/alvinmdj/library-management-system.git
```

Change to the project directory
```sh
cd library-management-system
```

Install NPM packages
```sh
npm install
```

Duplicate .env.example file and rename it as .env and setup the envinronment variables
```sh
PORT=PORT_NUMBER
DB_URL=ENTER_YOUR_MONGODB_URL
JWT_PRIVATE_KEY=ENTER_YOUR_UNIQUE_JWT_PRIVATE_KEY
```

Run (development)
```sh
npm start
```
