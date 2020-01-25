const express = require('express');
const uuid = require('uuid/v4')
const logger = require('../logger')
const bookmarks = require('../store')

const bookmarksRouter = express.Router();
const bodyParcer = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get(handleAllBookmarks)
  .post(bodyParcer, handleNewBookmark)

bookmarksRouter
  .route('/bookmarks/:id')
  .get(handleFindBookmark)
  .delete(bodyParcer, handleDeleteBookmark)

function handleAllBookmarks(req, res) {
  res
    .status(200)
    .json(bookmarks)
}

function handleNewBookmark(req, res) {
  const { title, rating, description="", url } = req.body;
  const id = uuid();
  const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const newBookmark = {
    id: id,
    title,
    rating,
    description,
    url
  }
  if(!url) {
    logger.error('url is required in request body');
    return res
      .status(400)
      .send('Invalid data');
  };
  if(!rating) {
    logger.error('rating is required in request body');
    return res
      .status(400)
      .send('Invalid data');
  };
  if(!title) {
    logger.error('title is required in request body');
    return res
      .status(400)
      .send('Invalid data');
  };
  if(typeof title !== 'string') {
    logger.error('title must be a string');
    return res
      .status(400)
      .send('Invalid data');
  }
  if(!url.match(urlRegex)) {
    logger.error('url must be a valid url');
    return res
      .status(400)
      .send('Invalid data');
  }
  if(typeof description !== 'string') {
    logger.error('description must be a string');
    return res
      .status(400)
      .send('Invalid data');
  }
  if(typeof parseInt(rating) !== 'number') {
    logger.error('rating must be a number');
    return res
      .status(400)
      .send('Invalid data');
  }
  if(parseInt(rating) > 5 || parseInt(rating) < 1 ) {
    logger.error('rating must be between 1 and 5');
    return res
      .status(400)
      .send('Invalid data');
  }

  bookmarks.push(newBookmark);
  logger.info(`Bookmark with id ${id} created`)
  console.log(bookmarks)
  res
    .status(201)
    .location(`http://localhost:8000/bookmark/${id}`)
    .json(newBookmark);
}

function handleFindBookmark(req, res) {
  res.send(200)
}

function handleDeleteBookmark(req, res, next) {
  res.send(204).end()
}

module.exports = bookmarksRouter;