'use strict';

require('greenlock-express').create({

  server: 'staging'

, email: 'diego@villagrasa.ch'

, agreeTos: true

, approveDomains: [ 'dev.villagrasa.ch' ]

, app: require('express')().use('/', function (req, res) {
    res.end('Hello, World!');
  })

}).listen(80, 8999);
