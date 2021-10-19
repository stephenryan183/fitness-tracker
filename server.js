const path = require('path');
const mongoose = require("mongoose");
const express = require("express");
const logger = require("morgan");
const exphbs = require('express-handlebars');






const app = express();
const PORT = process.env.PORT || 3000;

const db = require("./models");





app.use(logger("dev"));

const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout",
{ useNewUrlParser: true });

app.get('/exercise', (req, res) => {
  
  res.sendFile(path.join(__dirname, './public/exercise.html'));
})


app.get('/stats', (req, res) => {
  
  res.sendFile(path.join(__dirname, './public/stats.html'));
})

app.get('/api/workouts', (req, res) => {
    
    db.Workout.find({})
    .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.json(err);
      });
})









app.get('/api/workouts/range', (req, res) => {
    
  db.Workout.aggregate( [
    {
      $addFields: {
       totalDuration: { $sum: "$exercises.duration" }
      }
    }
  ] )
  .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

app.put('/api/workouts/:id', (req, res) => {
  console.log(req.body);
  console.log(req.params.id);
  db.Workout.findOneAndUpdate(
    { _id: req.params.id},
    {$push: {exercises: [req.body]}}, 
  )
  .then(dbWorkouts => {
    res.json(dbWorkouts);
  })
  .catch(err => {
    res.json(err);
  })  
});







app.post('/api/workouts', (req, res) => {
  console.log(req.body)
  db.Workout.create(req.body)
  .then (dbWorkouts => {
    res.json(dbWorkouts);
  })
  .catch (err => {
    res.json(err);
  })
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });