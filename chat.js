'use strict';

let clients = [];

const publish = data => {
	clients.forEach(client => {
		client.end(JSON.stringify(data));
	});

	clients = [];
};

const subscribe = (req, res) => {
	clients.push(res);
	req.on('close', () => {
		clients.splice(clients.indexOf(res), 1);
	});
	console.log(clients.length);
};

module.exports = {
	publish: publish,
	subscribe: subscribe
};