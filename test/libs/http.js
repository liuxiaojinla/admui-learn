const http = require('http');
const {URL} = require('url');

module.exports = function (options) {
	return new Promise((resolve, reject) => {
		options = Object.assign({
			encoding: 'utf8'
		}, options);

		if (options.url) {
			const url = new URL(options.url);
			options.protocol = url.protocol;
			options.host = url.host;
			options.port = url.port;
			options.path = url.pathname + url.search;
		}

		const req = http.request(options, (res) => {
			res.setEncoding(options.encoding);

			let data = '';
			res.on('data', (chunk) => data += chunk);
			res.on('end', () => {
				const {statusCode, headers} = res;
				const contentType = headers['content-type'];

				if (statusCode !== 200) {
					res.resume();
					return reject(new Error(`request fail: [status code = ${statusCode}]`));
				} else if (/^application\/json/.test(contentType)) {
					try {
						data = JSON.parse(data);
					} catch (e) {
						res.resume();
						return reject(e);
					}
				}

				resolve({
					data: data,
					statusCode: statusCode,
					header: headers,
					config: options
				});
			});
		});
		req.on('error', reject);
		req.end();
	});
};