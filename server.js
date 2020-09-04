const socketio = require('socket.io');
const express = require('express');
const { getTime } = require('./server-utils');

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.render('index');
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});

const io = socketio(server);

io.on('connection', (socket) => {
    console.log(`[${getTime()}]: User ${socket.id} connected.`);

    socket.on('send_drawing', (data) => {
        socket.broadcast.emit('receive_drawing', {
            x1: data.x1,
            y1: data.y1,
            x2: data.x2,
            y2: data.y2
        });
    });

    socket.on('disconnect', () => {
        console.log(`[${getTime()}]: User ${socket.id} disconnected.`);
    });
});