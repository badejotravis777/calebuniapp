import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View, Text, KeyboardAvoidingView, Platform, FlatList,
  Pressable, TextInput, ActivityIndicator, StyleSheet,
  Image, Modal, Alert,
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
type Reaction   = { emoji: string; users: string[] };
type PollOption = { text: string; votes: string[] };
type ChatMessage = {
  _id:       string;
  sender:    string;
  type?:     "text" | "image" | "document" | "poll"; // ✅ optional — old messages have no type
  text:      string;
  imageData?: string;
  fileName?:  string;
  fileSize?:  string;
  poll?:      { question: string; options: PollOption[] };
  reactions:  Reaction[];
  createdAt:  string;
  isSystem:   boolean;
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const abbreviateForHeader = (dept: string, level: string) => {
  if (!dept) return `${level} Level`;
  return `${dept.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase()} - ${level} Level`;
};

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDateLabel = (iso: string): string => {
  const date      = new Date(iso);
  const now       = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === now.toDateString())       return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short" });
};

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function CommunityScreen({ theme }: StandardProps) {
  const insets = useSafeAreaInsets();

  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [text, setText]                   = useState("");
  const [username, setUsername]           = useState("");
  const [room, setRoom]                   = useState("");
  const [headerLabel, setHeaderLabel]     = useState("Community");
  const [memberCount, setMemberCount]     = useState<number | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [reactionTarget, setReactionTarget] = useState<string | null>(null);

  // Attachment panel
  const [showAttachPanel, setShowAttachPanel] = useState(false);

  // Poll modal
  const [showPollModal, setShowPollModal] = useState(false);
  const [pollQuestion, setPollQuestion]   = useState("");
  const [pollOptions, setPollOptions]     = useState(["", ""]);

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

        const socket = io(BASE_URL, { transports: ["websocket"], reconnectionAttempts: 5 });
        socketRef.current = socket;

        socket.on("connect", () => socket.emit("join-room", roomName));

        socket.on("receive-message", (msg: ChatMessage) => {
          setMessages((prev) => {
            if (prev.some((m) => m._id === msg._id)) return prev;
            return [...prev, msg];
          });
        });

        socket.on("reaction-updated", ({ messageId, reactions }) => {
          setMessages((prev) => prev.map((m) => m._id === messageId ? { ...m, reactions } : m));
        });

        socket.on("poll-updated", (updated: ChatMessage) => {
          setMessages((prev) => prev.map((m) => m._id === updated._id ? updated : m));
        });
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
    } catch { setMemberCount(null); }
  };

  const loadHistory = async (roomName: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/messages/${encodeURIComponent(roomName)}`);
      setMessages(res.data);
    } catch { /* silent */ }
    finally { setLoadingHistory(false); }
  };

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

  // ── SEND IMAGE ──────────────────────────────────────────────────────────────
  const handlePickImage = async () => {
    setShowAttachPanel(false);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Allow photo library access to share images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled && result.assets[0]?.base64) {
      socketRef.current?.emit("send-image", {
        room, sender: username,
        imageData: `data:image/jpeg;base64,${result.assets[0].base64}`,
      });
    }
  };

  // ── SEND DOCUMENT ───────────────────────────────────────────────────────────
  const handlePickDocument = async () => {
    setShowAttachPanel(false);
    try {
      const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
      if (!result.canceled && result.assets[0]) {
        const asset  = result.assets[0];
        const sizeKB = asset.size ? `${(asset.size / 1024).toFixed(1)} KB` : "";
        socketRef.current?.emit("send-document", {
          room, sender: username,
          fileName: asset.name,
          fileSize: sizeKB,
        });
      }
    } catch { Alert.alert("Error", "Could not open document picker"); }
  };

  // ── SEND POLL ───────────────────────────────────────────────────────────────
  const handleSendPoll = () => {
    const valid = pollOptions.filter((o) => o.trim());
    if (!pollQuestion.trim() || valid.length < 2) {
      Alert.alert("Incomplete", "Add a question and at least 2 options.");
      return;
    }
    socketRef.current?.emit("send-poll", {
      room, sender: username,
      question: pollQuestion.trim(),
      options: valid,
    });
    setPollQuestion(""); setPollOptions(["", ""]); setShowPollModal(false);
  };

  const handleVote = async (messageId: string, optionIndex: number) => {
    try {
      await axios.post(`${BASE_URL}/api/messages/${messageId}/vote`, { optionIndex, username });
    } catch { Alert.alert("Error", "Could not submit vote"); }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    socketRef.current?.emit("toggle-reaction", { messageId, emoji, username });
    setReactionTarget(null);
  };

  // ── LIST DATA with date separators ──────────────────────────────────────────
  type SepItem = { type: "separator"; label: string; key: string };
  type MsgItem = { type: "message"; data: ChatMessage };
  type ListItem = SepItem | MsgItem;

  const listData: ListItem[] = [];
  let lastLabel = "";
  messages.forEach((msg) => {
    const label = formatDateLabel(msg.createdAt);
    if (label !== lastLabel) {
      listData.push({ type: "separator", label, key: `sep-${msg._id}` });
      lastLabel = label;
    }
    listData.push({ type: "message", data: msg });
  });

  // ── RENDER ──────────────────────────────────────────────────────────────────
  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "separator") {
      return (
        <View style={S.dateSepRow}>
          <View style={[S.dateLine, { backgroundColor: theme.border }]} />
          <View style={[S.datePill, { backgroundColor: theme.border }]}>
            <Text style={[S.dateText, { color: theme.subtext }]}>{item.label}</Text>
          </View>
          <View style={[S.dateLine, { backgroundColor: theme.border }]} />
        </View>
      );
    }

    const msg  = item.data;
    const isMe = msg.sender === username;

    if (msg.isSystem) {
      return (
        <View style={[S.systemBubble, { backgroundColor: theme.border }]}>
          <Text style={[S.systemText, { color: theme.subtext }]}>{msg.text}</Text>
        </View>
      );
    }

    // ✅ FIX: treat missing/null/undefined type as "text"
    const msgType = msg.type || "text";

    return (
      <View style={[S.row, isMe ? S.rowMe : S.rowOther]}>
        {!isMe && (
          <View style={[S.avatar, { backgroundColor: theme.primary + "20" }]}>
            <Text style={[S.avatarText, { color: theme.primary }]}>
              {msg.sender.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={[S.bubbleCol, isMe && { alignItems: "flex-end" }]}>
          {!isMe && (
            <Text style={[S.senderName, { color: theme.primary }]}>{msg.sender}</Text>
          )}

          <Pressable
            onLongPress={() => setReactionTarget(reactionTarget === msg._id ? null : msg._id)}
            delayLongPress={350}
          >
            <View style={[
              S.bubble,
              isMe
                ? { backgroundColor: theme.primary, borderBottomRightRadius: 4 }
                : { backgroundColor: theme.card, borderBottomLeftRadius: 4, borderWidth: 1, borderColor: theme.border },
            ]}>

              {/* ✅ TEXT — also catches old messages with no type */}
              {msgType === "text" && (
                <Text style={[S.msgText, { color: isMe ? "#fff" : theme.text }]}>
                  {msg.text}
                </Text>
              )}

              {/* IMAGE */}
              {msgType === "image" && msg.imageData ? (
                <Image source={{ uri: msg.imageData }} style={S.imgMsg} resizeMode="cover" />
              ) : null}

              {/* DOCUMENT */}
              {msgType === "document" && (
                <View style={S.docRow}>
                  <View style={[S.docIconBox, { backgroundColor: isMe ? "rgba(255,255,255,0.2)" : theme.background }]}>
                    <Ionicons name="document-text" size={26} color={isMe ? "#fff" : theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[S.docName, { color: isMe ? "#fff" : theme.text }]} numberOfLines={2}>
                      {msg.fileName}
                    </Text>
                    <Text style={[S.docSize, { color: isMe ? "rgba(255,255,255,0.65)" : theme.subtext }]}>
                      {msg.fileSize}
                    </Text>
                  </View>
                </View>
              )}

              {/* POLL */}
              {msgType === "poll" && msg.poll && (
                <View style={S.pollWrap}>
                  <Text style={[S.pollQ, { color: isMe ? "#fff" : theme.text }]}>
                    📊  {msg.poll.question}
                  </Text>
                  {msg.poll.options.map((opt, idx) => {
                    const total    = msg.poll!.options.reduce((s, o) => s + o.votes.length, 0);
                    const pct      = total > 0 ? Math.round((opt.votes.length / total) * 100) : 0;
                    const hasVoted = opt.votes.includes(username);
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => handleVote(msg._id, idx)}
                        style={[S.pollOpt, {
                          borderColor: isMe ? "rgba(255,255,255,0.35)" : theme.primary,
                          backgroundColor: hasVoted
                            ? (isMe ? "rgba(255,255,255,0.2)" : theme.primary + "18")
                            : "transparent",
                        }]}
                      >
                        <View style={[S.pollBar, {
                          width: `${pct}%`,
                          backgroundColor: isMe ? "rgba(255,255,255,0.12)" : theme.primary + "12",
                        }]} />
                        <Text style={[S.pollOptText, { color: isMe ? "#fff" : theme.text }]}>
                          {hasVoted ? "✓  " : ""}{opt.text}
                        </Text>
                        <Text style={[S.pollPct, { color: isMe ? "rgba(255,255,255,0.75)" : theme.subtext }]}>
                          {pct}%
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Text style={[S.pollTotal, { color: isMe ? "rgba(255,255,255,0.55)" : theme.subtext }]}>
                    {msg.poll.options.reduce((s, o) => s + o.votes.length, 0)} votes
                  </Text>
                </View>
              )}

              <Text style={[S.timeText, { color: isMe ? "rgba(255,255,255,0.55)" : theme.subtext }]}>
                {formatTime(msg.createdAt)}{isMe ? "  ✓✓" : ""}
              </Text>
            </View>
          </Pressable>

          {/* Emoji reaction picker */}
          {reactionTarget === msg._id && (
            <View style={[S.emojiPicker, {
              backgroundColor: theme.card,
              borderColor: theme.border,
              alignSelf: isMe ? "flex-end" : "flex-start",
            }]}>
              {REACTION_EMOJIS.map((e) => (
                <Pressable key={e} onPress={() => handleReaction(msg._id, e)} style={S.emojiBtn}>
                  <Text style={S.emojiChar}>{e}</Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Reaction chips */}
          {msg.reactions?.filter((r) => r.users.length > 0).length > 0 && (
            <View style={[S.reactRow, isMe && { justifyContent: "flex-end" }]}>
              {msg.reactions.filter((r) => r.users.length > 0).map((r) => (
                <Pressable
                  key={r.emoji}
                  onPress={() => handleReaction(msg._id, r.emoji)}
                  style={[S.reactChip, {
                    backgroundColor: r.users.includes(username) ? theme.primary + "20" : theme.border,
                    borderColor: r.users.includes(username) ? theme.primary : "transparent",
                  }]}
                >
                  <Text style={S.reactEmoji}>{r.emoji}</Text>
                  <Text style={[S.reactCount, { color: theme.text }]}>{r.users.length}</Text>
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
      <View style={[S.header, { borderBottomColor: theme.border }]}>
        <Ionicons name="information-circle-outline" size={24} color={theme.subtext} />
        <View style={{ alignItems: "center" }}>
          <Text style={[S.headerTitle, { color: theme.text }]}>{headerLabel}</Text>
          <Text style={[S.headerSub, { color: theme.primary }]}>
            {memberCount !== null ? `${memberCount} Member${memberCount !== 1 ? "s" : ""}` : "..."}
          </Text>
        </View>
        <Ionicons name="search-outline" size={24} color={theme.subtext} />
      </View>

      {/* MESSAGES */}
      {loadingHistory ? (
        <View style={S.center}><ActivityIndicator size="large" color={theme.primary} /></View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={listData}
          keyExtractor={(item) => item.type === "separator" ? item.key : item.data._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={S.center}>
              <Ionicons name="chatbubbles-outline" size={52} color={theme.border} />
              <Text style={[S.emptyText, { color: theme.subtext }]}>
                No messages yet.{"\n"}Be the first to say something! 👋
              </Text>
            </View>
          }
        />
      )}

      {/* INPUT BAR */}
      <View style={[S.inputBar, {
        backgroundColor: theme.card,
        borderTopColor: theme.border,
        paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
      }]}>
        <Pressable onPress={() => setShowAttachPanel(true)} style={S.attachBtn}>
          <Ionicons name="add-circle-outline" size={28} color={theme.primary} />
        </Pressable>
        <TextInput
          style={[S.input, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
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
          style={[S.sendBtn, { backgroundColor: text.trim() ? theme.primary : theme.border }]}
        >
          <Ionicons name="send" size={16} color="#fff" />
        </Pressable>
      </View>

      {/* ── ATTACHMENT PANEL (built-in bottom sheet) ── */}
      <Modal visible={showAttachPanel} transparent animationType="slide">
        <Pressable style={S.attachOverlay} onPress={() => setShowAttachPanel(false)}>
          <View style={[S.attachSheet, { backgroundColor: theme.card, paddingBottom: insets.bottom + 16 }]}>
            <View style={[S.attachHandle, { backgroundColor: theme.border }]} />
            <Text style={[S.attachTitle, { color: theme.subtext }]}>Share</Text>
            <View style={S.attachGrid}>
              {/* PHOTO */}
              <Pressable style={S.attachItem} onPress={handlePickImage}>
                <View style={[S.attachIconCircle, { backgroundColor: "#3B82F6" }]}>
                  <Ionicons name="image" size={26} color="#fff" />
                </View>
                <Text style={[S.attachLabel, { color: theme.text }]}>Photo</Text>
              </Pressable>

              {/* CAMERA */}
              <Pressable style={S.attachItem} onPress={async () => {
                setShowAttachPanel(false);
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== "granted") { Alert.alert("Permission needed", "Allow camera access."); return; }
                const result = await ImagePicker.launchCameraAsync({ quality: 0.5, base64: true });
                if (!result.canceled && result.assets[0]?.base64) {
                  socketRef.current?.emit("send-image", {
                    room, sender: username,
                    imageData: `data:image/jpeg;base64,${result.assets[0].base64}`,
                  });
                }
              }}>
                <View style={[S.attachIconCircle, { backgroundColor: "#8B5CF6" }]}>
                  <Ionicons name="camera" size={26} color="#fff" />
                </View>
                <Text style={[S.attachLabel, { color: theme.text }]}>Camera</Text>
              </Pressable>

              {/* DOCUMENT */}
              <Pressable style={S.attachItem} onPress={handlePickDocument}>
                <View style={[S.attachIconCircle, { backgroundColor: "#F59E0B" }]}>
                  <Ionicons name="document-text" size={26} color="#fff" />
                </View>
                <Text style={[S.attachLabel, { color: theme.text }]}>Document</Text>
              </Pressable>

              {/* POLL */}
              <Pressable style={S.attachItem} onPress={() => { setShowAttachPanel(false); setShowPollModal(true); }}>
                <View style={[S.attachIconCircle, { backgroundColor: theme.primary }]}>
                  <Ionicons name="bar-chart" size={26} color="#fff" />
                </View>
                <Text style={[S.attachLabel, { color: theme.text }]}>Poll</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* ── POLL CREATION MODAL ── */}
      <Modal visible={showPollModal} transparent animationType="slide">
        <View style={S.modalOverlay}>
          <View style={[S.modalBox, { backgroundColor: theme.card, paddingBottom: insets.bottom + 16 }]}>
            <View style={[S.attachHandle, { backgroundColor: theme.border, alignSelf: "center", marginBottom: 16 }]} />
            <View style={S.modalHeader}>
              <Text style={[S.modalTitle, { color: theme.text }]}>Create Poll</Text>
              <Pressable onPress={() => setShowPollModal(false)}>
                <Ionicons name="close-circle" size={26} color={theme.subtext} />
              </Pressable>
            </View>

            <TextInput
              style={[S.pollInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="Ask a question..."
              placeholderTextColor={theme.subtext}
              value={pollQuestion}
              onChangeText={setPollQuestion}
            />

            {pollOptions.map((opt, idx) => (
              <View key={idx} style={{ flexDirection: "row", alignItems: "center" }}>
                <TextInput
                  style={[S.pollInput, { flex: 1, backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
                  placeholder={`Option ${idx + 1}`}
                  placeholderTextColor={theme.subtext}
                  value={opt}
                  onChangeText={(val) => {
                    const u = [...pollOptions]; u[idx] = val; setPollOptions(u);
                  }}
                />
                {pollOptions.length > 2 && (
                  <Pressable onPress={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}>
                    <Ionicons name="remove-circle-outline" size={22} color="#DC2626" style={{ marginLeft: 8 }} />
                  </Pressable>
                )}
              </View>
            ))}

            {pollOptions.length < 5 && (
              <Pressable onPress={() => setPollOptions([...pollOptions, ""])} style={S.addOptBtn}>
                <Ionicons name="add-circle-outline" size={18} color={theme.primary} />
                <Text style={[S.addOptText, { color: theme.primary }]}>Add Option</Text>
              </Pressable>
            )}

            <Pressable onPress={handleSendPoll} style={[S.sendPollBtn, { backgroundColor: theme.primary }]}>
              <Text style={S.sendPollText}>Send Poll</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  headerSub:   { fontSize: 12, fontWeight: "600", marginTop: 1 },

  center:    { flex: 1, justifyContent: "center", alignItems: "center", paddingTop: 60 },
  emptyText: { textAlign: "center", marginTop: 14, fontSize: 14, lineHeight: 22 },

  dateSepRow: { flexDirection: "row", alignItems: "center", marginVertical: 14, paddingHorizontal: 4 },
  dateLine:   { flex: 1, height: 1 },
  datePill:   { paddingHorizontal: 12, paddingVertical: 3, borderRadius: 12, marginHorizontal: 8 },
  dateText:   { fontSize: 11, fontWeight: "600" },

  row:      { flexDirection: "row", marginBottom: 10, maxWidth: "82%" },
  rowMe:    { alignSelf: "flex-end",  flexDirection: "row-reverse" },
  rowOther: { alignSelf: "flex-start" },

  avatar:     { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 8, alignSelf: "flex-end" },
  avatarText: { fontSize: 13, fontWeight: "700" },
  bubbleCol:  { flexShrink: 1 },
  senderName: { fontSize: 11, fontWeight: "700", marginBottom: 3, marginLeft: 2 },

  bubble:   { paddingHorizontal: 13, paddingVertical: 9, borderRadius: 18 },
  msgText:  { fontSize: 14, lineHeight: 20 },
  timeText: { fontSize: 10, marginTop: 5, alignSelf: "flex-end" },

  imgMsg:     { width: 200, height: 200, borderRadius: 12 },
  docRow:     { flexDirection: "row", alignItems: "center", gap: 10, minWidth: 180 },
  docIconBox: { width: 44, height: 44, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  docName:    { fontSize: 13, fontWeight: "600" },
  docSize:    { fontSize: 11, marginTop: 2 },

  pollWrap:    { minWidth: 200 },
  pollQ:       { fontSize: 14, fontWeight: "700", marginBottom: 10, lineHeight: 20 },
  pollOpt:     { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, marginBottom: 7, flexDirection: "row", alignItems: "center", overflow: "hidden", position: "relative" },
  pollBar:     { position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 10 },
  pollOptText: { flex: 1, fontSize: 13, fontWeight: "500" },
  pollPct:     { fontSize: 12, fontWeight: "700" },
  pollTotal:   { fontSize: 11, marginTop: 6, textAlign: "right" },

  emojiPicker: { flexDirection: "row", borderRadius: 28, paddingHorizontal: 8, paddingVertical: 7, marginTop: 5, borderWidth: 1, gap: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  emojiBtn:    { padding: 5 },
  emojiChar:   { fontSize: 22 },

  reactRow:  { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 5 },
  reactChip: { flexDirection: "row", alignItems: "center", borderRadius: 12, paddingHorizontal: 7, paddingVertical: 3, borderWidth: 1, gap: 3 },
  reactEmoji: { fontSize: 13 },
  reactCount: { fontSize: 11, fontWeight: "700" },

  systemBubble: { alignSelf: "center", paddingHorizontal: 14, paddingVertical: 5, borderRadius: 20, marginVertical: 8 },
  systemText:   { fontSize: 12 },

  inputBar:  { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 10, paddingTop: 10, borderTopWidth: 1, gap: 8 },
  attachBtn: { paddingBottom: 9 },
  input:     { flex: 1, borderRadius: 22, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, maxHeight: 120 },
  sendBtn:   { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 1 },

  // Attachment sheet
  attachOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  attachSheet:   { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 20 },
  attachHandle:  { width: 36, height: 4, borderRadius: 2, alignSelf: "center", marginBottom: 8 },
  attachTitle:   { fontSize: 12, fontWeight: "600", textAlign: "center", marginBottom: 20, letterSpacing: 0.5, textTransform: "uppercase" },
  attachGrid:    { flexDirection: "row", justifyContent: "space-around", paddingBottom: 8 },
  attachItem:    { alignItems: "center", gap: 8 },
  attachIconCircle: { width: 58, height: 58, borderRadius: 29, justifyContent: "center", alignItems: "center" },
  attachLabel:   { fontSize: 12, fontWeight: "500" },

  // Poll modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" },
  modalBox:     { borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingHorizontal: 20 },
  modalHeader:  { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  modalTitle:   { fontSize: 18, fontWeight: "700" },
  pollInput:    { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, marginBottom: 10 },
  addOptBtn:    { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  addOptText:   { fontSize: 14, fontWeight: "600" },
  sendPollBtn:  { borderRadius: 14, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  sendPollText: { color: "#fff", fontWeight: "800", fontSize: 15 },
});
