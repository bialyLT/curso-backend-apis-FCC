let Person;
require('dotenv').config();
const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
const { Schema, model } = mongoose
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new Schema({
  name: String,
  age: Number,
  favoriteFoods: [String]
})

Person = model('Person', personSchema)


const createAndSavePerson = (done) => {
  const person1 = new Person({
    name: "Liam bialy",
    age: 22,
    favoriteFoods: ['hamburguer', 'pizza']
  })
  person1.save((err, data) => {
    if (err) return console.error(err)
    done(null, data);
  })
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return console.error(err);
    done(null, data);
  })
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return console.error(err)
    done(null, data);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({favoriteFoods: food}, (err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId}, (err, data) => {
    if (err) return console.error(err)
    done(null, data)
  })

};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, foundPerson) => {
    if (err) return console.error(err)
    foundPerson.favoriteFoods.push(foodToAdd)
    foundPerson.save((err, updatedPerson) => {
      if (err) return console.error(err)
      done(null, updatedPerson);
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName},
    { age: ageToSet}, 
    { new: true }, 
    (err, data) => {
      if (err) return console.error(err);
      done(null, data)
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, data) => {
    if (err) return console.error(err)
    done(null, data);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove}, (err, data) => {
    if (err) return console.error(err)
    done(null, data);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({ favoriteFoods: foodToSearch})
    // con sort ordenamos los datos eligiendo una propiedad, con 0 de manera descendente y con 1 de manera ascendente
    .sort({name : 1})
    // limit sirve para limitar la cantidad de valores que queremos tomar
    .limit(2)
    // con select elegimos que valores se mostraran y cuales no, con 0 estamos evitando que se muestre un valor y con 1 lo mostramos
    .select({age : 0})
    // exec sirve para ejecutar el metodo find()
    .exec((err, data) => {
      if (err) return console.error(err)
      done(err, data);
    })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
