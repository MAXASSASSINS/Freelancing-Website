import express from 'express'
import { authorisedRoles, isAuthenticated } from '../middleware/auth.js';
import { addMessage, getAllMessagesBetweenTwoUsers, getAllMessagesForCurrentUser, getLastMessageBetweenTwoUser, getListOfAllInboxClients, sendFileUpload, updateAllMessages } from '../controllers/messageController.js';
import { sendSMS } from '../utils/twilio.js';
const router = express.Router();

import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '--' + file.originalname)
    }
})

export const upload = multer({ storage: storage }).single("fileUpload");
// export const uploads = multer({ storage: storage }).array("fileUpload");

router.post('/add/message', isAuthenticated, addMessage);
router.post('/get/all/messages/between/two/users', isAuthenticated, getAllMessagesBetweenTwoUsers);
router.get('/get/all/messages/for/current/user', isAuthenticated, getAllMessagesForCurrentUser);
router.get('/list/of/all/inbox/clients/for/current/user', isAuthenticated, getListOfAllInboxClients);
router.post('/get/last/message/between/two/user', isAuthenticated, getLastMessageBetweenTwoUser);
router.post('/send/files', isAuthenticated, upload, sendFileUpload);


router.post('/add/file',isAuthenticated, upload, (req, res)=>{
    console.log(req.file);
    
    res.send("file uploaded successfully");
});

router.get('/update/all/messages', updateAllMessages);

router.post('/send/SMS',  sendSMS);

export default router;



