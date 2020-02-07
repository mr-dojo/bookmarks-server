const BookmarksService = {
  getAllBookmarks(knexInstance) {
    return knexInstance('bookmarks')
      .select('*')
  },
  getById(knexInstance, id) {
    return knexInstance
      .from('bookmarks')
      .select('*')
      .where('id', id)
      .first()
  },
}

module.exports = BookmarksService;