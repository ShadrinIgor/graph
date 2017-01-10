var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('respond Index');
});

router.post('/', function(req, res, next) {
    res.set(
        {'Access-Control-Allow-Origin': 'http://graph.loc'},
        {'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'},
        {'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With'},
        {'X-Random-Shit': '5555555555'},
        {'Content-Type': 'application/json'});

    req.addListener('data', function(postDataChunk) {
        postData = postDataChunk;
        res.send({'status':'save'});
        console.log('Новые данные: ' + postDataChunk);
    });
});

module.exports = router;