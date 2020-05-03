'use strict';

const socket = io();

const form = document.querySelector('.write-message form');
const input = document.getElementById('messageInput');
const messages = document.querySelector('.messages-list');
const productOwner = location.href.split('?').pop();

(async () => {
  try{
    if (userID) {
      const user = await fetchUser(userID);
      form.addEventListener('submit', () => {
        event.preventDefault();
        socket.emit('send message', {
          userID,
          username: user.owner.name,
          picture: user.owner.dp,
          message: input.value,
          productOwner,
        });
        input.value = '';
      });
    }
  }catch(err){
    throw new Error(err)
  }
  
})();

// Fetch chats from history
(async () => {
  const query = {
    query: `{
        chats(\n senderID:"${userID}",
        sendToID:"${productOwner}"){
        id
        message
        sender{\n id\n name\n dp\n}\n
        sendTo{\n id\n name\n dp\n}\n
        createdAt
        updatedAt
      }
    }`,
  };

  try {
    const data = await fetchGraphql(query);
    console.log('data', data);
    data.chats.forEach((chat) => {
      populateMessages(chat, chat.createdAt);
    });
  } catch (err) {
    throw new Error(err.message);
  }
})();

socket.on('newConnection', (id) => {
  socket.emit('new user', { userID, id });
});

const populateMessages = (data, time) => {
  console.log('this is a data',data)
  if (userID == data.sender.id) {
    const item = document.createElement('div');
    item.className = 'container green';
    item.innerHTML = `
                    <div class="seller-chip">
                    <img src="${
                      data.sender.dp
                    }" alt="Avatar" class="right" style="width:100%;">
                    <h3>${data.sender.name}</h3> 
                    </div>
                    <p>${data.message}</p>
                    <span class="time">${timeAgo(time)}</span>`;
    messages.appendChild(item);
  } else {
    const item = document.createElement('div');
    item.className = 'container white';
    item.innerHTML = `
                <div class="seller-chip">
                <img src="${data.sender.dp}" alt="Avatar" style="width:100%;">
                <h3>${data.sender.name}</h3> 
                </div>
                <p>${data.message}</p>
                <span class="time">${timeAgo(time)}</span>`;
    messages.appendChild(item);
  }
};

socket.on('new message', (data) => {
  const moment = Date.now();
  populateMessages(data, moment);
});
