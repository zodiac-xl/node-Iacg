require('babel/register');

var config = require('config');
var server = require('./server');

server.listen(config.port, function(){
    console.log('server is running at %s', config.port);
});


