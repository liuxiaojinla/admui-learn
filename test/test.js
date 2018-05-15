const http = require('./libs/http.js');

http({
	url: 'http://api.map.baidu.com/telematics/v3/weather?location=嘉兴&output=json&ak=5slgyqGDENN7Sy7pw29IUvrZ'
}).then((res) => {
	console.log(res);
}, (err) => {
	console.error(err);
});