/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { DiscordState, DiscordUser, DiscordServer, DiscordChannel, DiscordMessage, DiscordCall } from './src/types';

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'discord_db.json');

// --- SSE Client Manager ---
let sseClients: express.Response[] = [];

function broadcastStateUpdate() {
  const currentStateString = JSON.stringify({ type: 'state', state: getDBState() });
  sseClients.forEach(client => {
    try {
      client.write(`data: ${currentStateString}\n\n`);
    } catch (err) {
      // client connection likely broken, handled on connection close
    }
  });
}

// --- DB State Manager ---
const INITIAL_STATE: DiscordState = {
  servers: [
    { id: 'pub', name: 'Google AI Studio', icon: '🤖', ownerId: 'system' },
    { id: 'game', name: 'Gamers Central', icon: '🎮', ownerId: 'system' },
    { id: 'music', name: 'Chill Beats', icon: '🎵', ownerId: 'system' }
  ],
  channels: [
    // Google AI Studio channels
    { id: 'pub-welcome', serverId: 'pub', name: '👋-welcome', type: 'text' },
    { id: 'pub-general', serverId: 'pub', name: '💬-general-chat', type: 'text' },
    { id: 'pub-prompts', serverId: 'pub', name: '💡-prompt-magic', type: 'text' },
    { id: 'pub-voice1', serverId: 'pub', name: '🔊 AI Workspace 1', type: 'voice' },
    { id: 'pub-voice2', serverId: 'pub', name: '🔊 Coding Core', type: 'voice' },

    // Gamers Central
    { id: 'game-general', serverId: 'game', name: '🎮-lobby', type: 'text' },
    { id: 'game-clips', serverId: 'game', name: '🎬-highlight-reels', type: 'text' },
    { id: 'game-voice1', serverId: 'game', name: '🔊 CS2 Team Alpha', type: 'voice' },
    { id: 'game-voice2', serverId: 'game', name: '🔊 Minecraft Realm Sandbox', type: 'voice' },

    // Chill Beats
    { id: 'music-hype', serverId: 'music', name: '🎵-playlist-hype', type: 'text' },
    { id: 'music-voice1', serverId: 'music', name: '🔊 24/7 Lofi Study Corner', type: 'voice' }
  ],
  messages: [
    {
      id: 'msg-init-1',
      channelId: 'pub-welcome',
      userId: 'system',
      userName: 'Clyde Bot',
      userAvatar: '🤖',
      userColor: 'bg-indigo-600',
      userCustomStatus: 'Beep boop!',
      isNitro: true,
      text: 'Welcome to this incredibly detailed Discord Clone with full-stack capabilities! 🚀 You have full multiplayer support, live servers, text rooms, and interactive phone-dial calls!',
      timestamp: new Date().toISOString()
    },
    {
      id: 'msg-init-2',
      channelId: 'pub-welcome',
      userId: 'system',
      userName: 'Wumpus',
      userAvatar: '🐷',
      userColor: 'bg-pink-500',
      userCustomStatus: 'Hugging everyone',
      isNitro: true,
      text: 'Hey there! Introduce yourself in `#💬-general-chat` and test out sending Nitro stickers! Feel free to dial a friend using Discord Call by registering your number in Settings! 📞✨',
      timestamp: new Date(Date.now() + 1000).toISOString()
    }
  ],
  users: {},
  calls: []
};

// Seed or load database
function getDBState(): DiscordState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      // Clean up offline users or active calls on load to avoid layout locks
      if (parsed.users) {
        Object.keys(parsed.users).forEach((id) => {
          // If user hasn't synced in 2 minutes, mark offline
          if (Date.now() - parsed.users[id].lastSeen > 120000) {
            parsed.users[id].status = 'offline';
            parsed.users[id].voiceState = { serverId: null, channelId: null, isMuted: false, isDeafened: false, isSpeaking: false };
          }
        });
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading database, resetting to initial state:", err);
  }
  saveDBState(INITIAL_STATE);
  return INITIAL_STATE;
}

function saveDBState(state: DiscordState) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing database state:", err);
  }
}

// Ensure database file starts with seed on boot
getDBState();

// Express middle-wares
app.use(express.json());

// --- REST API Endpoints ---

// Get complete global state
app.get('/api/state', (req, res) => {
  res.json(getDBState());
});

