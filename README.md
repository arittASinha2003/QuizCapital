
# Capital City Quiz Application

The Capital City Quiz Application is a `Node.js` web application that quizzes users on the capital cities of various states of India, stored in `MongoDB Atlas`. Users can specify the number of questions they want to attempt, and the quiz will end either when the specified number of questions has been answered or when a wrong answer is given.

Quiz Web App Link: [Click Here](https://quizcapital.onrender.com/)

## Features

- Allows users to specify the number of quiz questions.
- Randomly selects questions from a database of capital cities.
- Tracks and displays the user's score.

## Prerequisites

- Node.js and npm installed. [Click Here](https://nodejs.org/)
- MongoDB Cloud Atlas setup with a database named `quizdb`, and collection name as `capitals`, containing documents with `state` and `capital` parameters. [Click Here](https://cloud.mongodb.com/)

## Installation

1. **Clone the repository:**

```bash
  git clone https://github.com/arittASinha2003/QuizCapital.git
  cd QuizCapital
```

2. **Install dependencies:**

```bash
  npm install
```

3. **Set up environment variables:**

Create a `.env` file in the root directory and add your database connection string and port number:

```plaintext
  MONGODB_URI = your_connection_string_here
  PORT = 8080
```

4. **Run the application:**

```bash
  npm start
```

5. **Open your browser and navigate to:**

```plaintext
  https://localhost:8080/
```

## Folder Structure

```plaintext
QuizCapital/
├── node_modules/
├── public/
│   ├── images/
│   │   ├── background.jpg
│   ├── styles/
│       ├── main.css
├── views
│   ├── start.ejs
│   ├── index.ejs
│   ├── end.ejs
├── .env
├── index.js
├── package.json
├── package-lock.json
```
