import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Pressable,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import { Theme } from "../utils/theme";
import { styles } from "./commonStyles";
import { BASE_URL } from "../utils/config";

type StandardProps = { theme: Theme };

type ChatMessage = {
  _id:       string;
  sender:    string;
  text:      string;
  createdAt: string;
  isSystem:  boolean;
};

// Abbreviate dept for the header: "Computer Science" → "CS"
const abbreviateForHeader = (dept: string, level: string): string => {
  if (!dept) return `${level} Level`;
  const words = dept.split(" ").filter(Boolean);
  const abbr  = words.map((w) => w[0]).join("").toUpperCase();
  return `${abbr} - ${level} Level`;
};

// Format ISO timestamp to "HH:MM" or "Yesterday HH:MM"
const formatTime = (iso: string): string => {
  const date = new Date(iso);
  const now  = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const hhmm = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return isToday ? hhmm : `Yesterday ${hhmm}`;
};

export default function CommunityScreen({ theme }: StandardProps) {
  const [messages, setMessages]     = useState<ChatMessage[]>([]);
  const [text, setText]             = useState("");
  const [username, setUsername]     = useState("");
  const [room, setRoom]             = useState("");
  const [headerLabel, setHeaderLabel] = useState("Community");
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const socketRef  = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // ── 1. Load user data → derive room → connect socket ──────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const [storedUser, storedDept, storedLevel] = await Promise.all([
          AsyncStorage.getItem("username"),
          AsyncStorage.getItem("department"),
          AsyncStorage.getItem("level"),
        ]);

        const user  = storedUser  || "Anonymous";
        const dept  = storedDept  || "General";
        const level = storedLevel || "100";
        const roomName = `${dept}-${level}`; // e.g. "Computer Science-100"

        setUsername(user);
        setRoom(roomName);
        setHeaderLabel(abbreviateForHeader(dept, level));

        // Fetch member count — users registered with same dept+level
        fetchMemberCount(dept, level);

        // Load message history
        loadHistory(roomName);

        // Connect socket and join room
        const socket = io(BASE_URL, {
          transports: ["websocket"],
          reconnectionAttempts: 5,
        });
        socketRef.current = socket;

        socket.on("connect", () => {
          socket.emit("join-room", roomName);
        });

        socket.on("receive-message", (msg: ChatMessage) => {
          setMessages((prev) => {
            // Deduplicate — socket broadcasts to sender too
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        });

        socket.on("connect_error", (err) => {
          console.error("Socket error:", err.message);
        });
      } catch (e) {
        console.error("Community init error:", e);
      }
    };

    init();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const fetchMemberCount = async (dept: string, level: string) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/members/${encodeURIComponent(dept)}/${encodeURIComponent(level)}`
      );
      setMemberCount(res.data.count);
    } catch {
      setMemberCount(null);
    }
  };

  const loadHistory = async (roomName: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/messages/${encodeURIComponent(roomName)}`);
      setMessages(res.data);
    } catch {
      // History load failed — still usable, just no old messages
    } finally {
      setLoadingHistory(false);
    }
  };

  // ── 2. Auto-scroll to bottom when new messages arrive ─────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  // ── 3. Send message ────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (!text.trim() || !room || !socketRef.current) return;
    socketRef.current.emit("send-message", {
      room,
      sender: username,
      text:   text.trim(),
    });
    setText("");
  }, [text, room, username]);

  // ── 4. Render a single message bubble ─────────────────────────────────────
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    if (item.isSystem) {
      return (
        <View style={[localStyles.systemBubble, { backgroundColor: theme.border }]}>
          <Text style={[localStyles.systemText, { color: theme.subtext }]}>{item.text}</Text>
        </View>
      );
    }

    const isMe = item.sender === username;

    return (
      <View style={[localStyles.row, isMe ? localStyles.rowMe : localStyles.rowOther]}>
        {/* Avatar — only shown for others */}
        {!isMe && (
          <View style={[localStyles.avatar, { backgroundColor: theme.primary + "30" }]}>
            <Text style={[localStyles.avatarText, { color: theme.primary }]}>
              {item.sender.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={localStyles.bubbleCol}>
          {/* Sender name — only shown for others */}
          {!isMe && (
            <Text style={[localStyles.senderName, { color: theme.primary }]}>
              {item.sender}
            </Text>
          )}

          <View
            style={[
              localStyles.bubble,
              isMe
                ? { backgroundColor: theme.primary, borderBottomRightRadius: 4 }
                : { backgroundColor: theme.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.border },
            ]}
          >
            <Text style={[localStyles.messageText, { color: isMe ? "#fff" : theme.text }]}>
              {item.text}
            </Text>
            <Text style={[localStyles.timeText, { color: isMe ? "rgba(255,255,255,0.65)" : theme.subtext }]}>
              {formatTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* ── HEADER ── */}
      <View style={[localStyles.header, { borderBottomColor: theme.border }]}>
        <Ionicons name="information-circle-outline" size={24} color={theme.subtext} />
        <View style={{ alignItems: "center" }}>
          <Text style={[localStyles.headerTitle, { color: theme.text }]}>{headerLabel}</Text>
          <Text style={[localStyles.headerSub, { color: theme.primary }]}>
            {memberCount !== null ? `${memberCount} Member${memberCount !== 1 ? "s" : ""}` : "Loading..."}
          </Text>
        </View>
        <Ionicons name="search-outline" size={24} color={theme.subtext} />
      </View>

      {/* ── MESSAGES ── */}
      {loadingHistory ? (
        <View style={localStyles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderMessage}
          contentContainerStyle={localStyles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={localStyles.center}>
              <Ionicons name="chatbubbles-outline" size={48} color={theme.border} />
              <Text style={[localStyles.emptyText, { color: theme.subtext }]}>
                No messages yet.{"\n"}Be the first to say something! 👋
              </Text>
            </View>
          }
        />
      )}

      {/* ── INPUT BAR ── */}
      <View style={[localStyles.inputBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        <TextInput
          style={[localStyles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.subtext}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleSend}
          disabled={!text.trim()}
          style={[
            localStyles.sendBtn,
            { backgroundColor: text.trim() ? theme.primary : theme.border },
          ]}
        >
          <Ionicons name="send" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── LOCAL STYLES ─────────────────────────────────────────────────────────────
const localStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  headerSub:   { fontSize: 12, fontWeight: "600", marginTop: 1 },

  listContent: { paddingHorizontal: 16, paddingVertical: 12, flexGrow: 1 },

  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  emptyText: { textAlign: "center", marginTop: 12, fontSize: 14, lineHeight: 22 },

  row:      { flexDirection: "row", marginBottom: 14, maxWidth: "82%" },
  rowMe:    { alignSelf: "flex-end",  flexDirection: "row-reverse" },
  rowOther: { alignSelf: "flex-start" },

  avatar:     { width: 34, height: 34, borderRadius: 17, justifyContent: "center", alignItems: "center", marginRight: 8, alignSelf: "flex-end" },
  avatarText: { fontSize: 14, fontWeight: "700" },

  bubbleCol:  { flexShrink: 1 },
  senderName: { fontSize: 11, fontWeight: "700", marginBottom: 3, marginLeft: 2 },

  bubble: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 16,
  },
  messageText: { fontSize: 14, lineHeight: 20 },
  timeText:    { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },

  systemBubble: { alignSelf: "center", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginVertical: 8 },
  systemText:   { fontSize: 12 },

  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  input: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 120,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 1,
  },
});
