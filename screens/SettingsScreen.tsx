import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../utils/theme";
import { styles } from "./commonStyles";

type SettingsProps = {
  onBack: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
};

export default function SettingsScreen({
  onBack,
  isDarkMode,
  toggleDarkMode,
  theme,
}: SettingsProps) {
  const [notifications, setNotifications] = useState(true);

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <Pressable onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
        <Text style={[styles.settingsSectionTitle, { color: theme.primary }]}>PREFERENCES</Text>

        <View style={[styles.settingsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.settingsRow}>
            <View style={styles.settingsLabelGroup}>
              <Ionicons name="moon-outline" size={20} color={theme.text} />
              <Text style={[styles.settingsLabel, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: "#D1D5DB", true: "#0B6E4F" }}
            />
          </View>
          <View style={[styles.settingsDivider, { backgroundColor: theme.border }]} />
          <View style={styles.settingsRow}>
            <View style={styles.settingsLabelGroup}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              <Text style={[styles.settingsLabel, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#D1D5DB", true: "#0B6E4F" }}
            />
          </View>
        </View>

        <Text style={[styles.settingsSectionTitle, { color: theme.primary, marginTop: 25 }]}>
          SECURITY
        </Text>
        <View style={[styles.settingsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Pressable style={styles.settingsRow}>
            <View style={styles.settingsLabelGroup}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.text} />
              <Text style={[styles.settingsLabel, { color: theme.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>
        </View>

        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}