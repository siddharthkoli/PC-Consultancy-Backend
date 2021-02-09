const fs = require('fs');
const { sendMail } = require('./utils');

function sendSignupMail(recipient) {
    fs.readFile(__dirname + '/Signup.html', async (err, html) => {
        if (err) {
            console.log(`[Mail.js|sendSignupMail] ${e}`);
            return;
        }
        const subject = `Thank you for registering at PC Consultancy!`;
        await sendMail(recipient, subject, html);
    });
}

module.exports = {
    sendSignupMail,
}