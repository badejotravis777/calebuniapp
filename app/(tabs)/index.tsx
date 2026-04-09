import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { getTheme } from "../../utils/theme";
import { tabs } from "../../utils/data";
import { styles } from "../../screens/commonStyles";

import HomeScreen from "../../screens/HomeScreen";
import CoursesScreen from "../../screens/CoursesScreen";
import ScheduleScreen from "../../screens/ScheduleScreen";
import CommunityScreen from "../../screens/CommunityScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import SettingsScreen from "../../screens/SettingsScreen";

export default function App() {
  const [activeBottomTab, setActiveBottomTab] = useState<
    "Home" | "Courses" | "Schedule" | "Community" | "Profile"
  >("Profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const theme = getTheme(isDarkMode);

  if (showSettings) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <SettingsScreen
          onBack={() => setShowSettings(false)}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          theme={theme}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {activeBottomTab === "Home" && (
       <HomeScreen theme={theme} isDarkMode={isDarkMode} />
        )}
        {activeBottomTab === "Courses" && <CoursesScreen theme={theme} />}
        {activeBottomTab === "Schedule" && <ScheduleScreen theme={theme} />}
        {activeBottomTab === "Community" && <CommunityScreen theme={theme} />}
        {activeBottomTab === "Profile" && (
          <ProfileScreen theme={theme} setShowSettings={setShowSettings} />
        )}

        <View style={[styles.tabBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {tabs.map((item) => {
            const isActive = activeBottomTab === item.id;
            return (
              <Pressable
                key={item.id}
                style={styles.tabItem}
                onPress={() => setActiveBottomTab(item.id as any)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={isActive ? theme.primary : theme.subtext}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: theme.subtext },
                    isActive && { color: theme.primary, fontWeight: "700" },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}




