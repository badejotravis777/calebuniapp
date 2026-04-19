import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, KeyboardAvoidingView, Platform, FlatList,
  Pressable, TextInput, ActivityIndicator, StyleSheet,
  Image, Modal, Alert, ActionSheetIOS,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Theme } from "../utils/theme";
import { styles } from "./commonStyles";
import { BASE_URL } from "../utils/config";

type StandardProps = { theme: Theme };

type Reaction = { emoji: string; users: string[] };
type PollOption = { text: string; votes: string[] };

type ChatMessage = {
  _id:       string;
  sender:    string;
  type:      "text" | "image" | "document" | "poll";
  text:      string;
  imageData?: string;
  fileName?:  string;
  fileSize?:  string;
  poll?:     { question: string; options: PollOption[] };
  reactions: Reaction[];
  createdAt: string;
  isSystem:  boolean;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const abbreviateForHeader = (dept: string, level: string): string => {
  if (!dept) return `${level} Level`;
  const words = dept.split(" ").filter(Boolean);
  return `${words.map((w) => w[0]).join("").toUpperCase()} - ${level} Level`;
};

const formatTime = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Returns "Today", "Yesterday", or "Mon, 14 Apr"
const formatDateLabel = (iso: string): string => {
  const date = new Date(iso);
  const now  = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === now.toDateString())       return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
};

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function CommunityScreen({ theme }: StandardProps) {
  const insets = useSafeAreaInsets(); // ✅ Safe area fix

  const [messages, setMessages]         = useState<ChatMessage[]>([]);
  const [text, setText]                 = useState("");
  const [username, setUsername]         = useState("");
  const [room, setRoom]                 = useState("");
  const [headerLabel, setHeaderLabel]   = useState("Community");
  const [memberCount, setMemberCount]   = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Reaction picker state
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);

  // Poll creation state
  const [showPollModal, setShowPollModal]   = useState(false);
  const [pollQuestion, setPollQuestion]     = useState("");
  const [pollOptions, setPollOptions]       = useState(["", ""]);

  const socketRef   = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // ── INIT ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      try {
        const [storedUser, storedDept, storedLevel] = await Promise.all([
          AsyncStorage.getItem("username"),
          AsyncStorage.getItem("department"),
          AsyncStorage.getItem("level"),
        ]);

        const user     = storedUser  || "Anonymous";
        const dept     = storedDept  || "General";
        const level    = storedLevel || "100";
        const roomName = `${dept}-${level}`;

        setUsername(user);
        setRoom(roomName);
        setHeaderLabel(abbreviateForHeader(dept, level));
        fetchMemberCount(dept, level);
        loadHistory(roomName);

        const socket = io(BASE_URL, {
          transports: ["websocket"],
          reconnectionAttempts: 5,
        });
        socketRef.current = socket;

        socket.on("connect", () => socket.emit("join-room", roomName));

        socket.on("receive-message", (msg: ChatMessage) => {
          setMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        });

        // Live reaction updates
        socket.on("reaction-updated", ({ messageId, reactions }) => {
          setMessages((prev) =>
            prev.map((m) => m._id === messageId ? { ...m, reactions } : m)
          );
        });

        // Live poll vote updates
        socket.on("poll-updated", (updatedMsg: ChatMessage) => {
          setMessages((prev) =>
            prev.map((m) => m._id === updatedMsg._id ? updatedMsg : m)
          );
        });

        socket.on("connect_error", (err) => console.error("Socket error:", err.message));
      } catch (e) {
        console.error("Community init error:", e);
      }
    };

    init();
    return () => { socketRef.current?.disconnect(); };
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
      // Silent fail — chat still usable
    } finally {
      setLoadingHistory(false);
    }
  };

  // ── AUTO-SCROLL ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  // ── SEND TEXT ───────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (!text.trim() || !room || !socketRef.current) return;
    socketRef.current.emit("send-message", { room, sender: username, text: text.trim() });
    setText("");
  }, [text, room, username]);

  // ── ATTACHMENT ACTION SHEET ─────────────────────────────────────────────────
  const handleAttachment = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "📷 Photo / Video", "📄 Document", "📊 Create Poll"],
          cancelButtonIndex: 0,
        },
        (idx) => {
          if (idx === 1) handlePickImage();
          if (idx === 2) handlePickDocument();
          if (idx === 3) setShowPollModal(true);
        }
      );
    } else {
      // Android — simple Alert since ActionSheetIOS is iOS-only
      Alert.alert("Share", "Choose what to send", [
        { text: "📷 Photo", onPress: handlePickImage },
        { text: "📄 Document", onPress: handlePickDocument },
        { text: "📊 Poll", onPress: () => setShowPollModal(true) },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  // ── SEND IMAGE ──────────────────────────────────────────────────────────────
  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to share images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5, // Compress to keep payload small
      base64: true,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      socketRef.current?.emit("send-image", {
        room,
        sender: username,
        imageData: `data:image/jpeg;base64,${result.assets[0].base64}`,
      });
    }
  };

  // ── SEND DOCUMENT ───────────────────────────────────────────────────────────
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const sizeKB = asset.size ? `${(asset.size / 1024).toFixed(1)} KB` : "Unknown size";
        socketRef.current?.emit("send-document", {
          room,
          sender: username,
          fileName: asset.name,
          fileSize: sizeKB,
        });
      }
    } catch {
      Alert.alert("Error", "Could not pick document");
    }
  };

  // ── SEND POLL ───────────────────────────────────────────────────────────────
  const handleSendPoll = () => {
    const validOptions = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || validOptions.length < 2) {
      Alert.alert("Incomplete", "Add a question and at least 2 options.");
      return;
    }
    socketRef.current?.emit("send-poll", {
      room, sender: username,
      question: pollQuestion.trim(),
      options: validOptions,
    });
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPollModal(false);
  };

  // ── VOTE ON POLL ────────────────────────────────────────────────────────────
  const handleVote = async (messageId: string, optionIndex: number) => {
    try {
      await axios.post(`${BASE_URL}/api/messages/${messageId}/vote`, {
        optionIndex,
        username,
      });
    } catch {
      Alert.alert("Error", "Could not submit vote");
    }
  };

  // ── TOGGLE REACTION ─────────────────────────────────────────────────────────
  const handleReaction = (messageId: string, emoji: string) => {
    socketRef.current?.emit("toggle-reaction", { messageId, emoji, username });
    setReactionTarget(null);
  };

  // ── BUILD FLAT LIST DATA with date separators ────────────────────────────────
  type ListItem = { type: "message"; data: ChatMessage } | { type: "separator"; label: string; key: string };

  const listData: ListItem[] = [];
  let lastDateLabel = "";
  messages.forEach((msg) => {
    const label = formatDateLabel(msg.createdAt);
    if (label !== lastDateLabel) {
      listData.push({ type: "separator", label, key: `sep-${msg._id}` });
      lastDateLabel = label;
    }
    listData.push({ type: "message", data: msg });
  });

  // ── RENDER MESSAGE ──────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: ListItem }) => {
    // Date separator
    if (item.type === "separator") {
      return (
        <View style={localStyles.dateSepRow}>
          <View style={[localStyles.dateSepLine, { backgroundColor: theme.border }]} />
          <View style={[localStyles.dateSepPill, { backgroundColor: theme.border }]}>
            <Text style={[localStyles.dateSepText, { color: theme.subtext }]}>{item.label}</Text>
          </View>
          <View style={[localStyles.dateSepLine, { backgroundColor: theme.border }]} />
        </View>
      );
    }

    const msg  = item.data;
    const isMe = msg.sender === username;

    if (msg.isSystem) {
      return (
        <View style={[localStyles.systemBubble, { backgroundColor: theme.border }]}>
          <Text style={[localStyles.systemText, { color: theme.subtext }]}>{msg.text}</Text>
        </View>
      );
    }

    return (
      <View style={[localStyles.row, isMe ? localStyles.rowMe : localStyles.rowOther]}>
        {!isMe && (
          <View style={[localStyles.avatar, { backgroundColor: theme.primary + "25" }]}>
            <Text style={[localStyles.avatarText, { color: theme.primary }]}>
              {msg.sender.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={[localStyles.bubbleCol, isMe && { alignItems: "flex-end" }]}>
          {!isMe && (
            <Text style={[localStyles.senderName, { color: theme.primary }]}>{msg.sender}</Text>
          )}

          {/* Long-press to react */}
          <Pressable
            onLongPress={() => setReactionTarget(reactionTarget === msg._id ? null : msg._id)}
            delayLongPress={350}
          >
            <View
              style={[
                localStyles.bubble,
                isMe
                  ? { backgroundColor: theme.primary, borderBottomRightRadius: 4 }
                  : { backgroundColor: theme.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.border },
              ]}
            >
              {/* TEXT */}
              {msg.type === "text" && (
                <Text style={[localStyles.messageText, { color: isMe ? "#fff" : theme.text }]}>
                  {msg.text}
                </Text>
              )}

              {/* IMAGE */}
              {msg.type === "image" && msg.imageData && (
                <Image
                  source={{ uri: msg.imageData }}
                  style={localStyles.imageMsg}
                  resizeMode="cover"
                />
              )}

              {/* DOCUMENT */}
              {msg.type === "document" && (
                <View style={localStyles.docRow}>
                  <View style={[localStyles.docIcon, { backgroundColor: isMe ? "rgba(255,255,255,0.2)" : theme.background }]}>
                    <Ionicons name="document-text-outline" size={24} color={isMe ? "#fff" : theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[localStyles.docName, { color: isMe ? "#fff" : theme.text }]}
                      numberOfLines={2}
                    >
                      {msg.fileName}
                    </Text>
                    <Text style={[localStyles.docSize, { color: isMe ? "rgba(255,255,255,0.7)" : theme.subtext }]}>
                      {msg.fileSize}
                    </Text>
                  </View>
                </View>
              )}

              {/* POLL */}
              {msg.type === "poll" && msg.poll && (
                <View style={localStyles.pollContainer}>
                  <Text style={[localStyles.pollQuestion, { color: isMe ? "#fff" : theme.text }]}>
                    📊 {msg.poll.question}
                  </Text>
                  {msg.poll.options.map((opt, idx) => {
                    const totalVotes = msg.poll!.options.reduce((s, o) => s + o.votes.length, 0);
                    const pct = totalVotes > 0 ? Math.round((opt.votes.length / totalVotes) * 100) : 0;
                    const hasVoted = opt.votes.includes(username);
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => handleVote(msg._id, idx)}
                        style={[
                          localStyles.pollOption,
                          {
                            borderColor: isMe ? "rgba(255,255,255,0.4)" : theme.primary,
                            backgroundColor: hasVoted
                              ? (isMe ? "rgba(255,255,255,0.25)" : theme.primary + "20")
                              : "transparent",
                          },
                        ]}
                      >
                        <View style={[localStyles.pollBar, { width: `${pct}%`, backgroundColor: isMe ? "rgba(255,255,255,0.15)" : theme.primary + "15" }]} />
                        <Text style={[localStyles.pollOptionText, { color: isMe ? "#fff" : theme.text }]}>
                          {hasVoted ? "✓ " : ""}{opt.text}
                        </Text>
                        <Text style={[localStyles.pollPct, { color: isMe ? "rgba(255,255,255,0.8)" : theme.subtext }]}>
                          {pct}%
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Text style={[localStyles.pollVoteCount, { color: isMe ? "rgba(255,255,255,0.6)" : theme.subtext }]}>
                    {msg.poll.options.reduce((s, o) => s + o.votes.length, 0)} votes
                  </Text>
                </View>
              )}

              <Text style={[localStyles.timeText, { color: isMe ? "rgba(255,255,255,0.6)" : theme.subtext }]}>
                {formatTime(msg.createdAt)}
                {isMe && " ✓✓"}
              </Text>
            </View>
          </Pressable>

          {/* Reaction picker popup */}
          {reactionTarget === msg._id && (
            <View style={[localStyles.reactionPicker, {
              backgroundColor: theme.card,
              borderColor: theme.border,
              alignSelf: isMe ? "flex-end" : "flex-start",
            }]}>
              {REACTION_EMOJIS.map((emoji) => (
                <Pressable key={emoji} onPress={() => handleReaction(msg._id, emoji)} style={localStyles.reactionBtn}>
                  <Text style={localStyles.reactionEmoji}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Reactions bar */}
          {msg.reactions?.length > 0 && (
            <View style={[localStyles.reactionsRow, isMe && { justifyContent: "flex-end" }]}>
              {msg.reactions
                .filter((r) => r.users.length > 0)
                .map((r) => (
                  <Pressable
                    key={r.emoji}
                    onPress={() => handleReaction(msg._id, r.emoji)}
                    style={[
                      localStyles.reactionChip,
                      {
                        backgroundColor: r.users.includes(username) ? theme.primary + "25" : theme.border,
                        borderColor: r.users.includes(username) ? theme.primary : "transparent",
                      },
                    ]}
                  >
                    <Text style={localStyles.reactionChipEmoji}>{r.emoji}</Text>
                    <Text style={[localStyles.reactionChipCount, { color: theme.text }]}>
                      {r.users.length}
                    </Text>
                  </Pressable>
                ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* HEADER */}
      <View style={[localStyles.header, { borderBottomColor: theme.border }]}>
        <Ionicons name="information-circle-outline" size={24} color={theme.subtext} />
        <View style={{ alignItems: "center" }}>
          <Text style={[localStyles.headerTitle, { color: theme.text }]}>{headerLabel}</Text>
          <Text style={[localStyles.headerSub, { color: theme.primary }]}>
            {memberCount !== null ? `${memberCount} Member${memberCount !== 1 ? "s" : ""}` : "..."}
          </Text>
        </View>
        <Ionicons name="search-outline" size={24} color={theme.subtext} />
      </View>

      {/* MESSAGES */}
      {loadingHistory ? (
        <View style={localStyles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item) => item.type === "separator" ? item.key : item.data._id}
          renderItem={renderItem}
          contentContainerStyle={[localStyles.listContent, { flexGrow: 1 }]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={localStyles.center}>
              <Ionicons name="chatbubbles-outline" size={52} color={theme.border} />
              <Text style={[localStyles.emptyText, { color: theme.subtext }]}>
                No messages yet.{"\n"}Be the first to say something! 👋
              </Text>
            </View>
          }
        />
      )}

      {/* INPUT BAR — paddingBottom uses safe area so it clears the home indicator */}
      <View style={[
        localStyles.inputBar,
        {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10, // ✅ Safe area fix
        },
      ]}>
        <Pressable onPress={handleAttachment} style={localStyles.attachBtn}>
          <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
        </Pressable>

        <TextInput
          style={[localStyles.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.subtext}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
        />

        <Pressable
          onPress={handleSend}
          disabled={!text.trim()}
          style={[localStyles.sendBtn, { backgroundColor: text.trim() ? theme.primary : theme.border }]}
        >
          <Ionicons name="send" size={16} color="#fff" />
        </Pressable>
      </View>

      {/* POLL CREATION MODAL */}
      <Modal visible={showPollModal} transparent animationType="slide">
        <View style={localStyles.modalOverlay}>
          <View style={[localStyles.modalBox, { backgroundColor: theme.card }]}>
            <View style={localStyles.modalHeader}>
              <Text style={[localStyles.modalTitle, { color: theme.text }]}>Create Poll</Text>
              <Pressable onPress={() => setShowPollModal(false)}>
                <Ionicons name="close-circle" size={26} color={theme.subtext} />
              </Pressable>
            </View>

            <TextInput
              style={[localStyles.pollInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="Ask a question..."
              placeholderTextColor={theme.subtext}
              value={pollQuestion}
              onChangeText={setPollQuestion}
            />

            {pollOptions.map((opt, idx) => (
              <View key={idx} style={localStyles.pollInputRow}>
                <TextInput
                  style={[localStyles.pollInput, { flex: 1, backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  placeholder={`Option ${idx + 1}`}
                  placeholderTextColor={theme.subtext}
                  value={opt}
                  onChangeText={(val) => {
                    const updated = [...pollOptions];
                    updated[idx] = val;
                    setPollOptions(updated);
                  }}
                />
                {pollOptions.length > 2 && (
                  <Pressable onPress={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}>
                    <Ionicons name="remove-circle-outline" size={24} color="#DC2626" style={{ marginLeft: 8 }} />
                  </Pressable>
                )}
              </View>
            ))}

            {pollOptions.length < 5 && (
              <Pressable onPress={() => setPollOptions([...pollOptions, ""])} style={localStyles.addOptionBtn}>
                <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
                <Text style={[localStyles.addOptionText, { color: theme.primary }]}>Add Option</Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleSendPoll}
              style={[localStyles.sendPollBtn, { backgroundColor: theme.primary }]}
            >
              <Text style={localStyles.sendPollText}>Send Poll</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const localStyles = StyleSheet.create({
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  headerSub:   { fontSize: 12, fontWeight: "600", marginTop: 1 },

  listContent: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 },
  center:      { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  emptyText:   { textAlign: "center", marginTop: 14, fontSize: 14, lineHeight: 22 },

  // Date separator
  dateSepRow:  { flexDirection: "row", alignItems: "center", marginVertical: 14, paddingHorizontal: 4 },
  dateSepLine: { flex: 1, height: 1 },
  dateSepPill: { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 12, marginHorizontal: 8 },
  dateSepText: { fontSize: 11, fontWeight: "600" },

  // Message rows
  row:      { flexDirection: "row", marginBottom: 12, maxWidth: "82%" },
  rowMe:    { alignSelf: "flex-end",  flexDirection: "row-reverse" },
  rowOther: { alignSelf: "flex-start" },

  avatar:     { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 8, alignSelf: "flex-end" },
  avatarText: { fontSize: 13, fontWeight: "700" },

  bubbleCol:  { flexShrink: 1 },
  senderName: { fontSize: 11, fontWeight: "700", marginBottom: 3, marginLeft: 2 },

  bubble:      { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18 },
  messageText: { fontSize: 14, lineHeight: 20 },
  timeText:    { fontSize: 10, marginTop: 5, alignSelf: "flex-end" },

  // Image message
  imageMsg: { width: 200, height: 200, borderRadius: 12 },

  // Document message
  docRow:  { flexDirection: "row", alignItems: "center", gap: 10, minWidth: 180 },
  docIcon: { width: 42, height: 42, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  docName: { fontSize: 13, fontWeight: "600", flexWrap: "wrap" },
  docSize: { fontSize: 11, marginTop: 2 },

  // Poll
  pollContainer:  { minWidth: 200 },
  pollQuestion:   { fontSize: 14, fontWeight: "700", marginBottom: 10, lineHeight: 20 },
  pollOption: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
    marginBottom: 7, flexDirection: "row", alignItems: "center", overflow: "hidden",
    position: "relative",
  },
  pollBar:        { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 10 },
  pollOptionText: { flex: 1, fontSize: 13, fontWeight: "500" },
  pollPct:        { fontSize: 12, fontWeight: "700" },
  pollVoteCount:  { fontSize: 11, marginTop: 6, textAlign: "right" },

  // Reactions
  reactionPicker: {
    flexDirection: "row", borderRadius: 28, paddingHorizontal: 10, paddingVertical: 7,
    marginTop: 5, borderWidth: 1, gap: 4,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  reactionBtn:   { padding: 4 },
  reactionEmoji: { fontSize: 22 },
  reactionsRow:  { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 5 },
  reactionChip:  {
    flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 7,
    paddingVertical: 3, borderWidth: 1, gap: 3,
  },
  reactionChipEmoji: { fontSize: 13 },
  reactionChipCount: { fontSize: 11, fontWeight: "700" },

  // System
  systemBubble: { alignSelf: "center", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginVertical: 8 },
  systemText:   { fontSize: 12 },

  // Input bar
  inputBar: {
    flexDirection: "row", alignItems: "flex-end",
    paddingHorizontal: 10, paddingTop: 10, borderTopWidth: 1, gap: 8,
  },
  attachBtn: { paddingBottom: 9 },
  input: {
    flex: 1, borderRadius: 22, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, maxHeight: 120,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: "center", alignItems: "center", marginBottom: 1,
  },

  // Poll modal
  modalOverlay:  { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalBox:      { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22 },
  modalHeader:   { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle:    { fontSize: 18, fontWeight: "700" },
  pollInput: {
    borderWidth: 1, borderRadius: 12, paddingHorizontal: 14,
    paddingVertical: 11, fontSize: 14, marginBottom: 10,
  },
  pollInputRow:  { flexDirection: "row", alignItems: "center" },
  addOptionBtn:  { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  addOptionText: { fontSize: 14, fontWeight: "600" },
  sendPollBtn:   { borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  sendPollText:  { color: "#fff", fontWeight: "800", fontSize: 15 },
});
