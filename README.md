# Bookmarks API!

This is an API for storing bookmarks

## Set up

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository 
4. Install the node dependencies `npm install`

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests `npm test`

Migrate database `npm run migrate`

Migrate test database `npm run migrate:test`

Database seeding `psql -U <role> -d bookmarks -f ./seeds/seed.bookmarks.sql`

Database truncating `psql -U <role> -d bookmarks -f ./seeds/trunc.bookmarks.sql`