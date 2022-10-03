require("dotenv").config()

module.exports = {
  development: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: "0.0.0.0",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_DEV_USERNAME,
    password: process.env.DB_DEV_PASSWORD,
    database: process.env.DB_DEV_DATABASE,
    host: "0.0.0.0",
    dialect: "postgres",
  },
  production: {
    username: process.env.HEROKU_DB_USERNAME,
    password: process.env.HEROKU_DB_PASSWORD,
    database: process.env.HEROKU_DB_DATABASE,
    host: process.env.HEROKU_DB_HOST,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}