// Create/Update Discord user profile
app.post('/api/register', (req, res) => {
  const { id, name, phone, avatar, color, status, customStatus, isNitro } = req.body;
  if (!id || !name) {
    return res.status(400).json({ error: 'Missing unique user ID or username.' });
  }

  const dbState = getDBState();
  const existingUser = dbState.users[id];

  // If another user already has this phone number registered, prompt error to avoid dial conflicts
  if (phone && phone.trim()) {
    const isPhoneTaken = Object.values(dbState.users).some(u => u.id !== id && u.phone === phone.trim());
    if (isPhoneTaken) {
      return res.status(400).json({ error: 'This phone number is already linked to another active Discord tag.' });
    }
  }

  const defaultVoiceState = {
    serverId: null,
    channelId: null,
    isMuted: false,
    isDeafened: false,
    isSpeaking: false
  };

  dbState.users[id] = {
    id,
    name: name.substring(0, 32),
    phone: (phone || '').trim(),
    avatar: avatar || '🐱',
    color: color || 'bg-slate-500',
    customStatus: (customStatus || '').substring(0, 60),
    status: status || 'online',
    isNitro: !!isNitro,
    voiceState: existingUser ? (existingUser.voiceState || defaultVoiceState) : defaultVoiceState,
    lastSeen: Date.now()
  };

  saveDBState(dbState);
  broadcastStateUpdate();
  res.json({ success: true, user: dbState.users[id] });
});

// Heartbeat to keep status active
app.post('/api/heartbeat', (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: 'Missing ID' });

  const dbState = getDBState();
  if (dbState.users[id]) {
    dbState.users[id].lastSeen = Date.now();
    // Only bring online if they were marked offline
    if (dbState.users[id].status === 'offline') {
      dbState.users[id].status = 'online';
    }
    saveDBState(dbState);
    broadcastStateUpdate();
  }
  res.json({ success: true });
});

// Create a new Server
app.post('/api/server', (req, res) => {
  const { name, icon, ownerId } = req.body;
  if (!name || !ownerId) {
    return res.status(400).json({ error: 'Missing server name or creator ID.' });
  }

  const serverId = 'srv-' + Math.random().toString(36).substring(2, 9);
  const dbState = getDBState();

  const newServer: DiscordServer = {
    id: serverId,
    name: name.substring(0, 40),
    icon: icon ? icon.substring(0, 4) : name.substring(0, 2).toUpperCase(),
    ownerId
  };

  dbState.servers.push(newServer);

  // Auto-generate standard #welcome and #general text channels, and 1 voice channel
  const welcomeChan: DiscordChannel = {
    id: `${serverId}-welcome`,
    serverId: serverId,
    name: '👋-welcome',
    type: 'text'
  };
  const generalChan: DiscordChannel = {
    id: `${serverId}-general`,
    serverId: serverId,
    name: '💬-general-chat',
    type: 'text'
  };
  const voiceChan: DiscordChannel = {
    id: `${serverId}-voice`,
    serverId: serverId,
    name: '🔊 Gaming Corner',
    type: 'voice'
  };

  dbState.channels.push(welcomeChan, generalChan, voiceChan);

  // Add system-welcome message in the new server general chat
  dbState.messages.push({
    id: 'msg-srv-welcome-' + Math.random().toString(36).substring(2, 9),
    channelId: welcomeChan.id,
    userId: 'system',
    userName: 'Clyde Bot',
    userAvatar: '🤖',
    userColor: 'bg-indigo-600',
    userCustomStatus: 'Server creator assistant',
    isNitro: true,
    text: `🎉 Welcome to **${newServer.name}**! This server has been dynamically created. Invite your online friends to chat in real-time or click "Gaming Corner" below to jump into a voice room!`,
    timestamp: new Date().toISOString()
  });

  saveDBState(dbState);
  broadcastStateUpdate();
  res.json({ success: true, server: newServer, defaultChannelId: generalChan.id });
});

// Create a custom Channel in a server
app.post('/api/channel', (req, res) => {
  const { serverId, name, type } = req.body;
  if (!serverId || !name || !type) {
    return res.status(400).json({ error: 'Missing channel arguments.' });
  }

  const dbState = getDBState();
  const channelId = 'chan-' + Math.random().toString(36).substring(2, 9);

  let formattedName = name.replace(/\s+/g, '-').toLowerCase();
  if (type === 'voice') {
    formattedName = '🔊 ' + name;
  } else {
    formattedName = formattedName.startsWith('#') ? formattedName : '💬-' + formattedName;
  }

  const newChannel: DiscordChannel = {
    id: channelId,
    serverId,
    name: formattedName.substring(0, 40),
    type: type === 'voice' ? 'voice' : 'text'
  };

  dbState.channels.push(newChannel);
  saveDBState(dbState);
  broadcastStateUpdate();
  res.json({ success: true, channel: newChannel });
});

