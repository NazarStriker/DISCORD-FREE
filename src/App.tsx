/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Hash,
  Volume2,
  Plus,
  Search,
  Smile,
  Share2,
  Camera,
  Mic,
  MicOff,
  Headphones,
  Settings,
  Phone,
  PhoneCall,
  PhoneOff,
  UserPlus,
  Users,
  LogOut,
  MessageSquare,
  Home,
  ShieldAlert,
  Send,
  Sparkles,
  SmilePlus,
  HelpCircle,
  Activity,
  PhoneIncoming,
  X,
  ChevronRight,
  Circle
} from 'lucide-react';
import { DiscordState, DiscordUser, DiscordServer, DiscordChannel, DiscordMessage, DiscordCall } from './types';

// Standard avatar options
const AVATAR_OPTIONS = [
  { emoji: '🦊', label: 'Fox' },
  { emoji: '🐱', label: 'Cat' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐙', label: 'Octopus' },
  { emoji: '🤖', label: 'Robot' },
  { emoji: '👽', label: 'Alien' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🐺', label: 'Wolf' },
  { emoji: '🛸', label: 'UFO' },
  { emoji: '🐨', label: 'Koala' },
  { emoji: '🐸', label: 'Frog' },
];

// Color options
const COLOR_OPTIONS = [
  'bg-blue-500',
  'bg-emerald-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-rose-500',
  'bg-teal-500',
  'bg-sky-500',
  'bg-amber-500',
  'bg-orange-500',
  'bg-[#5865f2]', // blurple
];

// Nitro Stickers Pack
const NITRO_STICKERS = [
  { id: 'wumpus_wave', label: '👋 Wumpus Wave', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3pjdW1tcHBmODdneHF1dmh6ZmtuazlrdmtpaHN3cTkyODc1d3p2byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/v9b69iYmKx8Gq6f0zB/giphy.gif' },
  { id: 'wumpus_love', label: '💖 Wumpus Love', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2Jna3p0YnVyeHY4dDlyc3pxazU0OWp6YnNncHAyeXJhNWJkc2JieCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/vdp4d49XIsFq7B1H4b/giphy.gif' },
  { id: 'clyde_hype', label: '🔥 Clyde Hype', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdWp3d2JvbnkyNDR0MTFhbDBlM3g3ZnV4dG9yeXUzbjMwbWhuNnV3byZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/s8y8M94RSRitV37A4N/giphy.gif' },
  { id: 'mario_luigi', label: '🍄 Mushroom Hype', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNmNxbjRhdzF5Y3I5ZHBkMTdtMDM4YndkdnNjcDczdm5hbWtyOHMzaSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/y8Myj6v6W6GInxAxfv/giphy.gif' },
  { id: 'cat_dance', label: '🐱 Happy Cat', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeWZ0MWwzMWNidmhvZXNudjgycDJ1cW96ZmpxaDMxc3Nxd2V1dnU5YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/gS79x9D3P78UvJbL3L/giphy.gif' },
  { id: 'pepe_dance', label: '🐸 Pepe Groove', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHpqOTR6b2syMTBhcXR6dmR0N3JscXo1bGJpcW4ydm4zdnIzdGg2MiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/13Co8dof46T7Q2gU8H/giphy.gif' },
  { id: 'doge_much', label: '🐕 Such Doge', gif: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=200' },
  { id: 'troll_classic', label: '🤪 Problem?', gif: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHRwdmhobmRlMTlzNHN4dHpwMWoxMDk1dW10dm0xd2NoMDdqOWpucSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/E770vK1mB3v4FwXWbM/giphy.gif' }
];

export default function App() {
  // --- Client User State ---
  const [currentUser, setCurrentUser] = useState<DiscordUser | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingPhone, setOnboardingPhone] = useState('');
  const [onboardingAvatar, setOnboardingAvatar] = useState('🐱');
  const [onboardingColor, setOnboardingColor] = useState('bg-[#5865f2]');
  const [onboardingNitro, setOnboardingNitro] = useState(true);
  const [profileError, setProfileError] = useState('');

  // --- Settings Customizer ---
  const [showSettings, setShowSettings] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');
  const [editedAvatar, setEditedAvatar] = useState('🐱');
  const [editedColor, setEditedColor] = useState('bg-[#db2777]');
  const [editedStatusMessage, setEditedStatusMessage] = useState('');
  const [editedStatus, setEditedStatus] = useState<'online' | 'idle' | 'dnd'>('online');
  const [editedNitro, setEditedNitro] = useState(true);

  // --- Server Database Sync State ---
  const [discordState, setDiscordState] = useState<DiscordState>({
    servers: [],
    channels: [],
    messages: [],
    users: {},
    calls: []
  });

  // --- UI Layout Context ---
  const [activeServerId, setActiveServerId] = useState<string>('pub'); // 'home' or serverId
  const [activeChannelId, setActiveChannelId] = useState<string>('pub-general'); // channel ID
  const [activeTab, setActiveTab] = useState<'friends' | 'dialer'>('friends'); // home layout tab
  const [chatInput, setChatInput] = useState('');
  const [dialInput, setDialInput] = useState('');
  const [isStickerOpen, setIsStickerOpen] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(true);

  // --- Voice / Calling Audio State ---
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
  const [activeMicVolume, setActiveMicVolume] = useState<number>(0);
  const [isLocallyMuted, setIsLocallyMuted] = useState(false);
  const [isLocallyDeafened, setIsLocallyDeafened] = useState(false);
  const [micStateError, setMicStateError] = useState('');

  // --- Quick Server/Channel Modal triggers ---
  const [showCreateServer, setShowCreateServer] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerIcon, setNewServerIcon] = useState('🚀');

  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelType, setNewChannelType] = useState<'text' | 'voice'>('text');

  // --- Refs ---
  const messageEndRef = useRef<HTMLDivElement>(null);
  const audioCleanupRef = useRef<(() => void) | null>(null);
  const speechIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- 1. On Mount: Check User or Force Onboarding ---
  useEffect(() => {
    const savedUid = localStorage.getItem('discord_uid');
    const savedName = localStorage.getItem('discord_name');
    const savedPhone = localStorage.getItem('discord_phone');
    const savedAvatar = localStorage.getItem('discord_avatar');
    const savedColor = localStorage.getItem('discord_color');
    const savedNitro = localStorage.getItem('discord_nitro') !== 'false';

    if (savedUid && savedName) {
      const userObj: DiscordUser = {
        id: savedUid,
        name: savedName,
        phone: savedPhone || '',
        avatar: savedAvatar || '🐱',
        color: savedColor || 'bg-[#5865f2]',
        status: 'online',
        customStatus: 'Coding with AI Studio...',
        isNitro: savedNitro,
        voiceState: { serverId: null, channelId: null, isMuted: false, isDeafened: false, isSpeaking: false },
        lastSeen: Date.now()
      };
      setCurrentUser(userObj);
      registerUserOnServer(userObj);
    } else {
      // Set random initial onboarding values
      const randomId = 'usr-' + Math.random().toString(36).substring(2, 9);
      const randomColors = COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
      const randomAvatars = AVATAR_OPTIONS[Math.floor(Math.random() * AVATAR_OPTIONS.length)].emoji;
      
      localStorage.setItem('discord_uid', randomId);
      setOnboardingAvatar(randomAvatars);
      setOnboardingColor(randomColors);
      setShowOnboarding(true);
    }
  }, []);

  // Set up forms on edit profile load
  useEffect(() => {
    if (currentUser) {
      setEditedName(currentUser.name);
      setEditedPhone(currentUser.phone);
      setEditedAvatar(currentUser.avatar);
      setEditedColor(currentUser.color);
      setEditedStatusMessage(currentUser.customStatus);
      setEditedNitro(currentUser.isNitro);
    }
  }, [currentUser, showSettings]);

  // --- 2. Live Server Sync using Server-Sent Events (SSE) ---
  useEffect(() => {
    const sse = new EventSource('/api/sse');

    sse.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === 'state') {
          setDiscordState(payload.state);
        }
      } catch (err) {
        console.error('Failed to parse active real-time sse message:', err);
      }
    };

    sse.onerror = () => {
      console.warn('Real-time connection interrupted. Automatically reconnecting...');
    };

    return () => {
      sse.close();
    };
  }, []);

  // --- 3. Heartbeat Loop to keep status active in members list ---
  useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      fetch('/api/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentUser.id })
      }).catch(err => console.error('Heartbeat check-in failed:', err));
    }, 15000);

    return () => clearInterval(interval);
  }, [currentUser]);

  // --- 4. Auto scroll chat feed to bottom on new messages ---
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [discordState.messages, activeChannelId]);

  // --- 5. MICROPHONE SPEECH DETECTION ---
  // If the user joins a voice channel or is connected on a Direct Voice Call, track voice amplitude!
  useEffect(() => {
    const currentVoiceState = currentUser ? discordState.users[currentUser.id]?.voiceState : null;
    const isVoiceJoined = currentVoiceState && currentVoiceState.channelId !== null;

    if (isVoiceJoined && !isLocallyMuted && !isLocallyDeafened) {
      // Stop simulated speaking simulator if any
      if (speechIntervalRef.current) clearInterval(speechIntervalRef.current);

      // Access real microphone
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          setMicStream(stream);
          setMicStateError('');

          // Start WebAudio analyzer
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          let prevSpeaking = false;
          let quietFramesCount = 0;

          const monitor = () => {
            if (!analyser) return;
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const avgVolume = sum / dataArray.length;
            setActiveMicVolume(avgVolume);

            // Speaking threshold
            const isSpeakingNow = avgVolume > 8;

            if (isSpeakingNow) {
              quietFramesCount = 0;
              if (!prevSpeaking) {
                prevSpeaking = true;
                updateVoiceSpeakingState(true);
              }
            } else {
              quietFramesCount++;
              // debounce turning off speaking to prevent rapid pulsing on word boundaries
              if (quietFramesCount > 30 && prevSpeaking) {
                prevSpeaking = false;
                updateVoiceSpeakingState(false);
              }
            }

            audioCleanupRef.current = () => {
              try {
                audioContext.close();
                stream.getTracks().forEach(track => track.stop());
              } catch (e) {}
            };

            if (stream.active) {
              requestAnimationFrame(monitor);
            }
          };

          monitor();
        })
        .catch((err) => {
          console.warn('Microphone permission denied / not available:', err);
          setMicStateError('Permission denied. Simulating voices.');
          startVoiceSpeakingSimulation();
        });
    } else {
      // Inactive, do cleanups
      cleanupMediaDevices();
    }

    return () => {
      cleanupMediaDevices();
    };
  }, [
    currentUser,
    discordState.users[currentUser?.id || '']?.voiceState?.channelId,
    isLocallyMuted,
    isLocallyDeafened
  ]);

  const cleanupMediaDevices = () => {
    if (audioCleanupRef.current) {
      audioCleanupRef.current();
      audioCleanupRef.current = null;
    }
    if (speechIntervalRef.current) {
      clearInterval(speechIntervalRef.current);
      speechIntervalRef.current = null;
    }
    setActiveMicVolume(0);
    setMicStream(null);
    if (currentUser) {
      updateVoiceSpeakingState(false);
    }
  };

  // Speaks simulator if microphone isn't available
  const startVoiceSpeakingSimulation = () => {
    if (!currentUser) return;
    let speaking = false;
    speechIntervalRef.current = setInterval(() => {
      speaking = Math.random() > 0.65;
      updateVoiceSpeakingState(speaking);
      setActiveMicVolume(speaking ? Math.floor(Math.random() * 25) + 10 : 0);
    }, 1800);
  };

  const updateVoiceSpeakingState = (isSpeaking: boolean) => {
    if (!currentUser) return;
    const dbUser = discordState.users[currentUser.id];
    if (dbUser?.voiceState?.isSpeaking !== isSpeaking) {
      fetch('/api/voice/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          isSpeaking
        })
      }).catch(() => {});
    }
  };

  // --- API Sync Triggers ---

  const registerUserOnServer = async (userObj: DiscordUser) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userObj)
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data.user);
        setShowOnboarding(false);
        setProfileError('');
      } else {
        setProfileError(data.error || 'Server registration failure.');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      setProfileError('Network communication error with server backend.');
    }
  };

  const handleCreateOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardingName.trim()) {
      setProfileError('Please enter a nickname first!');
      return;
    }

    const savedUid = localStorage.getItem('discord_uid') || 'usr-' + Math.random().toString(36).substring(2, 9);
    localStorage.setItem('discord_uid', savedUid);
    localStorage.setItem('discord_name', onboardingName.trim());
    localStorage.setItem('discord_phone', onboardingPhone.trim());
    localStorage.setItem('discord_avatar', onboardingAvatar);
    localStorage.setItem('discord_color', onboardingColor);
    localStorage.setItem('discord_nitro', String(onboardingNitro));

    const userObj: DiscordUser = {
      id: savedUid,
      name: onboardingName.trim(),
      phone: onboardingPhone.trim(),
      avatar: onboardingAvatar,
      color: onboardingColor,
      status: 'online',
      customStatus: 'Joined direct via AI Web App!',
      isNitro: onboardingNitro,
      voiceState: { serverId: null, channelId: null, isMuted: false, isDeafened: false, isSpeaking: false },
      lastSeen: Date.now()
    };
    registerUserOnServer(userObj);
  };

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    if (!editedName.trim()) {
      alert('Nickname can not be blank.');
      return;
    }

    localStorage.setItem('discord_name', editedName.trim());
    localStorage.setItem('discord_phone', editedPhone.trim());
    localStorage.setItem('discord_avatar', editedAvatar);
    localStorage.setItem('discord_color', editedColor);
    localStorage.setItem('discord_nitro', String(editedNitro));

    const updated: DiscordUser = {
      ...currentUser,
      name: editedName.trim(),
      phone: editedPhone.trim(),
      avatar: editedAvatar,
      color: editedColor,
      isNitro: editedNitro,
      customStatus: editedStatusMessage,
      status: editedStatus
    };

    registerUserOnServer(updated);
    setShowSettings(false);
  };

  // Create channel trigger
  const handleCreateChannelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim() || activeServerId === 'home') return;

    try {
      const res = await fetch('/api/channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverId: activeServerId,
          name: newChannelName.trim(),
          type: newChannelType
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveChannelId(data.channel.id);
        setShowCreateChannel(false);
        setNewChannelName('');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create server trigger
  const handleCreateServerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName.trim() || !currentUser) return;

    try {
      const res = await fetch('/api/server', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newServerName.trim(),
          icon: newServerIcon,
          ownerId: currentUser.id
        })
      });
      const data = await res.json();
      if (res.ok) {
        setActiveServerId(data.server.id);
        setActiveChannelId(data.defaultChannelId);
        setShowCreateServer(false);
        setNewServerName('');
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post dynamic message (or Nitro Stickers!)
  const handleSendMessage = async (textOverload?: string, stickerId?: string) => {
    if (!currentUser || activeServerId === 'home') return;
    const bodyText = textOverload !== undefined ? textOverload : chatInput;
    if (!bodyText.trim() && !stickerId) return;

    try {
      await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId: activeChannelId,
          userId: currentUser.id,
          text: bodyText,
          sticker: stickerId
        })
      });
      if (textOverload === undefined) {
        setChatInput('');
      }
      setIsStickerOpen(false);
    } catch (err) {
      console.error('Failed to post message:', err);
    }
  };

  // Join a active voice channel
  const handleJoinVoiceChannel = async (channel: DiscordChannel) => {
    if (!currentUser) return;

    try {
      await fetch('/api/voice/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          serverId: channel.serverId,
          channelId: channel.id
        })
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Disconnect voice stream
  const handleDisconnectVoice = async () => {
    if (!currentUser) return;
    try {
      await fetch('/api/voice/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });
      cleanupMediaDevices();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle mic mute/deafen
  const handleToggleMute = async () => {
    if (!currentUser) return;
    const targetMute = !isLocallyMuted;
    setIsLocallyMuted(targetMute);

    try {
      await fetch('/api/voice/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          isMuted: targetMute
        })
      });
    } catch (err) {}
  };

  const handleToggleDeafen = async () => {
    if (!currentUser) return;
    const targetDeaf = !isLocallyDeafened;
    setIsLocallyDeafened(targetDeaf);

    try {
      await fetch('/api/voice/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          isDeafened: targetDeaf
        })
      });
    } catch (err) {}
  };

  // DIAL Direct Call by linked mobile/verification phone numbers!
  const handleDialCall = async (phoneToDial?: string) => {
    if (!currentUser) return;
    const tarPhone = phoneToDial || dialInput;
    if (!tarPhone.trim()) {
      alert('Please enter a registered phone number to dial!');
      return;
    }

    try {
      const res = await fetch('/api/call/dial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callerId: currentUser.id,
          targetPhone: tarPhone
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
      } else {
        setDialInput('');
        // Automatically switch page context to Home DMs list
        setActiveServerId('home');
        setActiveTab('dialer');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Respond to Call Invitation accept/decline
  const handleCallInvitationResponse = async (callId: string, action: 'accept' | 'decline') => {
    try {
      await fetch('/api/call/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId, action })
      });
      if (action === 'accept') {
        setActiveServerId('home');
        setActiveTab('dialer');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Hang-up active direct calling
  const handleHangupCall = async (callId: string) => {
    try {
      await fetch('/api/call/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callId })
      });
      cleanupMediaDevices();
    } catch (err) {
      console.error(err);
    }
  };

  // --- Dynamic Layout Math Resolvers ---

  // Identify if there's any active call ringing incoming to current user and registered phone!
  const incomingCallObj = currentUser
    ? discordState.calls.find(c => c.receiverId === currentUser.id && c.status === 'ringing')
    : null;

  // Identify any ongoing connected call the current user is part of
  const activeCallObj = currentUser
    ? discordState.calls.find(c => (c.callerId === currentUser.id || c.receiverId === currentUser.id) && (c.status === 'connected' || c.status === 'ringing'))
    : null;

  // Active voice state details
  const myVoiceState = currentUser ? discordState.users[currentUser.id]?.voiceState : null;
  const isJoinedInAnyVoice = myVoiceState && myVoiceState.channelId !== null;

  // Resolve matching Server Name strings
  const currentActiveServer = discordState.servers.find(s => s.id === activeServerId);

  // Group text/voice channels dynamically for sidebar display in active servers
  const serverTextChannels = discordState.channels.filter(c => c.serverId === activeServerId && c.type === 'text');
  const serverVoiceChannels = discordState.channels.filter(c => c.serverId === activeServerId && c.type === 'voice');

  // Query Messages matching only active selected channel index text area
  const matchedChannelMessages = discordState.messages.filter(m => m.channelId === activeChannelId);

  // List of active directory members in current server
  const resolveServerMembersList = () => {
    return Object.values(discordState.users) as DiscordUser[];
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#313338] text-gray-200 font-sans select-none antialiased" id="discord-app-root">
      
      {/* ================= 1. LEFT SERVER RAIL BAR (72px) ================= */}
      <div className="flex flex-col items-center py-3 w-[72px] bg-[#1e1f22] flex-shrink-0 gap-2 overflow-y-auto" id="server-rail-column">
        {/* Discord Home/DM hub badge */}
        <div className="relative group flex items-center justify-center w-full" id="home-navigation-button">
          {/* Active Side slider mark */}
          <div className={`absolute left-0 w-1 bg-white rounded-r-md transition-all duration-200 ${
            activeServerId === 'home' ? 'h-10' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'
          }`} />
          {/* Circular logo */}
          <button
            onClick={() => {
              setActiveServerId('home');
              setActiveTab('friends');
            }}
            className={`flex items-center justify-center w-12 h-12 rounded-[24px] hover:rounded-[16px] transition-all duration-200 ${
              activeServerId === 'home' ? 'bg-[#5865f2] text-white rounded-[16px]' : 'bg-[#313338] text-gray-300 hover:bg-[#5865f2] hover:text-white'
            }`}
            title="DM & Home Dialer Hub"
          >
            <MessageSquare className="w-6 h-6 animate-pulse" />
          </button>
        </div>

        {/* Separator line */}
        <div className="w-8 h-[2px] bg-[#35363c] rounded my-1" />

        {/* Server List */}
        {discordState.servers.map((server) => {
          const isActive = activeServerId === server.id;
          return (
            <div key={server.id} className="relative group flex items-center justify-center w-full" id={`server-badge-${server.id}`}>
              <div className={`absolute left-0 w-1 bg-white rounded-r-md transition-all duration-200 ${
                isActive ? 'h-10' : 'h-2 group-hover:h-5 opacity-0 group-hover:opacity-100'
              }`} />
              <button
                onClick={() => {
                  setActiveServerId(server.id);
                  // Auto redirect default text channel if existing
                  const defaultCh = discordState.channels.find(c => c.serverId === server.id && c.type === 'text');
                  if (defaultCh) {
                    setActiveChannelId(defaultCh.id);
                  }
                }}
                className={`flex items-center justify-center w-12 h-12 text-lg font-bold font-mono transition-all duration-200 rounded-[24px] hover:rounded-[16px] cursor-pointer ${
                  isActive
                    ? 'bg-[#5865f2] text-white rounded-[16px]'
                    : 'bg-[#313338] text-gray-200 hover:bg-[#5865f2] hover:text-white'
                }`}
                title={server.name}
              >
                {server.icon}
              </button>
            </div>
          );
        })}

        {/* Add new custom server circular button */}
        <button
          onClick={() => setShowCreateServer(true)}
          className="flex items-center justify-center w-12 h-12 rounded-[24px] hover:rounded-[16px] bg-[#313338] text-emerald-500 hover:bg-emerald-500 hover:text-white cursor-pointer transition-all duration-200 group mt-1"
          title="Create custom Server"
          id="btn-create-server"
        >
          <Plus className="w-6 h-6 transition-transform group-hover:rotate-90" />
        </button>
      </div>

      {/* ================= 2. SIDEBAR TWO: CHANNELS & CONTROLS (240px) ================= */}
      <div className="flex flex-col w-[240px] bg-[#2b2d31] flex-shrink-0 justify-between select-none" id="channel-list-column">
        
        {/* --- Sidebar Channel list area --- */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {activeServerId !== 'home' ? (
            // --- SERVER CHANNEL LIST LAYOUT ---
            <>
              {/* Server Title Header */}
              <div className="flex items-center justify-between h-12 px-4 border-b border-[#1f2023] shadow-sm select-none">
                <span className="font-bold text-gray-100 truncate tracking-tight">{currentActiveServer?.name || 'Discord server'}</span>
                <span className="text-xs text-discord-blurple font-semibold bg-discord-blurple/10 px-1.5 py-0.5 rounded cursor-help" title="Nitro Perks Active">LVL 3 ✦</span>
              </div>

              {/* Text Channels Category */}
              <div className="px-2 mt-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-400 px-2 select-none uppercase tracking-wider">
                  <span>Text Channels</span>
                  <button
                    onClick={() => {
                      setNewChannelType('text');
                      setShowCreateChannel(true);
                    }}
                    className="hover:text-gray-200 cursor-pointer p-0.5 rounded"
                    title="Add Text Channel"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-col gap-[2px] mt-1">
                  {serverTextChannels.map((channel) => {
                    const isChanActive = activeChannelId === channel.id;
                    return (
                      <button
                        key={channel.id}
                        onClick={() => setActiveChannelId(channel.id)}
                        className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-sm w-full font-medium transition-colors text-left truncate cursor-pointer ${
                          isChanActive
                            ? 'bg-[#35373c] text-white'
                            : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                        }`}
                      >
                        <Hash className="w-4 h-4 opacity-70" />
                        <span className="truncate">{channel.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Voice Channels Category */}
              <div className="px-2 mt-6">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-400 px-2 select-none uppercase tracking-wider">
                  <span>Voice Channels</span>
                  <button
                    onClick={() => {
                      setNewChannelType('voice');
                      setShowCreateChannel(true);
                    }}
                    className="hover:text-gray-200 cursor-pointer p-0.5 rounded"
                    title="Add Voice Channel"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-[2px] mt-1">
                  {serverVoiceChannels.map((channel) => {
                    const isVoiceJoinedHere = myVoiceState?.channelId === channel.id;
                    return (
                      <div key={channel.id} className="flex flex-col">
                        <button
                          onClick={() => handleJoinVoiceChannel(channel)}
                          className={`flex items-center justify-between px-2 py-1.5 rounded text-sm w-full font-medium transition-colors text-left cursor-pointer ${
                            isVoiceJoinedHere
                              ? 'bg-discord-green/20 text-discord-green'
                              : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Volume2 className="w-4 h-4 opacity-70 flex-shrink-0" />
                            <span className="truncate">{channel.name}</span>
                          </div>
                          {isVoiceJoinedHere && (
                            <span className="text-[10px] bg-discord-green/20 border border-discord-green/30 px-1 rounded animate-pulse text-white">Active</span>
                          )}
                        </button>

                        {/* List members actively connected to this voiceroom */}
                        <div className="flex flex-col pl-6 mt-0.5 gap-1 select-none">
                          {(Object.values(discordState.users) as DiscordUser[])
                            .filter(u => u.voiceState?.channelId === channel.id)
                            .map(u => (
                              <div key={u.id} className="flex items-center gap-1.5 py-0.5 text-xs">
                                <div className="relative">
                                  <div className={`flex items-center justify-center w-5 h-5 rounded-full ${u.color} text-[10px] text-white font-bold relative ${
                                    u.voiceState?.isSpeaking && !u.voiceState?.isMuted ? 'ring-2 ring-emerald-500 animate-ring-pulse scale-105' : ''
                                  }`}>
                                    {u.avatar}
                                  </div>
                                  <div className={`absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 border-2 border-[#2b2d31] rounded-full ${
                                    u.status === 'online' ? 'bg-[#23a55a]' : u.status === 'idle' ? 'bg-[#f0b232]' : 'bg-[#f23f43]'
                                  }`} />
                                </div>
                                <span className={`truncate text-gray-300 ${u.voiceState?.isSpeaking ? 'text-emerald-400 font-medium' : ''}`}>
                                  {u.name}
                                </span>
                                {u.voiceState?.isMuted && <MicOff className="w-3 h-3 text-rose-400 flex-shrink-0" />}
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            // --- DM / HOME PANEL SIDEBAR ---
            <>
              <div className="flex items-center justify-between h-12 px-4 border-b border-[#1f2023] shadow-sm select-none">
                <span className="font-bold text-gray-100 truncate flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5865f2] animate-ping" />
                  Direct DM Dashboard
                </span>
              </div>

              {/* DM Menu Navigation lists */}
              <div className="p-2 flex flex-col gap-0.5 mt-2">
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium w-full text-left transition-colors cursor-pointer ${
                    activeTab === 'friends' ? 'bg-[#35373c] text-white' : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-300'
                  }`}
                >
                  <Users className="w-4 h-4 flex-shrink-0" />
                  <span>Interactive Directory</span>
                </button>

                <button
                  onClick={() => setActiveTab('dialer')}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium w-full text-left transition-colors cursor-pointer relative ${
                    activeTab === 'dialer' ? 'bg-[#35373c] text-white' : 'text-gray-400 hover:bg-[#35373c]/50 hover:text-gray-200'
                  }`}
                  id="tab-btn-dialer"
                >
                  <PhoneCall className="w-4 h-4 flex-shrink-0 text-amber-500 animate-bounce" />
                  <span>Direct Dial (Phone calls)</span>
                  {activeCallObj && (
                    <span className="absolute right-2 top-2.5 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </button>
              </div>

              {/* Direct Messages title */}
              <div className="px-2 mt-4">
                <div className="text-xs font-semibold text-gray-400 px-3 uppercase tracking-wider mb-2">
                  Linked Phone Lines
                </div>
                
                {/* Active user accounts list containing phone registrations */}
                <div className="flex flex-col gap-[2px] mt-1 p-1">
                  {(Object.values(discordState.users) as DiscordUser[])
                    .filter(u => u.id !== currentUser?.id)
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-2 rounded hover:bg-[#35373c]/30 text-sm group transition-all"
                      >
                        <div className="flex items-center gap-2 max-w-[130px] truncate">
                          <div className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold text-white relative ${user.color}`}>
                            {user.avatar}
                          </div>
                          <div className="flex flex-col truncate">
                            <span className="font-semibold text-gray-200 truncate">{user.name}</span>
                            <span className="text-[10px] text-gray-400 truncate tracking-tight">{user.phone ? `📞 ${user.phone}` : 'No phone verified'}</span>
                          </div>
                        </div>

                        {user.phone ? (
                          <button
                            onClick={() => handleDialCall(user.phone)}
                            className="p-1 px-1.5 rounded-md bg-discord-green/20 hover:bg-discord-green text-white hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer opacity-80 hover:opacity-100"
                            title="Call user direct line"
                          >
                            <Phone className="w-3.5 h-3.5 animate-pulse" />
                            <span>Dial</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-500 font-semibold italic bg-neutral-800/40 p-1 rounded">Locked</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* --- 2B. COMPACT VOICE CONTAINER FOOTER (If in voice room/call) --- */}
        {isJoinedInAnyVoice && (
          <div className="flex flex-col p-3 bg-[#232428] border-b border-[#111214] gap-2 select-none" id="connected-voice-footer">
            <div className="flex items-center justify-between">
              <div className="flex flex-col max-w-[120px] truncate">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 truncate">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Voice Connected
                </div>
                <span className="text-[11px] text-gray-400 truncate italic">
                  {discordState.channels.find(c => c.id === myVoiceState?.channelId)?.name || 'Direct Call Session'}
                </span>
              </div>

              {/* Signal details */}
              <div className="flex items-center gap-1">
                <span className="text-[10px] px-1 bg-discord-blurple/20 rounded font-semibold text-discord-blurple animate-pulse">99ms</span>
                <button
                  onClick={handleDisconnectVoice}
                  className="p-1.5 rounded bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors cursor-pointer"
                  title="Disconnect stream channel"
                  id="btn-disconnect-voice"
                >
                  <PhoneOff className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Speaking dB analyzer bar */}
            {micStream ? (
              <div className="flex items-center justify-between bg-black/30 p-1.5 rounded-lg border border-emerald-500/10">
                <span className="text-[9px] font-mono text-emerald-400">Mic Analyzer:</span>
                <div className="flex items-center h-2.5">
                  <div className="speaking-wave-bar" style={{ height: `${Math.min(activeMicVolume * 1.5, 20)}px` }} />
                  <div className="speaking-wave-bar" style={{ height: `${Math.min(activeMicVolume * 0.9, 16)}px` }} />
                  <div className="speaking-wave-bar" style={{ height: `${Math.min(activeMicVolume * 1.8, 22)}px` }} />
                  <div className="speaking-wave-bar" style={{ height: `${Math.min(activeMicVolume * 1.1, 14)}px` }} />
                </div>
              </div>
            ) : (
              <div className="text-[10px] text-yellow-400 italic bg-amber-500/5 p-1 rounded-md text-center">
                {micStateError || 'Muted or simulated mic state'}
              </div>
            )}
          </div>
        )}

        {/* --- 2C. PRIMARY USER DETAILS FOOTER (Exactly matching Discord footer) --- */}
        {currentUser && (
          <div className="flex items-center justify-between bg-[#232428] h-[52px] px-2 border-t border-[#1a1b1a] select-none" id="user-details-footer">
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1.5 hover:bg-[#35373c]/50 p-1 rounded-md transition-all truncate text-left max-w-[130px] pr-2 cursor-pointer relative group"
              title="Click to change profile settings"
            >
              {/* Colored emoji avatar */}
              <div className="relative">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-lg font-bold text-white relative ${currentUser.isNitro ? 'ring-2 ring-violet-500 ring-offset-1 ring-offset-neutral-900 shadow-md shadow-violet-500/20' : ''} ${currentUser.color}`}>
                  {currentUser.avatar}
                </div>
                {/* Status Dot */}
                <span className="absolute bottom-[-1px] right-[-1px] flex h-3 w-3 rounded-full border border-black bg-[#23a55a]" />
              </div>
              
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-white truncate flex items-center gap-1">
                  {currentUser.name}
                  {currentUser.isNitro && <Sparkles className="w-3 h-3 text-violet-400 animate-pulse flex-shrink-0" />}
                </span>
                <span className="text-[9px] text-gray-400 truncate tracking-tight">{currentUser.phone ? `📞 ${currentUser.phone}` : 'No phone'}</span>
              </div>
            </button>

            {/* Quick Actions Buttons */}
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleToggleMute}
                className={`p-2 rounded hover:bg-[#35373c] transition-colors cursor-pointer ${isLocallyMuted ? 'text-rose-500' : 'text-gray-400 hover:text-gray-200'}`}
                title={isLocallyMuted ? 'Unmute microphone' : 'Mute microphone'}
              >
                {isLocallyMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={handleToggleDeafen}
                className={`p-2 rounded hover:bg-[#35373c] transition-colors cursor-pointer ${isLocallyDeafened ? 'text-rose-500' : 'text-gray-400 hover:text-gray-200'}`}
                title={isLocallyDeafened ? 'Undeafen headphones' : 'Deafen headphones'}
              >
                <Headphones className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 rounded hover:bg-[#35373c] text-gray-400 hover:text-gray-200 cursor-pointer"
                title="Discord user parameters settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. CENTER PANEL: CHAT LIST OR DIRECT DIAL AREA ================= */}
      <div className="flex flex-col flex-1 bg-[#313338] overflow-hidden" id="workspace-center-panel">
        
        {/* If user is currently in a direct call or text/voice channels we can expand the rendering */}
        {activeServerId !== 'home' ? (
          // ================= TEXT / VOICE CHAT INTERFACES FOR ACTIVE SERVER =================
          <>
            {/* Server chat header bar */}
            <div className="flex items-center justify-between h-12 px-4 border-b border-[#1f2023] shadow-sm flex-shrink-0">
              <div className="flex items-center gap-2">
                <Hash className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <span className="font-bold text-white tracking-wide">
                  {discordState.channels.find(c => c.id === activeChannelId)?.name || 'choose-room'}
                </span>
                <div className="h-4 w-[1px] bg-neutral-700/80 mx-2" />
                <p className="text-xs text-gray-400 truncate max-w-[200px] hover:text-gray-200 cursor-crosshair">
                  ⚡ Auto-synced server latency with 100% free Nitro Stickers active!
                </p>
              </div>

              {/* Members search or panel toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMemberListOpen(!isMemberListOpen)}
                  className={`p-2 rounded hover:bg-[#35373c]/80 transition-colors cursor-pointer ${isMemberListOpen ? 'text-discord-blurple' : 'text-gray-400'}`}
                  title="Toggle Members roster"
                >
                  <Users className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dynamic Active voice preview component at topmost in chat Area */}
            {isJoinedInAnyVoice && myVoiceState && discordState.channels.find(c => c.id === myVoiceState.channelId)?.serverId === activeServerId && (
              <div className="flex flex-col p-4 bg-[#1e1f22]/90 border-b border-[#111214] select-none gap-3" id="active-server-voice-grid">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 tracking-wide flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 bg-emerald-500 rounded-full animate-ping" />
                    LIVE AUDIO STREAM: <span className="text-white">{discordState.channels.find(c => c.id === myVoiceState.channelId)?.name}</span>
                  </p>
                  <span className="text-[10px] text-gray-500 italic">Connected users speaking glows with emerald outline rings!</span>
                </div>

                {/* Grid list of speaking cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(Object.values(discordState.users) as DiscordUser[])
                    .filter(u => u.voiceState?.channelId === myVoiceState.channelId)
                    .map((voipUser) => (
                      <div
                        key={voipUser.id}
                        className={`flex flex-col items-center justify-center p-4 bg-[#2b2d31] rounded-lg transition-all relative ${
                          voipUser.voiceState?.isSpeaking && !voipUser.voiceState?.isMuted ? 'ring-2 ring-emerald-500 shadow-md shadow-emerald-500/10' : 'border border-neutral-700/50'
                        }`}
                      >
                        <div className="relative">
                          <div className={`flex items-center justify-center w-14 h-14 rounded-full text-3xl font-bold text-white relative transition-all ${
                            voipUser.voiceState?.isSpeaking && !voipUser.voiceState?.isMuted ? 'ring-4 ring-emerald-500 animate-ring-pulse scale-105 shadow-xl shadow-emerald-500/30' : ''
                          } ${voipUser.color}`}>
                            {voipUser.avatar}
                          </div>
                          {/* Speak state absolute indicator */}
                          {voipUser.voiceState?.isSpeaking && !voipUser.voiceState?.isMuted && (
                            <span className="absolute top-0 right-0 bg-emerald-500 text-white rounded-full p-0.5 shadow-md border-2 border-slate-900">
                              <Volume2 className="w-3 h-3 animate-bounce" />
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col items-center mt-2.5 max-w-full">
                          <span className="font-bold text-sm text-gray-200 truncate max-w-full flex items-center gap-1">
                            {voipUser.name}
                            {voipUser.id === currentUser?.id && <span className="text-[9px] bg-neutral-800 text-gray-400 px-1 py-0.5 rounded">You</span>}
                          </span>
                          <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-full italic">
                            {voipUser.voiceState?.isSpeaking ? 'Speaking...' : voipUser.voiceState?.isMuted ? 'Muted' : 'Connected'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* --- PRIMARY CHAT MESSAGES STREAM DISPLAY --- */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4" id="chat-messages-container">
              {matchedChannelMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-70">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#5865f2]/10 mb-3 text-discord-blurple">
                    <MessageSquare className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-white text-base">This is the start of the #{discordState.channels.find(c => c.id === activeChannelId)?.name} channel!</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-[320px]">Choose a Nitro sticker or post a greeting message to start chatting with other users!</p>
                </div>
              ) : (
                matchedChannelMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-4 hover:bg-[#35373c]/30 p-2 py-1 rounded transition-colors group">
                    {/* Message profile picture */}
                    <div className="relative flex-shrink-0">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full text-xl font-bold text-white ${msg.color}`}>
                        {msg.userAvatar}
                      </div>
                      {msg.isNitro && (
                        <div className="absolute top-[-3px] right-[-3px] bg-violet-600 text-white rounded-full p-0.5 text-[8px] border border-[#2b2d31]" title="Discord Nitro Supporter">
                          💎
                        </div>
                      )}
                    </div>

                    {/* Message Details */}
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-white hover:underline cursor-pointer text-sm">{msg.userName}</span>
                        {msg.userId === 'system' && (
                          <span className="bg-discord-blurple/25 text-discord-blurple text-[9px] font-bold px-1.5 py-0.2 rounded uppercase border border-discord-blurple/20">SYSTEM BOT</span>
                        )}
                        {msg.isNitro && (
                          <span className="text-[10px] text-violet-400 font-bold bg-violet-500/15 px-1 py-0.1 rounded">Nitro</span>
                        )}
                        <span className="text-[10px] text-gray-400 font-mono select-all">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Msg Body text */}
                      {msg.text && (
                        <p className="text-gray-300 text-sm mt-1 leading-relaxed select-text whitespace-pre-wrap break-words">{msg.text}</p>
                      )}

                      {/* Nitro Sticker attachments if existing */}
                      {msg.sticker && (
                        <div className="mt-2 p-2 bg-[#2b2d31]/50 border border-neutral-700/60 rounded-xl max-w-[170px] flex flex-col items-center">
                          <img
                            src={NITRO_STICKERS.find(s => s.id === msg.sticker)?.gif || ''}
                            alt="Nitro Sticker"
                            className="w-24 h-24 object-contain rounded hover:scale-110 transition-transform cursor-pointer"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-[10px] text-violet-400 font-semibold mt-1 bg-violet-900/30 px-1.5 py-0.5 rounded border border-violet-500/20 uppercase tracking-wider animate-pulse flex items-center gap-1">
                            💎 Nitro Sticker
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {/* Anchor to scroll */}
              <div ref={messageEndRef} />
            </div>

            {/* --- MESSAGE EDIT/CHAT INPUT BAR PANEL --- */}
            <div className="p-4 bg-[#313338] flex-shrink-0 relative">
              
              {/* Emojis stickers drawer popover */}
              {isStickerOpen && (
                <div className="absolute bottom-16 left-6 w-[320px] bg-[#232428] border border-neutral-700 rounded-xl shadow-2xl p-4 flex flex-col z-50 animate-fade-in" id="nitro-stickers-popover">
                  <div className="flex items-center justify-between border-b border-neutral-700 pb-2 mb-3">
                    <span className="font-bold text-xs text-violet-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-violet-400 animate-spin" />
                      Free Nitro Sticker Pack
                    </span>
                    <button onClick={() => setIsStickerOpen(false)} className="text-gray-400 hover:text-gray-200">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
                    Discord clone bypass active! All special animated stickers and emojis represent high-definition Nitro files. Just click a sticker to post it!
                  </p>

                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto p-1">
                    {NITRO_STICKERS.map((sticker) => (
                      <button
                        key={sticker.id}
                        type="button"
                        onClick={() => handleSendMessage('', sticker.id)}
                        className="flex flex-col items-center p-2 bg-[#2b2d31] hover:bg-violet-950/40 border hover:border-violet-500/40 rounded-lg group transition-all"
                      >
                        <img
                          src={sticker.gif}
                          alt={sticker.label}
                          className="w-14 h-14 object-contain group-hover:scale-115 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[10px] font-semibold text-gray-300 mt-1.5">{sticker.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form container */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center bg-[#383a40] rounded-lg px-4 h-11 shadow-md gap-3 relative"
              >
                {/* Nitro Stickers expand button */}
                <button
                  type="button"
                  onClick={() => setIsStickerOpen(!isStickerOpen)}
                  className="text-gray-400 hover:text-violet-400 transition-colors cursor-pointer"
                  title="Nitro Stickers & Emojis Drawer"
                >
                  <SmilePlus className="w-6 h-6 animate-pulse text-violet-400" />
                </button>

                {/* Input Text Box */}
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Message #${discordState.channels.find(c => c.id === activeChannelId)?.name || 'channel'}`}
                  className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder-gray-500 select-text"
                />

                {/* Submit Send Button */}
                <button
                  type="submit"
                  className="text-gray-400 hover:text-[#5865f2] cursor-pointer transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          // ================= DM & DIALING DASHBOARD FOR Direct Call Tab =================
          <div className="flex-grow overflow-y-auto p-6 flex flex-col max-w-5xl mx-auto w-full select-none" id="dm-dashboard-main">
            
            {activeTab === 'friends' ? (
              // --- INTERACTIVE DIRECTORY ---
              <div className="flex flex-col gap-6" id="friends-list-container">
                <div className="bg-[#2b2d31] p-5 rounded-xl border border-neutral-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-5 h-5 text-violet-400 animate-spin" />
                      Dynamic User Directory
                    </h2>
                    <p className="text-xs text-gray-400 max-w-[480px]">
                      Ask another caller/friend to register on this Discord Clone! You can call each other directly using the **Direct Dial Pad** or texting inside public communities!
                    </p>
                  </div>
                  {/* Status Overview cards */}
                  <div className="flex items-center gap-2 text-xs font-semibold bg-neutral-800 p-2.5 rounded-lg border border-neutral-700">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Active Server Nodes: {Object.keys(discordState.users).length} Users Online</span>
                  </div>
                </div>

                {/* Grid List of registered users */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Object.values(discordState.users) as DiscordUser[]).map((user) => (
                    <div
                      key={user.id}
                      className="bg-[#2b2d31] p-4 rounded-xl border border-neutral-700/50 flex flex-col justify-between hover:border-discord-blurple/50 transition-all shadow hover:shadow-lg group"
                    >
                      <div className="flex items-start gap-3">
                        {/* Colored circular avatar */}
                        <div className="relative">
                          <div className={`flex items-center justify-center w-11 h-11 rounded-full text-2xl font-bold text-white relative ${user.isNitro ? 'ring-2 ring-violet-500 ring-offset-1 ring-offset-neutral-900 shadow-xl' : ''} ${user.color}`}>
                            {user.avatar}
                          </div>
                          {/* Rich online status dots */}
                          <span className={`absolute bottom-[-1px] right-[-1px] flex h-3 w-3 rounded-full border border-black ${
                            user.status === 'online' ? 'bg-[#23a55a]' : user.status === 'idle' ? 'bg-[#f0b232]' : 'bg-[#f23f43]'
                          }`} />
                        </div>

                        <div className="flex flex-col truncate">
                          <span className="font-bold text-sm text-gray-100 flex items-center gap-1 truncate">
                            {user.name}
                            {user.isNitro && <span className="bg-violet-900/30 text-violet-400 text-[8px] font-extrabold px-1 py-0.2 rounded select-none">NITRO</span>}
                          </span>
                          <span className="text-[11px] text-gray-400 italic truncate mt-0.5">{user.customStatus || 'Free text placeholder...'}</span>
                          <span className="text-[10px] text-discord-blurple font-semibold font-mono mt-1 select-all hover:underline truncate">
                            {user.phone ? `Verified: ${user.phone}` : 'No phone linked'}
                          </span>
                        </div>
                      </div>

                      {/* Quick Call Action bar */}
                      <div className="border-t border-neutral-700/50 mt-4 pt-3 flex items-center justify-between gap-2.5">
                        <span className="text-[9px] text-gray-500 font-medium">Joined {new Date(user.lastSeen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {user.id !== currentUser?.id && user.phone ? (
                          <button
                            onClick={() => handleDialCall(user.phone)}
                            className="p-1 px-3 rounded-md bg-discord-green text-white hover:bg-emerald-600 transition-colors text-xs font-bold flex items-center gap-1 shadow cursor-pointer"
                            id={`btn-call-user-${user.id}`}
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call</span>
                          </button>
                        ) : (
                          <span className="text-[9px] font-semibold text-gray-500 bg-neutral-800 p-1 px-2 rounded italic">Unavailable</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // --- COMPLETE TELEPHONE DIAL PAD KEYPAD SYSTEM ---
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-4xl mx-auto w-full mt-2" id="keypad-hub-grid">
                
                {/* 1. Virtual numeric inputs keypad (Takes 3 columns) */}
                <div className="md:col-span-3 bg-[#2b2d31] p-5 rounded-2xl border border-neutral-700/60 shadow-lg flex flex-col justify-between" id="virtual-dial-keypad">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-gray-200 text-sm flex items-center gap-1.5 uppercase tracking-wider">
                      <PhoneCall className="w-4 h-4 text-discord-green animate-pulse" />
                      Direct Voice Dialer pad
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">
                      Type or select any registered phone numbers of people on the network to dial a real-time call.
                    </p>

                    {/* Dialer read-out screens */}
                    <div className="mt-4 bg-[#1e1f22] p-4 rounded-xl border border-neutral-800 flex items-center justify-between gap-3 text-white font-mono font-bold text-xl h-14">
                      <span>{dialInput || 'ENTER PHONE NUMBER'}</span>
                      {dialInput && (
                        <button onClick={() => setDialInput('')} className="text-gray-500 hover:text-white" title="Clear dialing string">
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Keyboard layout buttons */}
                  <div className="grid grid-cols-3 gap-3 my-5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((char) => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => {
                          if (dialInput.length < 15) {
                            setDialInput(prev => prev + char);
                          }
                        }}
                        className="py-3 bg-[#383a40] hover:bg-neutral-700 border border-neutral-700 rounded-xl text-center text-white font-mono font-bold text-lg select-none transition-transform hover:scale-105 cursor-pointer active:scale-95"
                      >
                        {char}
                      </button>
                    ))}
                  </div>

                  {/* Primary dial trigger call key */}
                  <button
                    onClick={() => handleDialCall()}
                    disabled={!dialInput}
                    className={`w-full py-3 rounded-xl text-sm font-bold text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                      dialInput ? 'bg-discord-green hover:bg-emerald-600' : 'bg-neutral-800 text-gray-500 border border-neutral-700 cursor-not-allowed'
                    }`}
                    id="btn-dial-keypad-trigger"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Dial Connection Channel</span>
                  </button>
                </div>

                {/* 2. Your Call Status & Dial Directory (Takes 2 columns) */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {/* Personal verification settings notification Card */}
                  <div className="bg-[#2b2d31] p-4 rounded-xl border border-neutral-700/50 shadow flex flex-col gap-3">
                    <h4 className="font-bold text-xs text-violet-400 uppercase tracking-widest">Your Private Line Phone Settings</h4>
                    {currentUser?.phone ? (
                      <div className="flex flex-col bg-neutral-800/60 p-3 border border-neutral-700 rounded-lg">
                        <span className="text-[10px] text-gray-400">Your Registered Active Line:</span>
                        <span className="text-base font-bold font-mono text-emerald-400 tracking-wider mt-0.5 select-all">{currentUser.phone}</span>
                        <p className="text-[10.5px] text-gray-400 mt-2">Friends can input this exact string to ring your device!</p>
                      </div>
                    ) : (
                      <div className="flex flex-col bg-rose-500/5 p-3 border border-rose-500/20 rounded-lg">
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-1 font-mono">⚠️ Phone Line Locked</span>
                        <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">Please register a verification mobile number in Settings below to enable Direct calls!</p>
                        <button
                          onClick={() => setShowSettings(true)}
                          className="mt-2.5 py-1.5 bg-discord-blurple hover:bg-indigo-600 rounded text-center text-white text-xs font-bold transition-all shadow cursor-pointer"
                        >
                          Lock line & configure
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Active telephone listings panel */}
                  <div className="bg-[#2b2d31] p-4 rounded-xl border border-neutral-700/50 shadow flex flex-col flex-1 gap-2 max-h-[300px] overflow-y-auto">
                    <h4 className="font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">Available Contacts</h4>
                    {(Object.values(discordState.users) as DiscordUser[])
                      .filter(u => u.phone && u.id !== currentUser?.id)
                      .map((u) => (
                        <button
                          key={u.id}
                          onClick={() => setDialInput(u.phone)}
                          className="flex items-center justify-between p-2 rounded-lg bg-neutral-800 hover:bg-[#35373c] text-left transition-all border border-neutral-700/50 group cursor-pointer"
                          title="Copy number to dialing display"
                        >
                          <div className="flex items-center gap-2 max-w-[120px] truncate">
                            <span className="text-base">{u.avatar}</span>
                            <div className="flex flex-col truncate">
                              <span className="text-xs font-bold text-gray-200 truncate">{u.name}</span>
                              <span className="text-[10px] text-gray-400 truncate tracking-tight">{u.phone}</span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-discord-blurple/10 text-discord-blurple px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all font-semibold">Copy No.</span>
                        </button>
                      ))}
                    {(Object.values(discordState.users) as DiscordUser[]).filter(u => u.phone && u.id !== currentUser?.id).length === 0 && (
                      <span className="text-xs text-gray-500 italic text-center py-6">No online users have registered active phone numbers yet.</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --- CORE DIAL RINGING OVERLAY VIDEO STAGE (If Call is ringing / connected) --- */}
            {activeCallObj && (
              <div className="mt-6 bg-[#111214] border border-neutral-700/40 p-6 rounded-2xl shadow-2xl flex flex-col gap-6 relative select-none animate-call-ring" id="call-interface-layer">
                
                {/* Caller receiver identities block */}
                <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-6">
                  {/* Caller */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className={`flex items-center justify-center w-20 h-20 rounded-full text-5xl font-bold text-white relative bg-discord-blurple ${
                        discordState.users[activeCallObj.callerId]?.voiceState?.isSpeaking ? 'ring-4 ring-emerald-500 animate-ring-pulse scale-105 shadow-xl shadow-emerald-500/30' : ''
                      }`}>
                        {discordState.users[activeCallObj.callerId]?.avatar || '🦄'}
                      </div>
                      <span className="absolute bottom-1 right-1 bg-[#23a55a] rounded-full p-1 border-2 border-slate-950">
                        <Volume2 className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <span className="font-bold text-white text-base mt-2">{discordState.users[activeCallObj.callerId]?.name || 'Caller'}</span>
                    <span className="text-xs text-gray-500 mt-0.5 font-mono">Caller ID linked</span>
                  </div>

                  {/* Ringing middle indicators */}
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-mono px-3 py-1 bg-violet-600/20 text-violet-400 font-bold tracking-widest rounded-full uppercase animate-pulse">
                      {activeCallObj.status === 'ringing' ? '📞 RINGING LINE VERIFY' : '🟢 SECURE RTC CALLROOM'}
                    </span>
                    <div className="h-[2px] w-16 bg-neutral-700 my-2 relative overflow-hidden">
                      <div className="absolute top-0 left-0 bg-discord-blurple w-8 h-full animate-ping" />
                    </div>
                    <span className="text-[11px] text-gray-400 font-mono text-center max-w-[200px]">
                      {activeCallObj.status === 'ringing' ? 'Waiting response...' : 'RTC connected signal peak'}
                    </span>
                  </div>

                  {/* Receiver */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className={`flex items-center justify-center w-20 h-20 rounded-full text-5xl font-bold text-white relative bg-[#db2777] ${
                        discordState.users[activeCallObj.receiverId]?.voiceState?.isSpeaking ? 'ring-4 ring-emerald-500 animate-ring-pulse scale-105 shadow-xl shadow-emerald-500/30' : ''
                      }`}>
                        {discordState.users[activeCallObj.receiverId]?.avatar || '🦄'}
                      </div>
                      <span className="absolute bottom-1 right-1 bg-pink-500 rounded-full p-1 border-2 border-slate-950">
                        <Volume2 className="w-4 h-4 text-white" />
                      </span>
                    </div>
                    <span className="font-bold text-white text-base mt-2">{discordState.users[activeCallObj.receiverId]?.name || 'Receiver'}</span>
                    <span className="text-xs text-gray-500 mt-0.5 font-mono">Receiver ID linked</span>
                  </div>
                </div>

                {/* Simulated webcam visual effects stage if connected! */}
                {activeCallObj.status === 'connected' && (
                  <div className="bg-[#232428] p-4 rounded-xl border border-neutral-800 flex flex-col md:flex-row items-center justify-around gap-4 shadow-inner">
                    <div className="w-full md:w-1/2 p-4 bg-black/40 rounded-lg flex flex-col items-center relative overflow-hidden border border-neutral-700/30">
                      <div className="absolute top-2 left-2 bg-[#1e1f22]/80 text-white font-semibold text-[10px] p-1 px-1.5 rounded flex items-center gap-1">
                        <Camera className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                        <span>Caller Camera Feed</span>
                      </div>
                      <span className="text-4xl py-6 animate-pulse">🦊</span>
                      <span className="text-xs text-gray-300 font-semibold mt-2">Active face-cam preview</span>
                    </div>

                    <div className="w-full md:w-1/2 p-4 bg-black/40 rounded-lg flex flex-col items-center relative overflow-hidden border border-neutral-700/30">
                      <div className="absolute top-2 left-2 bg-[#1e1f22]/80 text-white font-semibold text-[10px] p-1 px-1.5 rounded flex items-center gap-1">
                        <Share2 className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        <span>Receiver Audio Matrix</span>
                      </div>
                      <span className="text-4xl py-6 animate-pulse">🐱</span>
                      <span className="text-xs text-gray-300 font-semibold mt-2">Codec H.264/AAC High bandwidth</span>
                    </div>
                  </div>
                )}

                {/* Dial Call Hand up button controls */}
                <div className="flex justify-center border-t border-neutral-700/40 pt-4 gap-3">
                  <button
                    onClick={() => handleHangupCall(activeCallObj.id)}
                    className="p-3 bg-rose-500 hover:bg-rose-600 rounded-full text-white cursor-pointer transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 font-bold px-6"
                    id="btn-hangup-active-call"
                  >
                    <PhoneOff className="w-5 h-5" />
                    <span>Hang Up (Disconnect)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ================= 4. RIGHT PANEL: MEMBERS ROSTER AND CALL RING POPUPS ================= */}
      {isMemberListOpen && activeServerId !== 'home' && (
        <div className="flex flex-col w-[240px] bg-[#2b2d31] border-l border-[#1f2023] flex-shrink-0 select-none p-3 overflow-y-auto" id="members-list-column">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 select-none">
            Online — {resolveServerMembersList().filter(u => u.status !== 'offline').length}
          </div>

          <div className="flex flex-col gap-1">
            {resolveServerMembersList()
              .filter(u => u.status !== 'offline')
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 p-1.5 px-2 rounded-md hover:bg-[#35373c]/60 cursor-pointer transition-colors text-sm text-left group relative"
                  title={`${member.name} - ${member.customStatus || 'Online Discord tag'}`}
                >
                  <div className="relative flex-shrink-0">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white relative ${member.isNitro ? 'ring-2 ring-violet-500 shadow' : ''} ${member.color}`}>
                      {member.avatar}
                    </div>
                    {/* Status verification circles */}
                    <span className={`absolute bottom-[-1px] right-[-1px] flex h-3 w-3 rounded-full border border-black ${
                      member.status === 'online' ? 'bg-[#23a55a]' : member.status === 'idle' ? 'bg-[#f0b232]' : 'bg-[#f23f43]'
                    }`} />
                  </div>

                  <div className="flex flex-col truncate">
                    <span className="font-bold text-gray-200 truncate group-hover:text-white flex items-center gap-1">
                      {member.name}
                      {member.isNitro && <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse flex-shrink-0" />}
                    </span>
                    <span className="text-[10px] text-gray-400 truncate italic">
                      {member.customStatus || `Muted : ${member.voiceState?.isMuted}`}
                    </span>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-6 mb-3 select-none">
            Offline — {resolveServerMembersList().filter(u => u.status === 'offline').length}
          </div>

          <div className="flex flex-col gap-1">
            {resolveServerMembersList()
              .filter(u => u.status === 'offline')
              .map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 p-1.5 px-2 rounded-md hover:bg-[#35373c]/30 cursor-pointer transition-colors text-sm text-left opacity-50 select-none"
                >
                  <div className="relative flex-shrink-0">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-white ${member.color}`}>
                      {member.avatar}
                    </div>
                    <span className="absolute bottom-[-1px] right-[-1px] flex h-3 w-3 rounded-full border border-black bg-neutral-500" />
                  </div>

                  <div className="flex flex-col truncate">
                    <span className="font-bold text-gray-400 truncate">{member.name}</span>
                    <span className="text-[10px] text-gray-500 truncate">Offline</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ================= 5. POPUP NOTIFICATION MODAL: INCOMING CALL DRAWER ================= */}
      {incomingCallObj && (
        <div className="absolute top-4 right-4 bg-[#232428] border-2 border-[#5865f2] rounded-2xl shadow-2xl p-5 w-[310px] z-50 flex flex-col gap-4 animate-bounce" id="incoming-call-notification">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#5865f2] text-white rounded-full flex items-center justify-center text-2xl font-bold animate-pulse shadow-md shadow-[#5865f2]/40">
              📞
            </div>
            <div className="flex flex-col truncate">
              <span className="font-bold text-white text-sm flex items-center gap-1">
                Incoming Discord Call!
              </span>
              <span className="text-xs text-gray-300 font-semibold truncate">
                From: {discordState.users[incomingCallObj.callerId]?.name || 'Verification caller'}
              </span>
              <span className="text-[10px] text-gray-400 font-mono tracking-tight mt-0.5">{incomingCallObj.callerPhone}</span>
            </div>
          </div>

          <p className="text-[10.5px] text-gray-400 leading-relaxed border-t border-neutral-700/50 pt-2 select-none">
            Accepting the call will automatically establish a secure RTC voice channel and activate speaking waves!
          </p>

          <div className="flex items-center gap-2 border-t border-neutral-700/50 pt-3">
            <button
              onClick={() => handleCallInvitationResponse(incomingCallObj.id, 'decline')}
              className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 rounded-lg text-white text-xs font-bold transition-all shadow cursor-pointer text-center"
              id="btn-incoming-decline"
            >
              Decline
            </button>
            <button
              onClick={() => handleCallInvitationResponse(incomingCallObj.id, 'accept')}
              className="flex-1 py-2 bg-discord-green hover:bg-emerald-600 rounded-lg text-white text-xs font-bold transition-all shadow border border-emerald-500/20 cursor-pointer text-center animate-pulse"
              id="btn-incoming-accept"
            >
              Accept
            </button>
          </div>
        </div>
      )}

      {/* ================= 6. STYLISH POPUP MODALS: PARAMETERS USER SETTINGS ================= */}
      {showSettings && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="settings-profile-modal">
          <div className="bg-[#2b2d31] border border-neutral-700 rounded-2xl p-6 shadow-2xl max-w-md w-full flex flex-col gap-4 select-none">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <span className="font-bold text-white text-lg flex items-center gap-1.5 leading-none">
                <Settings className="w-5 h-5 text-discord-blurple animate-spin" />
                Discord User Profile Settings
              </span>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfileSubmit} className="flex flex-col gap-4 select-text">
              {/* Nickname input list */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Your Profile Nickname</label>
                <input
                  type="text"
                  required
                  maxLength={32}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-[#1e1f22] p-2.5 rounded-lg border border-neutral-700 text-white outline-none text-sm font-semibold focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple uppercase"
                />
              </div>

              {/* Verified Line Phone verification inputs exactly matching requested: "Но для этого надо указать номер телефона" */}
              <div className="flex flex-col gap-1.5 bg-[#1e1f22] p-3 rounded-xl border border-neutral-800">
                <label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1">
                  📞 Register Linked Phone Number
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g., +79991234567 or 123456"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  className="bg-[#2b2d31] p-2.5 rounded-lg border border-neutral-700 text-white outline-none text-sm font-mono tracking-wider focus:border-amber-400"
                />
                <span className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Required pattern! Other network callers type this exact unique number in the virtual dial-pad keypad to start a voice/video Discord Call.
                </span>
              </div>

              {/* Status Message input text area */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Custom Status Message</label>
                <input
                  type="text"
                  maxLength={60}
                  value={editedStatusMessage}
                  onChange={(e) => setEditedStatusMessage(e.target.value)}
                  className="bg-[#1e1f22] p-2.5 rounded-lg border border-neutral-700 text-white outline-none text-sm focus:border-discord-blurple"
                  placeholder="What is happening today?"
                />
              </div>

              {/* Emoji avatar selectors rows */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Choose Avatar Card Emoji</label>
                <div className="grid grid-cols-6 gap-2 max-h-[110px] overflow-y-auto bg-[#1e1f22] p-2 rounded-lg border border-neutral-700">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => setEditedAvatar(opt.emoji)}
                      className={`text-2xl py-1.5 rounded-md text-center transition-all ${
                        editedAvatar === opt.emoji ? 'bg-[#5865f2] scale-110 shadow-lg' : 'hover:bg-[#35373c]'
                      }`}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom background selectors colors */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Avatar Canvas Color</label>
                <div className="flex flex-wrap gap-2 p-2 bg-[#1e1f22] rounded-lg border border-neutral-700">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setEditedColor(c)}
                      className={`w-6 h-6 rounded-full border border-neutral-600 cursor-pointer ${c} ${
                        editedColor === c ? 'ring-2 ring-white scale-110 shadow-sm' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Free Discord Nitro unlock dynamic borders switch */}
              <div className="flex items-center justify-between bg-violet-950/20 border border-violet-500/20 p-3 rounded-xl gap-2 select-none">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
                    💎 FREE DISCORD NITRO UNLOCKED
                  </span>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                    Unlocks animated glowing profile border frames, custom role badges, and access to all stickers packs.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={editedNitro}
                  onChange={(e) => setEditedNitro(e.target.checked)}
                  className="w-5 h-5 accent-violet-500 rounded cursor-pointer"
                />
              </div>

              {/* Form Actions indicators footer panels */}
              <div className="border-t border-neutral-700 pt-3 mt-1 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg cursor-pointer"
                >
                  Close (Cancel)
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-discord-blurple hover:bg-indigo-600 text-white rounded-lg font-bold shadow-md cursor-pointer border border-[#5865f2]"
                  id="btn-save-settings"
                >
                  Save Profile Parameters
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 7. INITIAL FIRST TIME onboarding Screen ================= */}
      {showOnboarding && (
        <div className="absolute inset-0 bg-[#1e1f22] flex flex-col items-center justify-center p-4 z-50" id="onboarding-on-startup">
          <div className="max-w-md w-full bg-[#2b2d31] border border-neutral-700 p-6 rounded-2xl shadow-2xl flex flex-col gap-5 text-center">
            
            {/* Header branding block logos */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-[#5865f2] rounded-full flex items-center justify-center text-white text-4xl shadow-xl shadow-[#5865f2]/20 mb-3 animate-pulse">
                🎙️
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Google AI Studio Discord Companion</h1>
              <p className="text-xs text-gray-400 leading-relaxed mt-1 p-1">
                Enter your identity tags to register. Feel free to open a second tab/incognito window using our development URL to chat and call between profiles!
              </p>
            </div>

            {/* Form details block */}
            <form onSubmit={handleCreateOnboardingSubmit} className="flex flex-col text-left gap-4 select-text">
              {profileError && (
                <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-center font-bold font-mono">
                  {profileError}
                </div>
              )}

              {/* Nickname */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Input Your User Nickname</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., GamerYuri or AlexCoder"
                  maxLength={24}
                  value={onboardingName}
                  onChange={(e) => {
                    setOnboardingName(e.target.value);
                    setProfileError('');
                  }}
                  className="bg-[#1e1f22] p-2.5 rounded-lg border border-neutral-700 text-white outline-none text-sm focus:border-discord-blurple uppercase placeholder:text-neutral-600 placeholder:italic"
                />
              </div>

              {/* Phone Line verification */}
              <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-neutral-800 bg-[#1e1f22] relative group">
                <label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                  📞 Verification Mobile Phone number
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g., +79998881122 or 12345"
                  value={onboardingPhone}
                  onChange={(e) => {
                    setOnboardingPhone(e.target.value);
                    setProfileError('');
                  }}
                  className="bg-[#2b2d31] p-2.5 rounded-lg border border-neutral-700 text-white outline-none text-sm font-mono tracking-wider focus:border-amber-400"
                />
                <p className="text-[10px] text-gray-400 mt-1 lines-relaxed">
                  Enter any phone number (verified locally). Other callers will input this number into the Dial Dialer pad to request direct call connections!
                </p>
              </div>

              {/* Profile emoji catalogs rows */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Select Avatar Card Logo Emoji</label>
                <div className="grid grid-cols-6 gap-2 bg-[#1e1f22] p-2 rounded-lg border border-neutral-700 max-h-[105px] overflow-y-auto">
                  {AVATAR_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.label}
                      onClick={() => setOnboardingAvatar(opt.emoji)}
                      className={`text-2xl py-1.5 rounded-md text-center transition-all ${
                        onboardingAvatar === opt.emoji ? 'bg-[#5865f2] scale-110 shadow-md' : 'hover:bg-[#35373c]'
                      }`}
                    >
                      {opt.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Discord Nitro neon border frame glowers */}
              <div className="flex items-center justify-between border border-violet-500/20 bg-violet-950/20 p-3 rounded-xl select-none">
                <div className="flex flex-col max-w-[280px]">
                  <span className="text-xs font-bold text-violet-400 uppercase tracking-widest flex items-center gap-1">
                    💎 Unlock FREE Discord Nitro
                  </span>
                  <p className="text-[9px] text-gray-400 mt-0.5 leading-relaxed">
                    Unlocks active speaker glowers, custom stickers, profile badges, and allows uploading media.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={onboardingNitro}
                  onChange={(e) => setOnboardingNitro(e.target.checked)}
                  className="w-5 h-5 accent-violet-600 rounded cursor-pointer"
                />
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                className="w-full mt-2 py-3 bg-[#5865f2] hover:bg-indigo-600 text-white font-bold rounded-xl shadow-md cursor-pointer transition-transform hover:scale-[1.02] border border-[#5865f2]"
                id="btn-onboarding-submit"
              >
                Sign on Line & Enter Discord Companion
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= 8. POPUP MODALS: NEW SERVER DESIGN CREATOR ================= */}
      {showCreateServer && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="create-server-modal">
          <div className="bg-[#2b2d31] border border-neutral-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 select-none">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <span className="font-bold text-white text-lg flex items-center gap-1">
                Create new Discord Guild Server
              </span>
              <button onClick={() => setShowCreateServer(false)} className="text-gray-400 hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateServerSubmit} className="flex flex-col gap-4 select-text">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Server Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cool Developers"
                  maxLength={30}
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="bg-[#1e1f22] p-2.5 rounded-lg border border-neutral-700 text-white outline-none text-sm font-semibold focus:border-discord-blurple"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Server Emoji Icon</label>
                <div className="grid grid-cols-6 gap-2 bg-[#1e1f22] p-2 rounded-lg border border-neutral-700 max-h-[105px] overflow-y-auto">
                  {['🚀', '🍟', '🛹', '🎹', '🍩', '🥊', '👾', '🔥', '🎉', '🌟', '🦄', '🍿'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setNewServerIcon(emoji)}
                      className={`text-2xl py-1.5 select-none rounded-md text-center transition-all ${
                        newServerIcon === emoji ? 'bg-discord-blurple scale-110 shadow-md' : 'hover:bg-[#35373c]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-neutral-700 pt-3 flex justify-end gap-2 text-xs select-none">
                <button
                  type="button"
                  onClick={() => setShowCreateServer(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-discord-blurple hover:bg-indigo-600 text-white rounded-lg font-bold shadow-md cursor-pointer border border-[#5865f2]"
                  id="btn-create-server-submit"
                >
                  Create Guild
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= 9. POPUP MODALS: NEW CHANNEL CREATOR ================= */}
      {showCreateChannel && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" id="create-channel-modal">
          <div className="bg-[#2b2d31] border border-neutral-700 rounded-2xl p-6 shadow-2xl max-w-sm w-full flex flex-col gap-4 select-none">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <span className="font-bold text-white text-lg flex items-center gap-1">
                Create new Server Channel
              </span>
              <button onClick={() => setShowCreateChannel(false)} className="text-gray-400 hover:text-gray-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateChannelSubmit} className="flex flex-col gap-4 select-text">
              <div className="flex flex-col gap-1.5 select-none">
                <label className="text-xs font-bold text-gray-400 uppercase">Channel Type</label>
                <div className="flex gap-2 p-1 bg-[#1e1f22] rounded-lg border border-neutral-700">
                  <button
                    type="button"
                    onClick={() => setNewChannelType('text')}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      newChannelType === 'text' ? 'bg-[#5865f2] text-white shadow' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    💬 Text Room
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewChannelType('voice')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${
                      newChannelType === 'voice' ? 'bg-[#5865f2] text-white shadow' : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    🔊 Voice stream
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase">Input Channel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ai-general or Lofi Room"
                  maxLength={30}
                  value={newChannelName}
                  onChange={(e) => setNewChannelName(e.target.value)}
                  className="bg-[#1e1f22] p-2.5 rounded-lg border border-neutral-700 text-white outline-none text-sm font-semibold focus:border-discord-blurple"
                />
              </div>

              <div className="border-t border-neutral-700 pt-3 flex justify-end gap-2 text-xs select-none">
                <button
                  type="button"
                  onClick={() => setShowCreateChannel(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-discord-blurple hover:bg-indigo-600 text-white rounded-lg font-bold shadow-md cursor-pointer border border-[#5865f2]"
                  id="btn-create-channel-submit"
                >
                  Create active Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
