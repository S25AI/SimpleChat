'use strict';

const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
	res.write('some content here');
	res.end('Hello world');
});

server.listen(3000);