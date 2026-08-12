import { Router } from "express";

import authMiddleware from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import { 
    createConversation, 
    getConversation, 
    getConversations 
} from "../controllers/conversation.controller.js";
import { 
    createConversationSchema 
} from "../validators/conversation.validator.js";

const conversationRouter = Router();

conversationRouter.use(authMiddleware);
conversationRouter.post("/", validate(createConversationSchema), createConversation);
conversationRouter.get("/", getConversations)
conversationRouter.get("/:conversationId", getConversation);

export default conversationRouter