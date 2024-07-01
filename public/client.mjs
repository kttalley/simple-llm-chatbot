const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const loadingMessage = document.getElementById('loading-message');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent default form submission
  if (input.value) {
    const message = {
      text: input.value,
      model: document.getElementById('model').value
    };
    socket.emit('chat message', message);
    input.value = '';
    loadingMessage.style.display = 'block';
  }
});

socket.on('chat response', function(msg) {
  loadingMessage.style.display = 'none';
  const item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});
