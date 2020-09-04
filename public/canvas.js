
const socket = io();
const canvas = document.querySelector('#canvas');
const cx = canvas.getContext('2d');
const palette = document.querySelector('#palette');
const px = palette.getContext('2d');

const colors = ['#00000', '#ff0000', '#00ff00', '#0000ff', '#00ffff', '#aa77dd'];

let palIndex = 0;
let palX = 10;
let palY = 10;
let palSize = 40;
let palCoords = [];

for (let i = 0; i < colors.length; i++) {
    px.fillStyle = colors[i];
    px.fillRect(palX, palY, palSize, palSize);

    palCoords.push({
        x1: palX,
        y1: palY,
        x2: palX + palSize,
        y2: palY + palSize
    });

    palX += 50;
}

console.table(palCoords);

palette.addEventListener('click', e => {
    palCoords.forEach((coords, index) => {
        if (e.offsetX >= coords.x1 && e.offsetX <= coords.x2 && e.offsetY >= coords.y1 && e.offsetY <= coords.y2) {
            console.log(index);
            palIndex = index;
        }
    })
});

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
});

let mouseDown = false;
let oldX, oldY;

canvas.addEventListener('mousedown', e => {
    mouseDown = true;
    oldX = e.offsetX;
    oldY = e.offsetY;
});

canvas.addEventListener('mouseup', e => {
    mouseDown = false;
});

canvas.addEventListener('mousemove', e => {
    if (mouseDown && oldX && oldY) {
        cx.lineWidth = 5;
        cx.lineCap = 'round';
        cx.strokeStyle = colors[palIndex];
        cx.beginPath();
        cx.moveTo(oldX, oldY);
        cx.lineTo(e.offsetX, e.offsetY);
        cx.stroke();

        socket.emit('send_drawing', {
            x1: oldX,
            y1: oldY,
            x2: e.offsetX,
            y2: e.offsetY
        });

        oldX = e.offsetX;
        oldY = e.offsetY;
    }
});

socket.on('receive_drawing', (data) => {
    cx.lineWidth = 5;
    cx.lineCap = 'round';
    cx.beginPath();
    cx.moveTo(data.x1, data.y1);
    cx.lineTo(data.x2, data.y2);
    cx.stroke();
});