const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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

const sendMail = async (to, subject, html) => {
    let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		auth: {
			user: 'elgo.queues@gmail.com',
			pass: 'Svk2432k01'
		},
	});

    await transporter.sendMail({
        from: '"Siddharth Koli" <elgo.queues@gmail.com>',
        to: to,
        subject: subject,
        html: html,
    })
};

module.exports = {
    verifyToken,
    RandomIdGenerator,
    HandleEscapeCharacters,
    sendMail
}