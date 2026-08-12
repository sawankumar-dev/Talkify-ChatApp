import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.js"

const createConversation = async (currentUserId, participantId) => {
    if(currentUserId.toString() === participantId.toString()) {
        throw new ApiError(
            400,
            "You cannot create a conversation with yourself"
        );
    }
    const participant = await User.findById(participantId);
    if(!participant) {
        throw new ApiError(404, "Participant not found");
    }
    const existingConversation = await Conversation.findOne({
        type: "direct",
        participants: {
            $all: [currentUserId, participantId]
        }
    }).populate("participants", "name username email avatar").populate("lastMessage")
    if(existingConversation) {
        return existingConversation;
    }
    const conversation = await Conversation.create({
        type: "direct",
        participants: [currentUserId, participantId],
    });
    return Conversation.findById(conversation._id).populate("participants", "name username email avatar")
    .populate("lastMessage");
}
const getUserConversations = async (userId) => {
    return Conversation.find({
        participants: userId,
    }).populate("participants", "name username email avatar")
    .populate({
        path: "lastMessage",
        populate: {
            path: "sender",
            select: "name username avatar"
        },
    }).sort(({ updatedAt: -1 }));
}
const getConversationById = async (userId, conversationId) => {
    const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: userId,
    }).populate("participants", "name username email avatar")
        .populate({
            path: "lastMessage",
            populate: {
                path: "sender",
                select: "name username avatar"
            }
        })
        if(!conversation) {
            throw new ApiError(404, "Conversation not found")
        }
        return conversation;
}



export default {
    createConversation,
    getUserConversations,
    getConversationById,
}









