import express from "express";
import { authorisedRoles, isAuthenticated } from "../middleware/auth.js";
import {
  addMessage,
  addOrderMessage,
  deleteAllMessages,
  getAllMessagesBetweenTwoUsers,
  getAllMessagesForCurrentUser,
  getAllOrderMessages,
  getLastMessageBetweenTwoUser,
  getListOfAllInboxClients,
  sendFileUpload,
  updateAllMessages,
} from "../controllers/messageController.js";
import { sendSMS, verifyNumber, verifyCode } from "../utils/twilio.js";
import { uploadMultipleFiles, uploadSingleFile } from "../utils/multer.js";

const router = express.Router();

router.post("/add/message", isAuthenticated, addMessage);
router.post("/add/order/message/:id", isAuthenticated, addOrderMessage);


router.post(
  "/get/all/messages/between/two/users",
  isAuthenticated,
  getAllMessagesBetweenTwoUsers
);
router.get(
  "/get/all/messages/for/current/user",
  isAuthenticated,
  getAllMessagesForCurrentUser
);
router.get(
  "/list/of/all/inbox/clients/for/current/user",
  isAuthenticated,
  getListOfAllInboxClients
);
router.post(
  "/get/last/message/between/two/user",
  isAuthenticated,
  getLastMessageBetweenTwoUser
);
router.post("/send/files", isAuthenticated, uploadSingleFile, sendFileUpload);

router.delete("/delete/messages", deleteAllMessages);

router.post("/add/file", isAuthenticated, uploadSingleFile, (req, res) => {
  

  res.send("file uploaded successfully");
});

router.get("/update/all/messages", updateAllMessages);

router.post("/send/SMS", sendSMS);
router.post("/verify/number", verifyNumber);
router.post("/verify/by/call", verifyNumber);
router.post("/verify/code", verifyCode);

router.get("/message/order/:id", isAuthenticated, getAllOrderMessages);

export default router;
