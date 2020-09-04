/**
 * Returns HH:MM:SS from current datetime
 */
function getTime() {
    return new Date().toTimeString().substring(0, 8);
}

module.exports.getTime = getTime;

