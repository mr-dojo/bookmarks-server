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
  res.send(200)
}

function handleNewBookmark(req, res) {
  res.send(201)
}

function handleFindBookmark(req, res) {
  res.send(200)
}

function handleDeleteBookmark(req, res, next) {
  res.send(204).end()
}

module.exports = bookmarksRouter;