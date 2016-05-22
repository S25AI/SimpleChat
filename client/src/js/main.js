'use strict';

const form = document.forms.chatform;
const chatList = document.querySelector('#chatList');
const messageInput = form.elements.message;
const log = console.log.bind(console);
let msgArr = [];

function uploadMessages(url, action, callback) {
	fetch(url, {method: 'GET'})
		.then(res => res.json())
		.then(data => {
			if (!data) return false;
			msgArr = data;
			action(data);
			if (callback) callback();
		})
		.catch(log);
}

uploadMessages('/msg', renderList);

function subscribe() {
	uploadMessages('/subscribe', addItem, subscribe);
}

subscribe();

const elt = (el = 'div', cls = '', text = '') => {
	let elem = document.createElement(el);
	elem.innerHTML = text;
	elem.className = cls;
	return elem;
};

function renderList() {
	msgArr.forEach(item => {
		let date = makeBeautyDate(item.date);
		let li = elt('li', 'msg-item', item.val);
		let msgDate = elt('span', 'msg-date', date);
		li.appendChild(msgDate);
		chatList.appendChild(li);
	});
}

function addItem(item) {
	let date = makeBeautyDate(item.date);
	let li = elt('li', 'msg-item', item.val);
	let msgDate = elt('span', 'msg-date', date);
	li.appendChild(msgDate);
	chatList.appendChild(li);
}

form.onsubmit = submitHandler;

function submitHandler(e) {
	e.preventDefault();

	if ( !messageInput.value.length ) {
		setFocusToInput(messageInput);
		return false;
	}

	let msg = {
		val: messageInput.value,
		date: Date.now()
	};

	sendAjax('/', msg);
	clearInput(messageInput);
	setFocusToInput(messageInput);
}

function refreshList() {
	let el;
	while( el = chatList.children[0] ) {
		chatList.removeChild(el);
	}

	renderList();
}

function makeBeautyDate(date) {
	date = new Date(date);
	return `created on ${date.getDate()} may
					${date.getHours()}:${date.getMinutes()}`;
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
		});
}

function clearInput(input) {
	input.value = '';
}

function setFocusToInput(input) {
	input.focus();
}