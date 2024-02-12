// index.js
// where your node app starts

// init project
const express = require('express');
const app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
const cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", (req, res) => {
  res.json({ greeting: 'hello API' });
});


app.get('/api/:date', (req, res) => {
  try {
    let time = req.params.date
    let timeTransformed = !isNaN(time) ? new Date(Number(time)) : new Date(time)

    if (isNaN(timeTransformed.getTime())) {
      res.status(400).json({"error": "Invalid Date"})
    } else {
      res.json({
        "unix": timeTransformed.getTime(),
        "utc": timeTransformed.toUTCString()
      })
    }

  } catch (error) {
    res.json({
      "error": 'Invalid Date'
    })
  }
})
app.get('/api', (req, res) => {
  let unix = new Date().getTime();
  let utc = new Date().toUTCString();
  res.json({
    unix: unix,
    utc: utc
  })
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + `http://localhost:${listener.address().port}`);
});
