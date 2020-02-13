const express = require('express')
const path = require('path')
const xss = require('xss')
const logger = require('../logger')
const bookmarks = require('../store')
const BookmarksService = require('./bookmarks-service')

const bookmarksRouter = express.Router();
const bodyParcer = express.json();

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  url: bookmark.url,
  title: xss(bookmark.title),
  description: xss(bookmark.description),
  rating: bookmark.rating
})

bookmarksRouter
  .route('/')
  .get((req, res) => {
    res.send(200, "Hello, bookmarks app!");
  })

bookmarksRouter
  .route('/bookmarks')
  .get(handleAllBookmarks)
  .post(bodyParcer, handleNewBookmark)

bookmarksRouter
  .route('/bookmarks/:id')
  .get(handleFindBookmark)
  .delete(bodyParcer, handleDeleteBookmark)

function handleAllBookmarks(req, res, next) {
  BookmarksService.getAllBookmarks(req.app.get('db'))
    .then(bookmarks => {
      res.json(bookmarks.map(serializeBookmark))
    })
    .catch(next)
}

function handleNewBookmark(req, res, next) {
  const { title, rating, description="", url } = req.body;
  const urlRegex = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  const newBookmark = {
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

  BookmarksService.insertBookmark(
    req.app.get('db'),
    newBookmark
  )
  .then(bookmark => {
    logger.info(`Bookmark with id ${bookmark.id} created`)
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${bookmark.id}`))
      .json(serializeBookmark(bookmark))
  })
  .catch(next)

}

function handleFindBookmark(req, res, next) {
  const { id } = req.params;
  BookmarksService.getById(req.app.get('db'), id)
    .then(bookmark => {
      if(!bookmark) {
        logger.error(`Did not find bookmark with id: ${id}`)
        return res.status(404).json({
          error: { message: `Bookmark Not Found`}
        })
      };
      res
        .status(200)
        .location(`http://localhost:8000/bookmarks/${id}`)
        .json(serializeBookmark(bookmark))
      })
      .catch(next)
}

function handleDeleteBookmark(req, res, next) {
  const { id } = req.params;
  // const bookmarkExists = true
  BookmarksService.getById(req.app.get('db'), id)
    .then(bookmark => {
      if(!bookmark) {
        // bookmarkExists = false ___make .deleteBookmark() conditional___
        logger.error(`Bookmark with id: ${id} was not found`);
        return res.status(404).json({
          error: {message: `Bookmark not found`}
        })
      }
    })
    .catch(next)
  // if(bookmarkExists) {
    BookmarksService.deleteBookmark(req.app.get('db'), id)
      .then(numRowsAffected => {
        logger.info(`Bookmark with id: ${id} deleted`)
        res.status(204).end()
      })
      .catch(next)
  // }
}

module.exports = bookmarksRouter;