'use strict';

const form = document.forms.chatform;
const chatList = document.querySelector('#chatList');
const messageInput = form.elements.message;
const log = console.log.bind(console);

init();

const elt = (el = 'div', cls = '', text = '') => {
	let elem = document.createElement(el);
	elem.innerHTML = text;
	elem.className = cls;
	return elem;
};

function init() {
	uploadMessages('/msg.json', renderList);
	form.onsubmit = submitHandler;
}

function clearInput(input) {
	input.value = '';
}

function setFocusToInput(input) {
	input.focus();
}

function renderList(msgArr) {
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

function makeBeautyDate(date) {
	date = new Date(date);
	return `created on ${date.getDate()} may
					${date.getHours()}:${date.getMinutes()}`;
}

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

	console.log(msg);

	sendAjax('/request', msg);
	clearInput(messageInput);
	setFocusToInput(messageInput);
}

function uploadMessages(url, action) {
	fetch(url, {method: 'GET'})
		.then(res => res.json())
		.then(data => {
			if (!data) return false;
			action(data);
			subscribe('/subscribe', addItem);
		})
		.catch(log);
}

function sendAjax(url, msg) {
	fetch(url, {
		method: 'POST',
		body: JSON.stringify(msg)
	})
		.catch(log);
}

function subscribe(url, action) {
	fetch(url, {method: 'GET'})
		.then(res => res.json())
		.then(data => {
			action(data);
			subscribe(url, action);
		})
		.catch(() => {
			log();
		});
}