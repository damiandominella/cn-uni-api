'use strict'; // what is this? -> https://www.w3schools.com/js/js_strict.asp

const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const api = require('./api/routes/index');
app.use('/api', api);

app.use((req, res, next) => {
    res.status(404);

    res.send({ error: 'Not found' });
    return;
});

app.listen(port);

console.log('API server started on: ' + port);