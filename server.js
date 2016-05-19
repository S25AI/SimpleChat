'use strict';

const http = require('http');
const fs = require('fs');

const basePath = `${__dirname}/client/src/`;

let encodedMsgList = fs.readFileSync( `${__dirname}/msg.json` ).toString();
let messagesArr = encodedMsgList ? JSON.parse( encodedMsgList ) : [];

const processData = (req, res) => {
	let data = '';
	let encodedMessageArr;

	req.on('data', chunk => {
		data += chunk;
	});

	req.on('end', () => {
		if (data) {
			data = JSON.parse(data);
			messagesArr.push(data);
		} 
		res.writeHead(200, {'Content-Type': 'application/json'});
		encodedMessageArr = JSON.stringify(messagesArr);
		fs.writeFile(`${__dirname}/msg.json`, encodedMessageArr);
		res.write(encodedMessageArr);
		res.end();
	});
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

	if (req.url === '/') {
		processData(req, res);
	}
});

server.listen(3000);