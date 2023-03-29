const express = require("express");
const app = express();
const router = express.Router();

// * requring  models
const Topic = require("../models/topicsModel");
const Question = require("../models/questionsModel");
const Answer = require("../models/answersModel");

// ! "/" route -renders topics

router.get("/", async (req, res) => {
  try {
    const topics = await Topic.find({});
    res.render("topics/index", { topics: topics });
  } catch {
    console.error(error.message);
    res.redirect(`/`);
  }
});

//! "/:id" routes -retriving , rendering questions
router.get("/:id", async (req, res) => {
 
  try {
    // retriving  question documents and answer documents in the topic
    let questions = [];
    let answers = [];
    
          const questionsObj = (
            await Topic.find({ name: req.params.id }).populate("questions")
          )[0].questions;
        
          questionsObj.forEach(async(question) =>{
            questions.push(question.questionDescription);
          }
          );
    res.render("topics/topic.ejs", {
      topic: req.params.id,
      questions: questions,
    });
  } catch (error) {
    console.error(error.message);
    res.redirect(`/topics/${req.params.id}`);
  }
});

router.get("/:id/new", (req, res) => {
  const topic = req.params.id;
  const question = req.params.question;
    res.render("topics/new", { topic: topic, question: question });
  
});

// ! "/:id/new" 
router.get("/:id/:question", (req, res) => {
  const topic = req.params.id;
  const question = req.params.question;
    res.render("topics/newA", { topic: topic, question: question });
  
});
// ! post route for adding questions to the data base
router.post("/:id", async (req, res) => {
  let topicName = req.params.id;

  //saving questions and referencing them into topics
  try {
    const topic = await Topic.find({ name: topicName });

    const savedQuestion = await Question.create({
      questionDescription: req.body.questionContent,
      topic: topic[0]._id,
    });
    const topicFound = await Topic.findById(topic[0].id);
    if (!topicFound) res.send("topic not dound");
    topicFound.questions.push(savedQuestion._id);
    const savedTopic = await topicFound.save();
    res.redirect("/topics/" + topicName);
  } catch (error) {
    const topics = await Topic.find({});
    res.render("topics/index", {
      topics: topics,
      errorMessage: "Question not added..!",
    });
  }
});

// ! "/:id/:question " post route for saving the Answer into the database
router.post("/:id/:question", async (req, res) => {
  const question = req.params.question;
  const topic = req.params.id;
  const answer = req.body.answerContent;
  // console.log(answer);

  try {
    const foundAnswer = await Answer.find({answer : answer})
    if (foundAnswer.length >0) {
      throw new Error('The Answer is already asked')
    }
    const savedAnswer = await Answer.create({
      answer: answer,
    });
    let questionFound = await Question.find({ questionDescription: question });
    questionFound = await Question.findById(questionFound[0].id);
 

    if (!questionFound) res.send("Topic not Found.!");
     questionFound.answers.push(savedAnswer._id);

    questionFound = await questionFound.save();

    res.redirect(`/topics/${topic}/${question}/show`);
  } catch (error) {
    console.error(error);
    res.redirect(`/topics/${topic}`)
  }
});


router.get("/:id/:question/show",async (req, res) => {
  const topic = req.params.id;
  const question = req.params.question;
  let answers = []
  let votes =[20 , 30 , 323 , 234 , 4234 ,2 ,53245 , 5425]
  try {
    const answersObj = (await Question.find({questionDescription : question}).populate('answers'))[0].answers
    answersObj.forEach(async(answer) =>{
      answers.push(answer.answer);   
    })
    
    res.render("topics/show", { topic: topic, question: question , answers : answers , votes : votes});
  } catch (error) {
    console.error(error.message);
    res.redirect(`/topics/${topic}/`)
  }
  
});





module.exports = router;



// async function name() {
//   try {
//     const deletedAns = await Question.deleteMany();
//     console.log("delted");

//   } catch (error) {
//     console.error(error
//       );
//   }
//   }
// name();
// async function name() {
  
// try {
//   const count =  await Question.findOne({}).populate('count')
//   console.log("question count is " +count)
// } catch (error) {
//   console.error(error.message)
// }

// }
// name()