let express = require('express');
let app = express();
const bodyParser = require('body-parser')

app.use((bodyParser.urlencoded({extended: false})))

app.post('/name', (req, res) => {
    res.json({
        name: `${req.body.first} ${req.body.last}`
    })
} )



 module.exports = app;
