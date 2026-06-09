const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Sensor = sequelize.define('Sensor', {
  label: { type: DataTypes.STRING, allowNull: false },
  fieldId: { type: DataTypes.INTEGER, defaultValue: 1 },
  x: { type: DataTypes.FLOAT },
  y: { type: DataTypes.FLOAT },
  temp: { type: DataTypes.FLOAT },
  moisture: { type: DataTypes.INTEGER },
  ph: { type: DataTypes.FLOAT },
  status: { type: DataTypes.STRING, defaultValue: 'good' },
  lastUpdate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const History = sequelize.define('History', {
  sensorId: { type: DataTypes.INTEGER },
  temp: { type: DataTypes.FLOAT },
  moisture: { type: DataTypes.INTEGER },
  ph: { type: DataTypes.FLOAT },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

const Recommendation = sequelize.define('Recommendation', {
  type: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  text: { type: DataTypes.TEXT },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }
});

const Log = sequelize.define('Log', {
  actionId: { type: DataTypes.INTEGER },
  status: { type: DataTypes.STRING },
  timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

module.exports = { Sensor, History, Recommendation, Log };
