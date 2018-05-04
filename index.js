'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const passport = require('passport');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
const playerRouter = require('./routes/players');


const googleStrategy = require('./passport/google');
const bearerStrategy = require('./passport/bearer');
// const AnonymousStrategy= require('passport-anonymous');



// Utilize the given `strategy`
passport.use(googleStrategy);
passport.use(bearerStrategy);
// Create an Express application
const app = express();

app.use(passport.initialize());
// app.use('/', express.static('build'));
app.use(bodyParser.json());


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

// Mount routers
app.use('/api', authRouter);
app.use('/api', playerRouter);



function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
