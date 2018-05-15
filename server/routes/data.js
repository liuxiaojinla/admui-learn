'use strict';

var express = require('express'),
    router = express.Router(),
    fs = require('fs'),
    path = require('path');

function filterData(req, res, file){
    var basePath = '../../public';
    fs.readFile(path.resolve(__dirname, basePath + file), 'utf-8', function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
}

router.get(['/menu/all', '/role/menus'], function (req, res) {
    filterData(req, res, '/data/system/menu.json');
});

router.get(['/menu/roles', '/user/role'], function(req, res){
    filterData(req, res, '/data/system/auth.json');
});

router.get('/role/user', function(req, res){
    filterData(req, res, '/data/system/user.json');
});

router.get('/log/query', function(req, res){
    filterData(req, res, '/data/system/log.json');
});

router.get('/message/query', function(req, res){
    filterData(req, res, '/data/system/message.json');
});

router.post('/post/table', function(req, res){
    filterData(req, res, '/data/examples/tables/dt-server-post.json');
});

module.exports = router;
