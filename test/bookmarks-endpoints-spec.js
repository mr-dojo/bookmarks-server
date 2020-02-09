const knex = require('knex')
const app = require('../src/app')
const { makeBookmarksArray, makeMaliciousBookmark } = require('./bookmarks-fixtures')

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
    context(`Given an XSS attack bookmark`, () => {
      const { maliciousBookmark, expectedBookmark } = makeMaliciousBookmark()
      
      beforeEach('insert malicious Bookmark', () => {
        return db
          .into('bookmarks')
          .insert([ maliciousBookmark ])
      })

      it('removes XSS attack description', () => {
        return supertest(app)
          .get(`/Bookmarks`)
          .set(auth)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedBookmark.title)
            expect(res.body[0].description).to.eql(expectedBookmark.description)
          })
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
  describe(`POST /bookmarks`, () => {
    it(`creates a bookmark responding with a 201 and the new bookmark`, function() {
      this.retries(3)
      const newBookmark =     {
        url: "https://skullcandy.com",
        title: 'New POST bookmark!',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
        rating: 1
      }
      return supertest(app)
        .post('/bookmarks')
        .set(auth)
        .send(newBookmark)
        .expect(201)
        .expect(res => {
          expect(res.body.url).to.eql(newBookmark.url)
          expect(res.body.title).to.eql(newBookmark.title)
          expect(res.body.description).to.eql(newBookmark.description)
          expect(res.body.rating).to.eql(newBookmark.rating)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`http://localhost:8000/bookmarks/${res.body.id}`)
        })
        .then(postRes =>
          supertest(app)
            .get(`/bookmarks/${postRes.body.id}`)
            .set(auth)
            .expect(postRes.body)
          )
    })
    const requiredFields = ['title', 'rating', 'url']
 
    requiredFields.forEach(field => {
      const newBookmark = {
        title: 'Test new Bookmark',
        rating: 3,
        url: 'http//www.acer.com'
      }
 
      it(`responds with 400 and 'Invalid data'`, () => {
        delete newBookmark[field]
 
        return supertest(app)
          .post('/bookmarks')
          .set(auth)
          .send(newBookmark)
          .expect(400, 'Invalid data')
      })
    })
  })
})