'use strict';

const form = document.forms.chatform;
const chatList = document.querySelector('#chatList');
const messageInput = form.elements.message;
const log = console.log.bind(console);
let msgArr = [];

fetch('/', { method: 'POST' })
	.then(res => res.json())
	.then(data => {
		if (!data) return false;
		msgArr = data;
		renderList();
	})
	.catch(log);

const timerId = setInterval(sendAjax, 5000, '/');

const elt = (el = 'div', cls = '', text = '') => {
	let elem = document.createElement(el);
	elem.innerHTML = text;
	elem.className = cls;
	return elem;
};

function renderList() {
	msgArr.forEach(item => {
		let li = elt('li', '', item);
		chatList.appendChild(li);
	});
}

form.onsubmit = submitHandler;

function submitHandler(e) {
	e.preventDefault();

	if ( !messageInput.value.length ) {
		setFocusToInput(messageInput);
		return false;
	}

	let msg = messageInput.value;

	fetch('/', {
			method: 'POST',
			body: JSON.stringify(msg)
		})
		.then(res => res.json())
		.then(data => {
			msgArr = data;
			refreshList();
		})
		.catch(log);

	clearInput(messageInput);
	setFocusToInput(messageInput);
}

function refreshList() {
	let el;
	while( el = chatList.children[0] ) {
		chatList.removeChild(el);
	}

	msgArr.forEach(item => {
		let li = elt('li', '', item);
		chatList.appendChild(li);
	});
}

function sendAjax(url, msg) {
	let body = msg ? JSON.stringify(msg) : null;
	fetch(url, {
			method: 'POST',
			body: body
		})
		.then(res => res.json())
		.then(data => {
			msgArr = data;
			refreshList();
		})
		.catch(() => {
			log('some error confused');
			clearInterval(timerId);
		});
}

function clearInput(input) {
	input.value = '';
}

function setFocusToInput(input) {
	input.focus();
}

/*function renderMessage(msg) {
	let li = elt('li', 'msg-list-item', msg);
	chatList.appendChild(li);
}*/

