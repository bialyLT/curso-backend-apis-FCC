const express = require('express')
const mongoose = require('mongoose')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

const MONGO_URI = process.env.MONGO_URI

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('conexion a mongodb exitosa!')
  })
  .catch((err) => {
    console.error('error conectando a mongodb', err);
  })

// schemas

const userSchema = new mongoose.Schema({
  username: String,
})
const exersSchema = new mongoose.Schema({
  user_id: { type: String, required: true},
  date: String,
  duration: Number,
  description: String
})
const logSchema = new mongoose.Schema({
  user_username: String,
  user_id: { type: String, required: true},
  count: Number,
  log: [{}]
})

// models

let User = mongoose.model('User', userSchema)
let Exercises = mongoose.model('Exercises', exersSchema)
let Log = mongoose.model('Log', logSchema)

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// response to /api/users from post method
app.post('/api/users', async (req, res) => {
  const newUser = new User({ username: req.body.username })
  const user = await newUser.save()
  try {
    res.json({user})
  } catch (error) {
    console.log(error)
  }
})


// response to /api/users from get method
app.get('/api/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users)
    })
    .catch(err => {
      console.error(err)
    })
})


//response to save and show exercise to perfom by an user 
app.post('/api/users/:_id/exercises', async (req, res) => {   
})


//response to save and show all of exercises to perfom by an user
app.get('/api/users/:id/logs', (req, res) => {

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + `http://localhost:${listener.address().port}`)
})
