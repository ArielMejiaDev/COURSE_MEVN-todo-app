import express, { request } from 'express'
import morgan from 'morgan'
import cors from 'cors'
import path from 'path'
const mongoose = require('mongoose');

const app = express()

// DB connection
// Local connection
// const uri = 'mongodb://localhost:27017/mevn'
// Mongo altas cluster connection
const uri = 'mongodb+srv://MEVN:mvcpoophp7@mevn-s4gfj.mongodb.net/mevn?retryWrites=true&w=majority'
const options = {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}

mongoose.connect(uri, options).then(
  () => { console.log('connect to mongodb') },
  err => { err }
);

// Middleware
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Endpoints
app.use('/api',   require('./routes/note'))
app.use('/api',   require('./routes/user'))
app.use('/api/login', require('./routes/login'))

// Middleware para Vue.js router modo history
const history = require('connect-history-api-fallback')
app.use(history());
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', process.env.PORT || 3000)
app.listen(app.get('port'), () => {
  console.log('App listening on port: '+ app.get('port'))
});