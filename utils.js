const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    try {
        return jwt.verify(token, "secretLey");
    } catch (e) {
        return null;
    }
}

const RandomIdGenerator = () => {
    const t = Date.now();
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charLength = characters.length;
    var result = '';
    var prefix = '';
    var postfix = '';
    for (i = 0; i < 3; i++) {
        prefix += characters.charAt(Math.random() * charLength)
        postfix += characters.charAt(Math.random() * charLength)
    }
    result += prefix
    for (i = 0; i < 4; i++) {
        result += (t / Math.random()).toString().substring(2, 5);
    }
    result += postfix;
    for (i = 0; i < 4; i++) {
        result += (t / Math.random()).toString().substring(2, 4);
    }
    return result;
}

const HandleEscapeCharacters = (str) => {
    let replacedString = '';
    for (i = 0; i < str.length; i++) {
        if (str.charAt(i) === "'") {
            replacedString += "\'";
        }
        replacedString += str.charAt(i);
    }
    return replacedString;
}

module.exports = {
    verifyToken,
    RandomIdGenerator,
    HandleEscapeCharacters
}