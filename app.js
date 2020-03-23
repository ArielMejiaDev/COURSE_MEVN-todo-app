import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
const mongoose = require('mongoose');

const app = express()

// DB connection
const uri = 'mongodb://localhost:27017/mevn';
const options = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true};

mongoose.connect(uri, options).then(
  () => { console.log('connect to mongodb') },
  err => { err }
);

// Middleware
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', require('./routes/note'))

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback')
app.use(history());
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), () => {
  console.log('App listening on port: '+ app.get('port'))
});