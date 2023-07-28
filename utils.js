function isNumber(char) {
    return char!== ' ' && char != null && !isNaN(Number(char));
}
function isLetter(char) {
    return /^[a-zA-Z]$/.test(char);
}
module.exports = {
    isNumber,
    isLetter
}