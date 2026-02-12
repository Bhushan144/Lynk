import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
    sendConnectionRequest, 
    handleRequest, 
    sendMessage,
    getMyRequests,
    getMyChats,
    getMessages
} from "../controllers/chat.controller.js";

const router = Router();

router.use(verifyJWT); // Apply verifyJWT to all routes automatically

// --- CONNECTION REQUESTS ---
router.route("/request").post(sendConnectionRequest);       // Send a request
router.route("/manage-request").post(handleRequest);        // Accept/Reject
router.route("/requests").get(getMyRequests);               // View Pending

// --- CHATTING ---
// Matches Frontend: api.get("/chat/my-chats")
router.route("/my-chats").get(getMyChats);                  

// Matches Frontend: api.post("/chat/send")
router.route("/send").post(sendMessage);                    

// Matches Frontend: api.get("/chat/:conversationId")
// IMPORTANT: This must be at the bottom to avoid conflicts with specific routes
router.route("/:conversationId").get(getMessages);          

export default router;