// Broadcast / Post new messages
app.post('/api/message', (req, res) => {
  const { channelId, userId, text, sticker } = req.body;
  if (!channelId || !userId) {
    return res.status(400).json({ error: 'Missing message sender or target room.' });
  }

  const dbState = getDBState();
  const activeUser = dbState.users[userId];
  if (!activeUser) {
    return res.status(404).json({ error: 'User profiles need to be initialized first.' });
  }

  const newMessage: DiscordMessage = {
    id: 'msg-' + Math.random().toString(36).substring(2, 11),
    channelId,
    userId,
    userName: activeUser.name,
    userAvatar: activeUser.avatar,
    userColor: activeUser.color,
    userCustomStatus: activeUser.customStatus,
    isNitro: activeUser.isNitro,
    text: text ? text.substring(0, 1000) : '',
    sticker,
    timestamp: new Date().toISOString()
  };

  // Limit back-log size per room of 150 messages to keep memory payload lightweight
  dbState.messages.push(newMessage);
  const matchedRoomMsgs = dbState.messages.filter(m => m.channelId === channelId);
  if (matchedRoomMsgs.length > 150) {
    const oldestRefIndex = dbState.messages.findIndex(m => m.channelId === channelId);
    if (oldestRefIndex !== -1) {
      dbState.messages.splice(oldestRefIndex, 1);
    }
  }

  saveDBState(dbState);
  broadcastStateUpdate();
  res.json({ success: true, message: newMessage });
});

// Join Voice Channel
app.post('/api/voice/join', (req, res) => {
  const { userId, serverId, channelId } = req.body;
  if (!userId || !serverId || !channelId) {
    return res.status(400).json({ error: 'Missing Voice Room joining descriptors.' });
  }

  const dbState = getDBState();
  if (dbState.users[userId]) {
    dbState.users[userId].voiceState = {
      serverId,
      channelId,
      isMuted: dbState.users[userId].voiceState?.isMuted || false,
      isDeafened: dbState.users[userId].voiceState?.isDeafened || false,
      isSpeaking: false
    };

    saveDBState(dbState);
    broadcastStateUpdate();
  }
  res.json({ success: true, voiceState: dbState.users[userId]?.voiceState });
});

// Leave current Voice Channel
app.post('/api/voice/leave', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const dbState = getDBState();
  if (dbState.users[userId]) {
    dbState.users[userId].voiceState = {
      serverId: null,
      channelId: null,
      isMuted: dbState.users[userId].voiceState?.isMuted || false,
      isDeafened: dbState.users[userId].voiceState?.isDeafened || false,
      isSpeaking: false
    };

    saveDBState(dbState);
    broadcastStateUpdate();
  }
  res.json({ success: true });
});

// Update speaking status or mic/headset triggers
app.post('/api/voice/state', (req, res) => {
  const { userId, isMuted, isDeafened, isSpeaking } = req.body;
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  const dbState = getDBState();
  if (dbState.users[userId]) {
    if (typeof isMuted === 'boolean') dbState.users[userId].voiceState.isMuted = isMuted;
    if (typeof isDeafened === 'boolean') dbState.users[userId].voiceState.isDeafened = isDeafened;
    if (typeof isSpeaking === 'boolean') dbState.users[userId].voiceState.isSpeaking = isSpeaking;

    saveDBState(dbState);
    broadcastStateUpdate();
  }
  res.json({ success: true, voiceState: dbState.users[userId]?.voiceState });
});

