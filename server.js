'use strict'; // what is this? -> https://www.w3schools.com/js/js_strict.asp

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

const api = require('./api/routes/index');
app.use('/api', api);

app.use((req, res, next) => {
    res.status(404);
  
    // respond with json
    if (req.accepts('json')) {
      res.send({ error: 'Not found' });
      return;
    }
  });

app.listen(port);

console.log('API server started on: ' + port);