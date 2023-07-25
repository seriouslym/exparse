function isNumber(char) {
    return char!== ' ' && char != null && !isNaN(Number(char));
}

module.exports = {
    isNumber
}