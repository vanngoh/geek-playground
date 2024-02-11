const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const exit = document.getElementById('exit');
const messageBox = document.getElementById('message-box');
const username = document.getElementById('username');
const randomId = Math.floor(Math.random().toFixed(2) * 100);
username.value = `User-${randomId}`;

const ws = new WebSocket('ws://127.0.0.1:5000/test');
ws.onopen = (e) => {
  console.log(`Connection status ${ws.readyState}`);
};

ws.onmessage = (data) => {
  let msg = data.data;
  appendNewMessage(JSON.parse(msg));
};

ws.onclose = (data) => {
  console.log('Connection closed');
  console.log(data);
};

sendBtn.onclick = () => {
  let msg = {
    sender: !!username.value ? username.value : `User-${randomId}`,
    data: messageInput.value,
  };
  appendNewMessage(msg);
  ws.send(JSON.stringify(msg));
  messageInput.value = '';
};

exit.onclick = () => {
  ws.close();
};

const appendNewMessage = (msg) => {
  const { sender, data } = msg;
  messageBox.innerHTML += `<p>${sender}: ${data}</p>`;
  messageBox.scrollTo({
    top: messageBox.scrollHeight,
    behavior: 'smooth',
  });
};
