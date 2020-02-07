function makeBookmarksArray() {
  return [
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
}

module.exports = {
  makeBookmarksArray,
}
