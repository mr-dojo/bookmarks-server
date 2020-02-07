const BookmarksService = require('../src/bookmarks/bookmarks-service');
const knex = require('knex');

describe('Bookmarks service object', () => {
  let db
  let testBookmarks = [
    {
      id: 1,
      url: "https://facebook.com",
      title: 'First test post!',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      rating: 4
    },
    {
      id: 2,
      url: "https://www.google.com",
      title: 'Second test bookmark!',
      description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum.',
      rating: 2
    },
    {
      id: 3,
      url: 'http://www.costantinoart.com',
      title: 'Third test bookmark!',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat.',
      rating: 5
    },
  ]

  before(() => {
    db = knex({
      client:'pg',
      connection: process.env.TEST_DB_URL,
    })
  })
  
  after(() => db.destroy())

  before(() => db('bookmarks').truncate())

  afterEach(() => db('bookmarks').truncate())


  context(`Given 'bookmarks' has data`, () => {
    beforeEach(() => {
      return db
        .into('bookmarks')
        .insert(testBookmarks)
    })
    
    it(`getAllBookmarks() resolves all bookmarks from 'bookmarks' table`, () => {
      //test that BookmarksService.getAllBookmarks gets data from table
      return BookmarksService.getAllBookmarks(db)
        .then(result => {
          expect(result).to.eql(testBookmarks)
        })
    })

    it(`getById() resolves an bookmark by id from 'bookmarks' table`, () => {
      const thirdId = 3
      const thirdTestBookmark = testBookmarks[thirdId - 1]
      return BookmarksService.getById(db, thirdId)
        .then(actual => {
          expect(actual).to.eql({
            id: thirdId,
            title: thirdTestBookmark.title,
            description: thirdTestBookmark.description,
            url: thirdTestBookmark.url,
            rating: thirdTestBookmark.rating,
          })
        })
    })
  })

  context(`Given 'bookmarks' has no data`, () => {

    it(`getAllBookmarks() resolves an empty array`, () => {
      return BookmarksService.getAllBookmarks(db)
        .then(result => {
          expect(result).to.eql([])
        })
    })
  })
})
