'use strict';

const socket = io();

const form = document.querySelector('.write-message form');
const input = document.getElementById('messageInput');
const messages = document.querySelector('.messages-list');

let username
(async () => {
  if (userID) {
     username = await fetchUserName(userID);

    form.addEventListener('submit', () => {
      console.log('inside form username:-', username);
      event.preventDefault();
      socket.emit('send message', username, input.value);
      input.value = '';
    });
  }
})();

socket.on('newConnection', (data) => {
  console.log('newConnection data:-', data);
  sessionStorage.setItem('socketID', data.myID);
});

socket.on('connectionLost', (data) => {
  console.log('connectionLost data:-', data);
});

socket.on('new message', (data) => {
  const date = new Date();

  if (username == data.username) {
    const item = document.createElement('div');
    item.className = 'container green';
    item.innerHTML = `
                    <div class="seller-chip">
                    <img src="./img/shop01.png" alt="Avatar" class="right" style="width:100%;">
                    <h3>${data.username}</h3> 
                    </div>
                    <p>${data.message}</p>
                    <span class="time">${date.getHours()}:${date.getUTCMinutes()}</span>`;
    messages.appendChild(item);
  } else {
    const item = document.createElement('div');
    item.className = 'container white';
    item.innerHTML = `
                <div class="seller-chip">
                <img src="./img/shop01.png" alt="Avatar" style="width:100%;">
                <h3>${data.username}</h3> 
                </div>
                <p>${data.message}</p>
                <span class="time">${date.getHours()}:${date.getUTCMinutes()}</span>`;
    messages.appendChild(item);
  }
});
