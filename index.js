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


app.get('/api/:date?', (req, res) => {
  let unix = 0;
  let utc = '';

  if (isNaN(req.params.date)) {
    const time = new Date(req.params.date)
    utc = time[Symbol.toPrimitive]('string')
    unix = time[Symbol.toPrimitive]('number')
  } else {
    const time = new Date(`${req.params.date} 00:00:00`)
    utc = time[Symbol.toPrimitive]('string')
    unix = time[Symbol.toPrimitive]('number')
  }
  res.json({
    "unix": unix,
    "utc": utc
  })
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
