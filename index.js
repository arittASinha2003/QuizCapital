import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);
const app = express();
const port = process.env.PORT || 3000;

let quiz = [];
let totalQuestions = 0; // Total questions user wants to attempt
let currentQuestionIndex = 0; // Current question index
let currentQuestion = {}; // Current question
let totalCorrect = 0;

async function connectToDB() {
  try {
    await client.connect();
    const db = client.db('quizdb');
    const collection = db.collection('capitals');
    
    // Fetch quiz data from MongoDB
    const result = await collection.find().toArray();
    quiz = result;

    console.log("Connected to MongoDB and fetched quiz data.");
  } catch (err) {
    console.error("Error connecting to the database", err);
    process.exit(1);  // Exit if database connection fails
  }

  // Start the server after successfully fetching the quiz data
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

connectToDB();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Initial route to ask the number of questions
app.get("/", (req, res) => {
  res.render("start.ejs");
});

app.post("/start", (req, res) => {
  totalQuestions = parseInt(req.body.totalQuestions, 10);
  
  // Limit the number of questions to 36 if more than 36 is selected
  if (totalQuestions > quiz.length) {
    totalQuestions = quiz.length;
  }

  totalCorrect = 0;
  currentQuestionIndex = 0;  // Reset question index
  shuffleQuiz(quiz); // Shuffle the quiz each time the quiz restarts
  nextQuestion();
  res.render("index.ejs", { question: currentQuestion, totalScore: totalCorrect, wasCorrect: null });
});

// POST a new answer
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;

  // Check if the answer is correct
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }

  currentQuestionIndex++;

  // If more questions remain, show the next question
  if (currentQuestionIndex < totalQuestions) {
    nextQuestion();
    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: isCorrect,
      totalScore: totalCorrect,
    });
  } else {
    // If all questions have been answered, show the result page
    res.render("end.ejs", {
      totalScore: totalCorrect,
      maxScore: totalQuestions,
      completed: isCorrect && currentQuestionIndex === totalQuestions,
    });
  }
});

// Function to get the next question
function nextQuestion() {
  if (currentQuestionIndex < quiz.length) {
    currentQuestion = quiz[currentQuestionIndex];  // Get the next shuffled question
  } else {
    currentQuestion = null; // If no more questions, show null
  }
}

// Function to shuffle the quiz questions
function shuffleQuiz(quizArray) {
  for (let i = quizArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizArray[i], quizArray[j]] = [quizArray[j], quizArray[i]];  // Swap elements
  }
}
