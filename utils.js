function isNumber(char) {
    return char!== ' ' && !isNaN(Number(char));
}

module.exports = {
    isNumber
}