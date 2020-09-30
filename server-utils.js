/**
 * Kellonaika HH:MM:SS muodossa datetimestä
 */
function getTime() {
    return new Date().toTimeString().substring(0, 8);
}

/**
 * Random nimi keskusteluun
 */
function randomName() {
    return 'Anomuumi_' + Math.ceil((Math.random() * 1000 - 1)).toString();
}

module.exports.getTime = getTime;
module.exports.randomName = randomName;