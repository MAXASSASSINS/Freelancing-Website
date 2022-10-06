import express from 'express'
import { authorisedRoles, isAuthenticated } from '../middleware/auth.js';
import { addMessage, getAllMessagesBetweenTwoUsers, getAllMessagesForCurrentUser, getLastMessageBetweenTwoUser, getListOfAllInboxClients } from '../controllers/messageController.js';
const router = express.Router();

router.post('/add/message', addMessage);
router.post('/get/all/messages/between/two/users', getAllMessagesBetweenTwoUsers);
router.get('/get/all/messages/for/current/user', getAllMessagesForCurrentUser);
router.get('/list/of/all/inbox/clients/for/current/user',isAuthenticated, getListOfAllInboxClients);
router.post('/get/last/message/between/two/user', getLastMessageBetweenTwoUser);


export default router;



