# Redirect Backend

A simple backend project built using Node.js, Express, and MongoDB.

## Installation

Install all dependencies:

```bash
npm install
```

---

## Environment Setup

Create a `.env` file in the root directory and add the following:

```env
MONGODB_URL=your_mongodb_connection_string
PORT=5000
```

Example:

```env
MONGODB_URL=mongodb://127.0.0.1:27017/redirect
PORT=5000
```

---

## Run the Project

Start the development server:

```bash
npm run server
```

Or start normally:

```bash
npm start
```

---

## .gitignore

Make sure your `.gitignore` file contains:

```gitignore
node_modules
.env
```

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv