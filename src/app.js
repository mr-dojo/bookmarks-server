require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./logger');
const bookmarksRouter = require('./bookmarks/bookmarks-router');
const { NODE_ENV } = require('./config');

const app = express();

const morganSetting = (NODE_ENV === 'production') ? 'tiny' : 'dev';

app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())
app.use(validateBearerToken)
app.use('/api', bookmarksRouter)

function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  next()
};


app.use(function errorHandler(error, req, res, next) {
  let response
  if (NODE_ENV === 'production') {
    response = { error: { message: 'Server error'}}
  } else {
    console.log(error)
    response = { error: { message: error.message, error}}
  }
  res.status(500).json(response);
})

module.exports = app;