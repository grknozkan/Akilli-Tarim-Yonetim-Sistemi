const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// KESİN VE NET BAĞLANTI (NEON.TECH)
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_b2cq1tIjYwXr@ep-weathered-star-aqwvtq42-pooler.c-8.us-east-1.aws.neon.tech/neondb?sslmode=require';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

module.exports = sequelize;
