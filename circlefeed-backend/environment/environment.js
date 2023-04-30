const config = {
  MONGOURI: process.env.MONGOURI,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASS: process.env.ADMIN_PASS,
  CLIENT_APP_URL: process.env.CLIENT_APP_URL,
  AppName: process.env.AppName,
};

module.exports = config;
