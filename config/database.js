if (process.env.NODE_ENV === 'production') {
  module.exports = { mongoURI: process.env.mongoURI }
}

