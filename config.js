'use strict';

module.exports = {
  PORT: process.env.PORT || 8080,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'https://armchair-gm.netlify.com',
  DATABASE_URL:
  //   process.env.DATABASE_URL || 'mongodb://localhost/thinkful-backend',
        process.env.DATABASE_URL,

  TEST_DATABASE_URL:
        process.env.TEST_DATABASE_URL || 'mongodb://dev:dev@ds115340.mlab.com:15340/armchairgm-test',
  // DATABASE_URL:
  //     process.env.DATABASE_URL || 'postgres://localhost/thinkful-backend',
  // TEST_DATABASE_URL:
  //     process.env.TEST_DATABASE_URL ||
  //     'postgres://localhost/thinkful-backend-test'

  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
};
