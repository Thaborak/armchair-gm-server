'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://armchair-gm.netlify.com', 
  // CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',   //   CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://feature-save-team--armchair-gm.netlify.com',
  API_BASE_URL: process.env.API_BASE_URL || 'https://armchair-gm.herokuapp.com',
  DATABASE_URL:
        process.env.DATABASE_URL,
  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL || 'mongodb://dev:dev@ds115340.mlab.com:15340/armchairgm-test',
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
  REDIRECT: process.env.REDIRECT
};
