
const socket = io();
const canvas = document.querySelector('#canvas');
const cx = canvas.getContext('2d');
const palette = document.querySelector('#palette');
const px = palette.getContext('2d');

const colors = ['#000000', '#ff0000', '#00ff00', '#0000ff', '#fff200', '#00ffff', '#aa77dd', '#ffc908', '#d43644', '#7db43e'];

const PAL_START_X = 10;
const PAL_START_Y = 10;
const PAL_SIZE = 40;

let palCoords = [];
let palIndex = 0;
let oldX, oldY;
let mouseDown = false;

const drawPalette = () => {
    let palX = PAL_START_X;
    let palY = PAL_START_Y;
    palCoords = [];

    for (let i = 0; i < colors.length; i++) {
        px.fillStyle = colors[i];
        px.fillRect(palX, palY, PAL_SIZE, PAL_SIZE);
    
        palCoords.push({
            x1: palX,
            y1: palY,
            x2: palX + PAL_SIZE,
            y2: palY + PAL_SIZE
        });
    
        palX += 50;
    }
}

const drawMarker = (coords) => {
    let x1 = coords.x2 - 10;
    let y1 = coords.y1;

    let x2 = coords.x2;
    let y2 = coords.y1 + 10;

    let x3 = coords.x2;
    let y3 = coords.y1;

    let x4 = coords.x2 - 10;
    let y4 = coords.y1 + 10;

    px.strokeStyle = '#ffffff';
    px.lineWidth = 2;
    cx.lineCap = 'round';
    px.beginPath();
    px.moveTo(x1, y1);
    px.lineTo(x2, y2);
    px.moveTo(x3, y3);
    px.lineTo(x4, y4);
    px.stroke();

    let tmp = x1;
    x1 = x2;
    x2 = tmp;
    
}

drawPalette();

palette.addEventListener('click', e => {
    palCoords.forEach((coords, index) => {
        if (e.offsetX >= coords.x1 && e.offsetX <= coords.x2 && e.offsetY >= coords.y1 && e.offsetY <= coords.y2) {
            palIndex = index;
            drawPalette();
            drawMarker(coords);
        }
    })
});

canvas.addEventListener('contextmenu', event => {
    event.preventDefault();
});

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
            y2: e.offsetY,
            color: colors[palIndex]
        });

        oldX = e.offsetX;
        oldY = e.offsetY;
    }
});

socket.on('receive_drawing', (data) => {
    cx.lineWidth = 5;
    cx.lineCap = 'round';
    cx.strokeStyle = data.color;
    cx.beginPath();
    cx.moveTo(data.x1, data.y1);
    cx.lineTo(data.x2, data.y2);
    cx.stroke();
});