import conversationService from "../services/conversation.service.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createConversation = asyncHandler(
    async (req, res) => {
        const conversation = await conversationService.createConversation(
            req.user._id, req.body.participantId
        )
        return res.status(201).json(new ApiResponse(201, conversation, "Conversation created successfully"))
    }
)
export const getConversations = asyncHandler(
    async (req, res) => {
        const conversations = await conversationService.getUserConversations(req.user._id);
        return res.status(200).json(new ApiResponse(200, conversations, "Conversations fetched successfully"))
    }
);
export const getConversation = asyncHandler(
    async (req, res) => {
        const conversation = await conversationService.getConversation(req.user._id, req.params.conversationId);
        return res.status(200).json(new ApiResponse(200, conversation, "Conversation fetched successfully"))
    }
)