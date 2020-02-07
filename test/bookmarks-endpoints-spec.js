const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray } = require('./bookmarks-fixtures')

const auth = { 'Authorization': `Bearer ${process.env.API_TOKEN}`}

describe('Bookmarks Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('bookmarks').truncate())

  afterEach('cleanup', () => db('bookmarks').truncate())

  describe(`GET /`, () => {
    it('GET / respondes with 200 and "Hello, bookmarks app!"', () => {
      return supertest(app)
        .get('/')
        .set(auth)
        .expect(200, "Hello, bookmarks app!")
    })
  })

  describe(`GET /bookmarks`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/bookmarks')
          .set(auth)
          .expect(200, [])
      })
    })
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()
      
      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })
  
      it('GET /bookmarks responds with 200 and all bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .set(auth)
          .expect(200, testBookmarks)
      })
    })
  })
  describe(`GET /bookmarks/:bookmark_id`, () => {
    context(`Given no bookmarks`, () => {
      it(`responds with 404`, () => {
        return supertest(app)
          .get(`/bookmarks/1234`)
          .set(auth)
          .expect(404, {
            error: { message: `Bookmark Not Found` }
          })
      })
    })

    context('Given there ARE bookmarks in the database', () => {
      const testBookmarks = makeBookmarksArray()
      
      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks)
      })
  
      it('GET /bookmark/:bookmark_id responds with 200 and the specified Bookmark', () => {
        const bookmarkId = 2
        const expectedBookmark = testBookmarks[bookmarkId - 1]
        return supertest(app)
          .get(`/bookmarks/${bookmarkId}`)
          .set(auth)
          .expect(200, expectedBookmark)
      })
    })  
  })
})