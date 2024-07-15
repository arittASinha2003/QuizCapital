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

    const result = await collection.find().toArray();
    quiz = result;

    // Start the server after fetching quiz data
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (err) {
    console.error("Error connecting to the database", err);
  }
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
  totalCorrect = 0;
  currentQuestionIndex = 0;
  nextQuestion();
  res.render("index.ejs", { question: currentQuestion, totalScore: totalCorrect, wasCorrect: null });
});

// POST a new answer
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    isCorrect = true;
  }

  currentQuestionIndex++;
  if (currentQuestionIndex < totalQuestions) {
    nextQuestion();
    res.render("index.ejs", {
      question: currentQuestion,
      wasCorrect: isCorrect,
      totalScore: totalCorrect,
    });
  } else {
    res.render("end.ejs", {
      totalScore: totalCorrect,
      maxScore: totalQuestions,
      completed: isCorrect && currentQuestionIndex === totalQuestions,
    });
  }
});

function nextQuestion() {
  if (quiz.length > 0) {
    const randomState = quiz[Math.floor(Math.random() * quiz.length)];
    currentQuestion = randomState;
  } else {
    currentQuestion = null;
  }
}
