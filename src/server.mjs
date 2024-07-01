import path from 'path';
import { fileURLToPath } from 'url'; // Import fileURLToPath to convert import.meta.url to a filesystem path
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { Ollama } from 'ollama';

const __filename = fileURLToPath(import.meta.url); // Convert import.meta.url to file path
const __dirname = path.dirname(__filename); // Derive directory path from file path

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const ollama = new Ollama({ host: '<host-url-here>' });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('chat message', async (data) => {
    const { text, model } = data;
    try {
      const response = await getChatbotResponse(text, model);
      socket.emit('chat response', response);
    } catch (error) {
      socket.emit('chat response', 'Error processing your request.');
      console.error('Error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Function to handle chatbot response
const getChatbotResponse = async (message, model) => {
  const messages = [{ role: 'user', content: message }];
  try {
    const response = await ollama.chat({
      model: model,
      messages: messages,
    });

    if (!response || !response.message || !response.message.content) {
      throw new Error('Invalid response format from chat API');
    }

    return response.message.content;
  } catch (error) {
    console.error('Error in getChatbotResponse:', error);
    throw error;
  }
};

// Start the server listening on port 3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});
