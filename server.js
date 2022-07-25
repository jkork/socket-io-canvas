const socketio = require('socket.io');
const express = require('express');
const { getTime, randomName } = require('./server-utils');

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (request, response) => {
    response.render('index', { title: 'Spurdo Chat'});
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});

const io = socketio(server);

io.on('connection', socket => {
    console.log(`[${getTime()}]: User ${socket.id} connected.`);

    socket.username = randomName();

    socket.on('send_drawing', data => {
        socket.broadcast.emit('receive_drawing', {
            x1: data.x1,
            y1: data.y1,
            x2: data.x2,
            y2: data.y2,
            color: data.color
        });
    });

    socket.on('change_username', data => {
        socket.username = data.username;
        io.sockets.emit('receive_message', { username: socket.username, message: 'liittyi keskusteluun' });
    });

    socket.on('new_message', data => {
        io.sockets.emit('receive_message', { username: socket.username, message: data.message });
    });

    socket.on('disconnect', () => {
        console.log(`[${getTime()}]: User ${socket.id} disconnected.`);
    });
});