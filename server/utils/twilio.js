import twilio from "twilio";
import User from "../models/userModel.js";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);

export const sendSMS = (req, res) => {
  res.header("Content-Type", "application/json");
  twilioClient.messages
    .create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: req.body.to,
      body: req.body.body,
    })
    .then(() => {
      res.send(JSON.stringify({ success: true }));
    })
    .catch((err) => {
      console.log(err);
      res.send(JSON.stringify({ success: false }));
    });
};

export const verifyNumber = (req, res) => {
  twilioClient.verify.v2
    .services("VA571fee7d19f3e28ef9a285e861a341b1")
    .verifications.create({ to: req.body.phone.code + req.body.phone.number, channel: "sms" })
    .then((verification) => {
      res.status(200).json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.status(err.status).json({ success: false, error: err });
    });
};

export const verifyCode = (req, res) => {
  console.log(req.body);
  try {
    twilioClient.verify.v2
      .services("VA571fee7d19f3e28ef9a285e861a341b1")
      .verificationChecks.create({ to: req.body.phone.code + req.body.phone.number, code: req.body.code })
      .then((verification_check) => {
        if (verification_check.status === "approved") {
          User.findById(req.user.id).then((user) => {
            user.phone = req.body.phone;
            console.log(user);
            user
              .save({
                validateBeforeSave: false,
              })
              .then(() => {
                res.status(200).json({ success: true });
              });
          });
        } else res.status(202).json({ success: false, error: "Invalid code" });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ success: false, error: err });
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, error: err });
  }
};

export const verifyByCall = (req, res) => {
  twilioClient.verify.v2
    .services("VA571fee7d19f3e28ef9a285e861a341b1")
    .verifications.create({ to: req.body.to, channel: "voice" })
    .then((verification) => console.log(verification.status))
    .catch((err) => console.log(err));
};
