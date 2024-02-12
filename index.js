require('dotenv').config()
const express = require('express')
const cors = require('cors')
const url = require('node:url')
const dns = require('node:dns')
const app = express()
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.use('/public', express.static(`${process.cwd()}/public`))

app.get('/', (req, res) => {
  res.sendFile(process.cwd() + '/views/index.html')
})

// Your first API endpoint
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' })
})

let shorturls = []

const esUrlExistente = (str, callback) => {
  try {
    let hostname = new url.URL(str)
    dns.lookup(hostname.hostname, (err) => {
      if (err) {
        callback(false);
      } else {
        callback(true);
      }
    })
  } catch (err) {
    callback(false)
  }
}



app.post('/api/shorturl', (req, res) => {
  try {
    let direccionUrl = req.body.url
    esUrlExistente(direccionUrl, (exis) => {
      if (exis) {
        shorturls.push({
          "original_url": direccionUrl,
          "short_url": shorturls.length + 1
        })
        res.json(shorturls[shorturls.length - 1])
      } else {
        res.json({error: 'invalid url'})
      }
    })
  } catch (error) {
    console.error(error)
  }
})

app.get('/api/shorturl/:id', (req, res) => {
  esUrlExistente(shorturls[req.params.id - 1].original_url, (existe) => {
    if (existe) {
      res.redirect(shorturls[req.params.id - 1].original_url)
      console.log('accediendo a la url: ' + shorturls[req.params.id - 1].original_url)
    } else {
      res.json({error: 'invalid url'})
    }
  })
})



app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`)
})
