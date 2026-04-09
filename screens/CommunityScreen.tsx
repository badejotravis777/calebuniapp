import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../utils/theme";
import { mockMessages, Message } from "../utils/data";
import { styles } from "./commonStyles";

type StandardProps = { theme: Theme };

export default function CommunityScreen({ theme }: StandardProps) {
  const [message, setMessage] = useState("");

  const renderMessage = ({ item }: { item: Message }) => {
    if (item.isSystem) {
      return (
        <View style={[styles.systemMessageContainer, { backgroundColor: theme.border }]}>
          <Text style={[styles.systemMessageText, { color: theme.text }]}>{item.text}</Text>
        </View>
      );
    }

    const isMe = item.isMe;
    return (
      <View
        style={[
          styles.messageWrapper,
          isMe ? styles.messageWrapperMe : styles.messageWrapperOther,
        ]}
      >
        {!isMe && (
          <View style={[styles.avatarCircle, { backgroundColor: theme.border }]}>
            <Text style={[styles.avatarText, { color: theme.text }]}>
              {item.sender.charAt(0)}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isMe
              ? { backgroundColor: theme.primary, borderBottomRightRadius: 4 }
              : { backgroundColor: theme.chatOther, borderBottomLeftRadius: 4 },
          ]}
        >
          {!isMe && <Text style={[styles.messageSender, { color: theme.primary }]}>{item.sender}</Text>}
          <Text style={[styles.messageText, isMe ? { color: "#FFFFFF" } : { color: theme.text }]}>
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isMe ? { color: "rgba(255,255,255,0.7)" } : { color: theme.subtext },
            ]}
          >
            {item.time}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.headerContainer}>
        <Ionicons name="information-circle-outline" size={24} color={theme.subtext} />
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>CS - 100 Level</Text>
          <Text style={[styles.headerSubtitle, { color: theme.primary }]}>245 Members</Text>
        </View>
        <Ionicons name="search-outline" size={24} color={theme.subtext} />
      </View>

      <View style={styles.chatContainer}>
        <FlatList
          data={mockMessages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.chatListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Pressable style={styles.attachButton}>
          <Ionicons name="add-outline" size={24} color={theme.subtext} />
        </Pressable>

        <TextInput
          style={[styles.chatInput, { backgroundColor: theme.input, color: theme.text }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.subtext}
          value={message}
          onChangeText={setMessage}
          multiline
        />

        <Pressable style={[styles.sendButton, { backgroundColor: theme.primary }]}>
          <Ionicons name="send" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}