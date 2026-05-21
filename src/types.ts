/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiscordUser {
  id: string;
  name: string;
  phone: string; // Used for calling others
  avatar: string; // Emoji character or initials
  color: string; // Tailwind background color class
  customStatus: string;
  status: 'online' | 'idle' | 'dnd' | 'offline';
  isNitro: boolean; // Custom Discord Nitro avatar animations
  voiceState: {
    serverId: string | null;
    channelId: string | null;
    isMuted: boolean;
    isDeafened: boolean;
    isSpeaking: boolean;
  };
  lastSeen: number;
}

export interface DiscordServer {
  id: string;
  name: string;
  icon: string; // initials, emoji or symbol
  ownerId: string;
}

export interface DiscordChannel {
  id: string;
  serverId: string; // Points to server id or "home" for DM channel
  name: string;
  type: 'text' | 'voice';
}

export interface DiscordMessage {
  id: string;
  channelId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userColor: string;
  userCustomStatus: string;
  isNitro: boolean;
  text: string;
  sticker?: string; // If the message holds a Nitro sticker
  timestamp: string; // ISO string
}

export interface DiscordCall {
  id: string;
  callerId: string;
  receiverId: string;
  callerPhone: string;
  receiverPhone: string;
  status: 'ringing' | 'connected' | 'declined' | 'ended';
  channelId: string; // Unique voice channel ID created for their session
}

export interface DiscordState {
  servers: DiscordServer[];
  channels: DiscordChannel[];
  messages: DiscordMessage[];
  users: Record<string, DiscordUser>;
  calls: DiscordCall[];
}
