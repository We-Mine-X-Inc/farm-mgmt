import {
  EMAIL_SERVER_HOST,
  EMAIL_SERVER_PASSWORD,
  EMAIL_SERVER_PORT,
  EMAIL_SERVER_USER,
} from "@/config";

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: EMAIL_SERVER_HOST,
  port: EMAIL_SERVER_PORT,
  secure: false,
  auth: {
    user: EMAIL_SERVER_USER,
    pass: EMAIL_SERVER_PASSWORD,
  },
});

// recipients should be a google group which contains relevant folks
// send alert if machine fails to witch pools to either the client or company
export default function getTransporter() {
  return transporter;
}
