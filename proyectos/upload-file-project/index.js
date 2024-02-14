require('dotenv').config()
const express = require("express");
const cors = require('cors');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
    const { originalname, mimetype, size } = req.file
    
    res.json({
        name: originalname,
        type: mimetype,
        size
    })
})


app.listen(port, () => {
    console.log(`Listening on port http://localhost:${port}`);
});
