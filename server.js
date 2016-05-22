'use strict';

const http = require('http');
const fs = require('fs');

const basePath = `${__dirname}/client/src/`;

let encodedMsgList = fs.readFileSync( `${__dirname}/msg.json` ).toString();
let messagesArr = encodedMsgList ? JSON.parse( encodedMsgList ) : [];
let clients = [];

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

		encodedMessageArr = JSON.stringify(messagesArr);
		fs.writeFile(`${__dirname}/msg.json`, encodedMessageArr);

		clients.forEach(answer => {
			answer.writeHead(200, {'Content-Type': 'application/json'});
			answer.write( JSON.stringify(data) );
			answer.end();
		});

		clients = [];
	});
};

function addClients(req, res) {
	clients.push(res);
}

function sendJson(req, res) {
	let data = fs.readFileSync(`${__dirname}/msg.json`);
	if (!data.length) return false;
	res.writeHead(200, {'Content-Type': 'application/json'});
	res.write( String( data ));
	res.end();
}

const routes = {
	'/': {
		url: '/',
		sendStatic: false,
		processData
	},

	'/subscribe': {
		url: '/subscribe',
		sendStatic: false,
		addClients
	},

	'/msg': {
		url: `${basePath}msg.json`,
		sendStatic: false,
		sendJson
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

	if (req.url === '/subscribe') {
		addClients(req, res);
	}

	if (req.url === '/msg') {
		sendJson(req, res);
	}
});

server.listen(3000);