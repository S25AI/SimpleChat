'use strict';

const port = 3000;
const path = require('path');
const http = require('http');
const fs = require('fs');
const chat = require('./chat');
const stream = require('stream');
const basePath = `${__dirname}/client/src/`;

const WARNING = 'OOOppppssss!!!';

const sendFile = (url, res, type) => {
	let fileData = fs.readFileSync(url, res);
	type = type || 'text/plain';
	res.writeHead(200, {'Content-Type': type});
	res.end(fileData);
};

const routes = {
	'/request'(req, res) {
		let data = '';
		req.on('data', chunk => {
			data += chunk;
		});
		req.on('end', () => {
			let msg = data ? JSON.parse(data) : '';
			if (!msg) {
				res.end();
				return false;
			}
			chat.publish(msg);
			res.end();
		});
	},

	'/subscribe'(req, res) {
		chat.subscribe(req, res);
	},

	'/index.html'(req, res) {
		sendFile(`${basePath}index.html`, res, 'text/html');
	},

	'/style.css'(req, res) {
		sendFile(`${basePath}css/style.css`, res, 'text/css');
	},

	'/main.js'(req, res) {
		sendFile(`${basePath}js/main.js`, res);
	},

	'/msg.json'(req, res) {
		sendFile(`${__dirname}/msg.json`, res, 'application/json');
	}
};

const server = http.createServer((req, res) => {
	let path = routes[req.url];
	if (path) path(req, res);
	else {
		res.writeHead(404, {'Content-Type': 'text/html'});
		res.end('<h1>Not found</h1>');
	}
});

server.listen(port);