// Direct dial call connection by linked phone numbers
app.post('/api/call/dial', (req, res) => {
  const { callerId, targetPhone } = req.body;
  if (!callerId || !targetPhone) {
    return res.status(400).json({ error: 'Please enter a target phone number to dial.' });
  }

  const dbState = getDBState();
  const caller = dbState.users[callerId];
  if (!caller) {
    return res.status(404).json({ error: 'Caller profile not found.' });
  }

  // Look up user with matched phone number that is currently online
  const formattedTargetPhone = targetPhone.trim();
  const receiver = Object.values(dbState.users).find(
    u => u.phone === formattedTargetPhone && u.id !== callerId
  );

  if (!receiver) {
    return res.status(404).json({
      error: 'We could not find active Discord contact linked to this phone number. Please verify the user linked this exact number in Settings!'
    });
  }

  // Check if they are busy on another call
  const isBusy = dbState.calls.some(
    c => (c.callerId === receiver.id || c.receiverId === receiver.id) && c.status === 'connected'
  );
  if (isBusy) {
    return res.status(400).json({ error: 'That contact is currently busy in another call.' });
  }

  const callId = 'call-' + Math.random().toString(36).substring(2, 9);
  const voiceChannelForCallId = 'vchan-' + callId;

  const newCall: DiscordCall = {
    id: callId,
    callerId,
    receiverId: receiver.id,
    callerPhone: caller.phone,
    receiverPhone: receiver.phone,
    status: 'ringing',
    channelId: voiceChannelForCallId
  };

  // Push call, clean up stale ringing calls
  dbState.calls = dbState.calls.filter(c => c.callerId !== callerId && c.receiverId !== receiver.id);
  dbState.calls.push(newCall);

  // Auto-generate virtual channel for direct call messaging or logs
  dbState.channels.push({
    id: voiceChannelForCallId,
    serverId: 'home',
    name: `📞 Call Room (${caller.name} & ${receiver.name})`,
    type: 'voice'
  });

  saveDBState(dbState);
  broadcastStateUpdate();
  res.json({ success: true, call: newCall });
});

// Respond to Ringing Call invitation
app.post('/api/call/respond', (req, res) => {
  const { callId, action } = req.body; // action: 'accept' | 'decline'
  if (!callId || !action) {
    return res.status(400).json({ error: 'Missing responses fields.' });
  }

  const dbState = getDBState();
  const callIndex = dbState.calls.findIndex(c => c.id === callId);

  if (callIndex === -1) {
    return res.status(404).json({ error: 'The active call invite has expired or already ended.' });
  }

  const call = dbState.calls[callIndex];

  if (action === 'accept') {
    call.status = 'connected';
    // Automatically join both users to the dedicated voice room
    const callerUser = dbState.users[call.callerId];
    const receiverUser = dbState.users[call.receiverId];

    if (callerUser) {
      callerUser.voiceState = {
        serverId: 'home',
        channelId: call.channelId,
        isMuted: false,
        isDeafened: false,
        isSpeaking: false
      };
    }
    if (receiverUser) {
      receiverUser.voiceState = {
        serverId: 'home',
        channelId: call.channelId,
        isMuted: false,
        isDeafened: false,
        isSpeaking: false
      };
    }
  } else {
    call.status = 'declined';
    // cleanup later or end
    setTimeout(() => {
      const state = getDBState();
      state.calls = state.calls.filter(c => c.id !== callId);
      state.channels = state.channels.filter(ch => ch.id !== call.channelId);
      saveDBState(state);
      broadcastStateUpdate();
    }, 3000);
  }

  saveDBState(dbState);
  broadcastStateUpdate();
  res.json({ success: true, call });
});

// End Active Call
app.post('/api/call/end', (req, res) => {
  const { callId } = req.body;
  if (!callId) return res.status(400).json({ error: 'Missing callId' });

  const dbState = getDBState();
  const call = dbState.calls.find(c => c.id === callId);

  if (call) {
    call.status = 'ended';

    // Disconnect users voice states referencing this call room
    const callerUser = dbState.users[call.callerId];
    const receiverUser = dbState.users[call.receiverId];

    if (callerUser && callerUser.voiceState.channelId === call.channelId) {
      callerUser.voiceState = { serverId: null, channelId: null, isMuted: false, isDeafened: false, isSpeaking: false };
    }
    if (receiverUser && receiverUser.voiceState.channelId === call.channelId) {
      receiverUser.voiceState = { serverId: null, channelId: null, isMuted: false, isDeafened: false, isSpeaking: false };
    }

    // Delayed removal to let caller/receiver see the visual "Call Ended" feedback cleanly
    setTimeout(() => {
      const state = getDBState();
      state.calls = state.calls.filter(c => c.id !== callId);
      state.channels = state.channels.filter(ch => ch.id !== call.channelId);
      saveDBState(state);
      broadcastStateUpdate();
    }, 2000);
  }

  saveDBState(dbState);
  broadcastStateUpdate();
  res.json({ success: true });
});

// --- Server-Sent Events (SSE) stream router ---
app.get('/api/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  res.write('\n');

  sseClients.push(res);

  // Immediate registration output state dump to client
  res.write(`data: ${JSON.stringify({ type: 'state', state: getDBState() })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

// Serve frontend build static or run Vite HMR middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Discord Server Core] Online on port ${PORT}`);
  });
}

startServer();
