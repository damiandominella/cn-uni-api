const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

const routes = require('./api/routes/routes');
routes(app); //register the route

app.listen(port);


console.log('API server started on: ' + port);