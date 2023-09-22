import { IChatMember } from "@/models/ChatSocket/ChatMember";
import { IChatMessage } from "@/models/ChatSocket/ChatMessage";
import { IChatSeen } from "@/models/ChatSocket/ChatSeen";

export interface IChatMessageWithSeen extends IChatMessage {
  seen: IChatSeen[];
}
export type TChatList = {
  room: string;
  members: IChatMember[];
  messages: IChatMessageWithSeen[];
};
