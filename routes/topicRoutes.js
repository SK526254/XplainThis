const express = require("express");
const app = express();
const topicRouter = express.Router();
const protected = require("../utils/protected")

// * requring  models
const Topic = require("../models/topicsModel");
const Question = require("../models/questionsModel");
const Answer = require("../models/answersModel");
const User = require("../models/usersModel");

// ! fetching topics
let topics
(async function () {
  try {
     topics = await Topic.find({});
  } catch {
    console.error(error.message);
  }
})()
// ! "/" route -renders topics

topicRouter.get("/", protected , async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.render("topics/index", { topics: topics });
  } catch {
    console.error(error.message);
    res.redirect(`/`);
  }
});

//! "/:id" routes -retriving , rendering questions
topicRouter.get("/:id", protected , async (req, res) => {
 
  try {
    // retriving  question documents and answer documents in the topic
    let questions = [];
    let answers = [];
    const topics  = await Topic.find({});
    
          const questionsObj = (
            await Topic.find({ name: req.params.id }).populate("questions")
          )[0].questions;
        
          questionsObj.forEach(async(question) =>{
            if(question[question.length-1] == '?') {
              question = question.slice(0, question.length-2)
            }
            questions.push(question.questionDescription);
          }
          );
    res.render("topics/topic.ejs", {
      topic: req.params.id,
      questions: questions,
      topics:topics
    });
  } catch (error) {
    console.error(error.message);
    res.redirect(`/topics/${req.params.id}`);
  }
});
// ! rendering new question page
topicRouter.get("/:id/new", protected , (req, res) => {
  const topic = req.params.id;
  const question = req.params.question;
    res.render("topics/new", { topic: topic, question: question ,topics:topics });
  
});

// ! "/:id/new" rendering answer page
topicRouter.get("/:id/:question", protected , async(req, res) => {
  const topic = req.params.id;
  const question = req.params.question;
  try {
    const questionFound = await Question.findOne({questionDescription : `${question}`})
    if(questionFound != null){
     return res.render("topics/newA", { topic: topic, question: question ,topics:topics});
    }else{
      throw new Error("Question Not Found...!")
    }
  } catch (error) {
    res.redirect(`/topics/${topic}`);
  }

  
});
// ! post route for adding questions to the data base
topicRouter.post("/:id", protected , async (req, res) => {
  let topicName = req.params.id;
  const  question = questionMarkChecker(req.body.questionContent ,req.body.questionContent.length);
  
  //saving questions and referencing them into topics and User 
  try {
    const foundQuestion = await Question.find({questionDescription : question})
    if (foundQuestion.length >0) {
      throw new Error('The Question already existed.')
    }
    const topic = await Topic.find({ name: topicName });
    const user = await User.findOne({_id : req.session.userAuth})
  // Creating new Question 
    const savedQuestion = await Question.create({
      questionDescription:question,
      topic: topic[0]._id,
      userQuestioner : user.name,
    });
    // Updating user's questionsAsked 
    user.questionsAsked = savedQuestion._id;
    // Resaving the user
   const userSaved =await user.save();

    const topicFound = await Topic.findById(topic[0].id);
    if (!topicFound) return res.send("topic not dound");
    topicFound.questions.push(savedQuestion._id);
    const savedTopic = await topicFound.save();
    res.redirect("/topics/" + topicName);
  } catch (error) {
    const topics = await Topic.find({});
    res.render("topics/index", {
      topics: topics,
      errorMessage: error.message,
    });
  }
});

// ! question marker checker
function questionMarkChecker(string ,length) {
  if (string.charAt(length-1) == "?" || string.charAt(length-1) == " ") {
    string = string.substring(0,string.length-1);
    return questionMarkChecker(string , length-1);
  }else{
    return string
  }
}

// ! "/:id/:question " post route for saving the Answer into the database
topicRouter.post("/:id/:question", protected , async (req, res) => {
  const question = req.params.question;
  const topic = req.params.id;
  const answer = req.body.answerContent;

  try {
    
    // finding question  
    let questionFound = await Question.find({ questionDescription: question });
    questionFound = await Question.findById(questionFound[0].id);
    
    if (!questionFound) res.send("Question not Found.!");
    // finding Wheather answer is present or not
    const foundAnswer = await Answer.find({answer : answer})
    if (foundAnswer.length >0) {
      throw new Error('The Answer is already exists..!')
    }
    // finding user
    const user = await User.findOne({_id : req.session.userAuth})
    // creating user with user
    const savedAnswer = await Answer.create({
      answer: answer,
      userAnswerer : user.name,
    });
     questionFound.answers.push(savedAnswer._id);

    questionFound = await questionFound.save();

    res.redirect(`/topics/${topic}/${question}/show`);
  } catch (error) {
    console.error(error);
    res.redirect(`/topics/${topic}`)
  }
});


topicRouter.get("/:id/:question/show", protected ,async (req, res) => {
  const topic = req.params.id;
  const question = req.params.question;
  let answers = []
  let votes =[20 , 30 , 323 , 234 , 4234 ,2 ,53245 , 5425]
  try {
    const topics  = await Topic.find({});
    const answersObj = (await Question.find({questionDescription : question}).populate('answers'))[0].answers

    answersObj.forEach(async(answer) =>{
      answers.push(answer.answer);   
    })

    
    res.render("topics/show", { topic: topic, question: question , answers : answers , topics : topics , votes : votes});
  } catch (error) {
    console.error(error.message);
    res.redirect(`/topics/${topic}/`)
  }
  
});

module.exports = topicRouter

// For Deleting Questions and Answers

// async function deleteAnswers() {
//   try {
//     await Answer.deleteMany();
//     console.log("delted");

//   } catch (error) {
//     console.error(error);
//   }
//   }
// deleteAnswers();