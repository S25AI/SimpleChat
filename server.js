'use strict';

const http = require('http');
const fs = require('fs');

const basePath = `${__dirname}/client/src/`;

let messagesArr = [];

const processData = (req, res) => {
	let data;

	req.on('data', chunk => {
		data += chunk;
	});

	req.on('end', () => {
		data = data || "[]";
		data = JSON.parse(data); //data is Array
		messagesArr = messagesArr.concat(data);
	});

	res.write( JSON.stringify(messagesArr) );
	res.end();
};

const routes = {
	'/': {
		url: '/',
		sendStatic: false,
		processData
	},

	'/index': {
		url: `${basePath}index.html`,
		sendStatic: true,
		processData() {
			return false;
		}
	},

	'/main': {
		url: `${basePath}js/main.js`,
		sendStatic: true,
		processData() {
			return false;
		}
	},

	'/style': {
		url: `${basePath}css/style.css`,
		sendStatic: true,
		processData() {
			return false;
		}
	}
};

const sendFile = (url, res) => {
	let data;
	try {
		data = fs.readFileSync(url, 'utf8');
		res.write(data);
	} catch(e) {
		console.log('something was wrong');
	} finally {
		res.end();
	}
};

const server = http.createServer((req, res) => {
	let path = routes[req.url];
	
	if (!path) {
		res.writeHead(404, {'Content-type': 'text/html'});
		res.end('<h1>Not found</h1>');
		return false;
	} 

	if (path.sendStatic) sendFile(path.url, res);

	path.processData(req, res);
});

server.listen(3000);