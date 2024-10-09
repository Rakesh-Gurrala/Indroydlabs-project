const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let currentQuestionIndex = 0;
const questions = [
    { question: "What is the capital of France?", answer: "Paris" },
    { question: "What is 5 + 7?", answer: "12" },
    { question: "Who wrote 'Hamlet'?", answer: "Shakespeare" },
    { question: "Which planet is known as the Red Planet?", answer: "Mars" },
    { question: "What is the largest mammal?", answer: "Blue Whale" }
];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Websocket logic
io.on('connection', (socket) => {
    // Send the current question to the central display
    socket.emit('question', questions[currentQuestionIndex].question);
 // Handle player answers
 socket.on('submitAnswer', ({ playerName, answer }) => {
    if (answer.toLowerCase() === questions[currentQuestionIndex].answer.toLowerCase()) {
        io.emit('correctAnswer', { playerName });
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            io.emit('question', questions[currentQuestionIndex].question);
        } else {
            io.emit('gameOver', 'Game Over! No more questions.');
        }
    } else {
        socket.emit('wrongAnswer', 'Wrong Answer! Try again.');
    }
});
});

server.listen(3000, () => {
console.log('Server is running on port 3000');
});
