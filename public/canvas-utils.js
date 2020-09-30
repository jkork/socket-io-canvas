/**
 * Asteet radiaaneiks
 * @param degrees
 */
function degToRad(degrees) {
    return Math.PI / 180 * degrees;
}

/**
 * ympyrä
 * @param {*} x 
 * @param {*} y 
 * @param {*} radius 
 * @param {*} degrees 
 */
function drawCircle(x, y, radius, degrees) {
    cx.beginPath();
    cx.arc(x, y, radius, 0, degToRad(degrees), false);
    cx.fill();
}