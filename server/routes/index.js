'use strict';

var express = require('express'),
	router = express.Router();

router.get('/', function (req, res) {
	if (req.headers['x-pjax']) {
		// 响应pjax请求
		res.render('examples/home.html');
	} else {
		// 响应地址栏请求
		res.render('index', {path: 'examples/home.html'});
	}
});

router.get('/error.html', function (req, res) {
	res.charset = 'utf-8';
	var _path = req.path;
	if (req.headers['x-pjax']) {
		res.render('includes/error.html');
	} else {
		res.render('error.html', {path: 'includes' + _path});
	}
});

router.get('/no-auth.html', function (req, res) {
	res.charset = 'utf-8';
	if (req.headers['x-pjax']) {
		res.render('examples/errors/no-auth-inner.html');
	} else {
		res.render('examples/errors/no-auth.html', {path: 'no-auth-inner.html'});
	}
});

router.get('/maintenance.html', function (req, res) {
	res.charset = 'utf-8';
	res.render('examples/errors/maintenance.html');
});

router.get('/login.html', function (req, res) {
	res.charset = 'utf-8';
	res.render('login.html');
});

router.get('/locked.html', function (req, res) {
	res.charset = 'utf-8';
	res.render('locked.html');
});

router.all('/system/account/*', function (req, res) {
	res.charset = 'utf-8';
	var _path = req.path.substring(1),
		fileName = _path.lastIndexOf('/'),
		_index = 'system/account/index.html';

	fileName = _path.substring(fileName + 1);

	if (req.headers['x-pjax']) {
		switch (fileName) {
			case 'index.html':
				if (req.headers['x-pjax-container'] === '#accountContent') {
					res.render('system/account/message.html');
				} else {
					res.render(_index, {
						path1: 'message.html',
						fileName: fileName
					});
				}
				break;
			case 'password.html':
				if (req.headers['x-pjax-container'] === '#accountContent') {
					res.render('system/account/password.html');
				} else {
					res.render(_index, {
						path1: 'password.html',
						fileName: fileName
					});
				}
				break;
			case 'log.html':
				if (req.headers['x-pjax-container'] === '#accountContent') {
					res.render('system/log-table.html');
				} else {
					res.render(_index, {
						path1: '../log-table.html',
						fileName: fileName
					});
				}
				break;
			case 'display.html':
				if (req.headers['x-pjax-container'] === '#accountContent') {
					res.render('system/settings/display.html');
				} else {
					res.render(_index, {
						path1: '../settings/display.html',
						fileName: fileName
					});
				}
				break;
		}
	} else {
		switch (fileName) {
			case 'index.html':
				res.render('index', {
					path: _index,
					path1: 'message.html',
					fileName: fileName
				});
				break;
			case 'password.html':
				res.render('index', {
					path: _index,
					path1: 'password.html',
					fileName: fileName
				});
				break;
			case 'log.html':
				res.render('index', {
					path: _index,
					path1: '../log-table.html',
					fileName: fileName
				});
				break;
			case 'display.html':
				res.render('index', {
					path: _index,
					path1: '../settings/display.html',
					fileName: fileName
				});
				break;
		}
	}
});

router.all('/examples/tables/data-tables/*', function (req, res) {
	res.charset = 'utf-8';
	var _path = req.path.substring(1),
		open = false,
		fileName = _path.lastIndexOf('/'),
		folderName = _path.lastIndexOf('/', fileName - 1);

	folderName = _path.substring(folderName, fileName);
	fileName = _path.substring(fileName + 1);

	if (fileName === 'index.html') {
		open = true;
		switch (folderName) {
			case '/basic-init':
				fileName = 'zero-configuration.html';
				break;
			case '/advanced-init':
				fileName = 'events-live.html';
				break;
			case '/ajax':
			case '/demo':
			case '/server-side':
				fileName = 'simple.html';
				break;
			case '/api':
				fileName = 'add-row.html';
				break;
			case '/data-sources':
				fileName = 'dom.html';
				break;
			case '/plug-ins':
				fileName = 'api.html';
				break;
			case '/others':
				fileName = 'fixed-header.html';
				break;
		}
	}

	if (req.headers['x-pjax']) {
		if (open) {
			res.render('examples/tables/data-tables' + folderName + '/index.html', {path1: fileName});
		} else {
			res.render(_path);
		}
	} else {
		res.render('index', {
			path: 'examples/tables/data-tables' + folderName + '/index.html',
			path1: fileName
		});
	}
});

function responseCommon(req, res) {
	var _path = req.path.substring(1);

	if (req.headers['x-pjax']) {
		res.render(_path);
	} else {
		res.render('index', {path: _path});
	}
}

router.all('/*', function (req, res) {
	responseCommon(req, res);
});

module.exports = router;
