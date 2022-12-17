require("dotenv").config()

module.exports = {
  // test: {
  //   username: process.env.DB_DEV_USERNAME,
  //   password: process.env.DB_DEV_PASSWORD,
  //   database: process.env.DB_DEV_DATABASE,
  //   host: "127.0.0.1",
  //   dialect: "postgres",
  // },
  development: {
    username: process.env.DB_USERNAME_DEVELOPMENT,
    password: process.env.DB_PASSWORD_DEVELOPMENT,
    database: process.env.DB_DATABASE_DEVELOPMENT,
    host: process.env.DB_HOST_DEVELOPMENT,
    port: process.env.DB_PORT_DEVELOPMENT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  staging: {
    username: process.env.DB_USERNAME_STAGING,
    password: process.env.DB_PASSWORD_STAGING,
    database: process.env.DB_DATABASE_STAGING,
    host: process.env.DB_HOST_STAGING,
    port: process.env.DB_PORT_STAGING,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
}
