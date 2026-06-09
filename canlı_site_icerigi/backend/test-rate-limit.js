const express = require('express');
const rateLimit = require('express-rate-limit');
const request = require('http').request;

const app = express();
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.get('/', (req, res) => res.send('OK'));

const server = app.listen(0, () => {
  const port = server.address().port;
  const req = request(`http://localhost:${port}/`, {
    headers: { 'X-Forwarded-For': '192.168.1.1' }
  }, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      console.log('Body:', data);
      process.exit(0);
    });
  });
  req.end();
});
