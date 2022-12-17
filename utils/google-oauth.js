const { google } = require("googleapis");

module.exports = {
  googleOAuthClient: new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri:
      process.env.NODE_ENV === "production"
        || process.env.NODE_ENV === "staging"
        || process.env.NODE_ENV === "development"
          ? "https://secondhanded.vercel.app"
          : "http://localhost:3000",
  }),
};
