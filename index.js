const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({
  username: String,
});

const User = mongoose.model('User', userSchema);

const exersSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  description: String,
  duration: Number,
  date: Date
});

const Exercises = mongoose.model('Exercises', exersSchema);

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// response to /api/users from post method
app.post('/api/users', async (req, res) => {
  const newUser = new User({ username: req.body.username });
  try {
    const user = await newUser.save();
    res.json({
      username: user.username,
      _id: user._id
    });
  } catch (error) {
    console.log(error);
  }
});


// response to /api/users from get method
app.get('/api/users', async (req, res) => {
  const users = await User.find().select("_id username");
  if (!users) {
    res.send("no hay usuarios cargados");
    return;
  }
  res.json(users);
});


//response to save and show exercise to perfom by an user 
app.post('/api/users/:_id/exercises', async (req, res) => {
  const id = req.params._id;
  const { description, duration, date } = req.body;
  try { 
    const user = await User.findById(id);
    if (!user) {
      res.send('no se encontro el usuario');
    } else {
      const newEj = new Exercises({
        user_id: user._id,
        description,
        duration,
        date: date ? new Date(date) : new Date()
      });
      const ejSaved = await newEj.save();
      res.json({
        _id: user._id,
        username: user.username,
        description: ejSaved.description,
        duration: ejSaved.duration,
        date: new Date(ejSaved.date).toDateString()
      });
    }
  } catch (error) {
    console.error(error);
    res.send("hubo un error guardando el ejercicio");
  }
});
  

//response to save and show all of exercises to perfom by an user
app.get('/api/users/:_id/logs', async (req, res) => {
  const { limit, from, to } = req.query;
  const id = req.params._id;
  const user = await User.findById(id);
    if (!user) {
      res.send("no se encontro el usuario");
      return;
    }
    let dateSelected = {};
    if (from) {
      dateSelected['$gte'] = new Date(from);
    }
    if (to) {
      dateSelected['$lte'] = new Date(to);
    }
    let filter = { user_id: id };
    if (from || to) {
      filter.date = dateSelected;
    }
    const ejercicios = await Exercises.find(filter).limit(+limit);
    const log = ejercicios.map((i) => ({
      description: i.description,
      duration: i.duration,
      date: i.date.toDateString()
    }));
    //es lo que debemos mostrar
    res.json({
      username: user.username,
      count: ejercicios.length,
      _id: user._id,
      log: log
    });
});


const listener = app.listen(3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
})
