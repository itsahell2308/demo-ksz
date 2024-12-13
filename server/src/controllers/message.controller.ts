import { Response } from "express";
import * as response from "../helpers/response.helper";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import Conversation from "../models/conversation.model";
import Message from "../models/message.model";

// Update the type of req to AuthenticatedRequest
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user?._id.toString();

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }, //find convo bwetween ids
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    console.log("🚀 ~ sendMessage ~ senderId:", senderId);
    response.success(res, "Sent successfully", newMessage);
  } catch (error) {
    response.error(res, error);
  }
};

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id: usertoChatId } = req.params;
    const senderId = req.user?._id.toString();

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, usertoChatId] },
    }).populate("messages"); // not reference but actual messages

    if (!conversation) {
      response.success(res, "Get successfully", []);
    }

    const messages = conversation?.messages;

    response.success(res, "Get successfully", messages);
  } catch (error) {
    response.error(res, error);
  }
};
