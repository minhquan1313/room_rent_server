import { IChatMember } from "@/models/ChatSocket/ChatMember";
import { IChatMessage } from "@/models/ChatSocket/ChatMessage";
import { ModelToPayload } from "@/types/ModelToPayload";

export type IChatMessagePayload = ModelToPayload<Omit<IChatMessage, "_id" | "updatedAt" | "createdAt" | "seen">> & {
  receiver: string[];
  room?: string;
  members?: IChatMember[];
};
