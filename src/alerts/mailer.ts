const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
    },
})

// recipients should be a google group which contains relevant folks
// send alert if machine fails to witch pools to either the client or company
export default function getTransporter() {
    return transporter
}