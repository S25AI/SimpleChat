'use strict';

const form = document.forms.chatform;
const chatList = document.querySelector('#chatList');
const messageInput = form.elements.message;
const msgArr = [];

const elt = (el = 'div', cls = '', text = '') => {
	let elem = document.createElement(el);
	elem.innerHTML = text;
	elem.className = cls;
	return elem;
};

form.onsubmit = submitHandler;

function submitHandler(e) {
	e.preventDefault();

	if ( !messageInput.value.length ) {
		setFocusToInput(messageInput);
		return false;
	}

	let msg = messageInput.value;
	msgArr.push(msg);
	renderMessage(msg);
	clearInput(messageInput);
	setFocusToInput(messageInput);
}

function clearInput(input) {
	input.value = '';
}

function setFocusToInput(input) {
	input.focus();
}

function renderMessage(msg) {
	let li = elt('li', 'msg-list-item', msg);
	chatList.appendChild(li);
}

function sendAjax(url, data) {
	return fetch(url, {
		method: 'POST',
		body: JSON.stringify(data)
	});
}