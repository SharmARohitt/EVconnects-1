// Server configuration file
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  environment: process.env.NODE_ENV || 'development',
  mongoURI: (process.env.MONGO_URI && process.env.MONGO_URI.trim()) || null,
  jwtSecret: process.env.JWT_SECRET || 'evconnects_jwt_secret_key',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  emailConfig: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  corsOrigin: process.env.NODE_ENV === 'production' 
    ? 'https://evconnects.com' 
    : 'http://localhost:3001'
};