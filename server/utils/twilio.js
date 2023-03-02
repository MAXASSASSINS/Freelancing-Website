import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

export const sendSMS = (req, res) => {
  res.header('Content-Type', 'application/json');
  twilioClient.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch(err => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
}

export const verifyNumber = (req, res) => {
  twilioClient.verify.v2.services('VA571fee7d19f3e28ef9a285e861a341b1')
    .verifications
    .create({ to: req.body.to, channel: 'sms' })
    .then(verification => console.log(verification.status));
}

export const verifyCode = (req, res) => {
  twilioClient.verify.v2.services('VA571fee7d19f3e28ef9a285e861a341b1')
    .verificationChecks
    .create({ to: req.body.to, code: req.body.code })
    .then(verification_check => console.log(verification_check.status))
    .catch(err => console.log(err));
}