import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ImageBackground,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "../utils/theme";
import { homeCourses, newsData, eventsData } from "../utils/data";
import { universityData, triviaGames } from "../utils/dummyData";
import { styles } from "./commonStyles";

type HomeProps = { theme: Theme; isDarkMode: boolean };

// ─── HELPERS ──────────────────────────────────────────────────────────────────
// Same day-name logic used in ScheduleScreen so the two screens always agree.
const FULL_DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const getTodayDayName = (): string => {
  const dayIndex = new Date().getDay(); // 0 = Sun, 6 = Sat
  // On weekends default to Monday (no university classes)
  if (dayIndex === 0 || dayIndex === 6) return "Monday";
  return FULL_DAY_NAMES[dayIndex];
};

export default function HomeScreen({ theme, isDarkMode }: HomeProps) {
  const [activeContentTab, setActiveContentTab] = useState<"news" | "events">("events");
  const [loading, setLoading] = useState(true);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);
  const [triviaOption, setTriviaOption] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const dept = await AsyncStorage.getItem("department") || "Computer Science";
        const lvl  = await AsyncStorage.getItem("level")      || "100";

        const studentData = (universityData as any)[dept]?.[lvl];
        const fullSchedule: any[] = studentData?.schedule || [];

        // ── KEY FIX ──────────────────────────────────────────────────────────
        // Filter to only today's classes — mirrors ScheduleScreen's logic:
        //   filteredSchedule = mySchedule.filter(item => item.day === selectedDay)
        const todayName = getTodayDayName();
        const classesToday = fullSchedule.filter((item) => item.day === todayName);
        setTodayClasses(classesToday);
        // ─────────────────────────────────────────────────────────────────────
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} color={theme.primary} />;

  const currentTrivia = triviaGames[0];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
    >
      <View style={styles.headerContainer}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Home</Text>
        <Ionicons name="notifications-outline" size={24} color={theme.subtext} />
      </View>

      <FlatList
        data={homeCourses}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, marginBottom: 25 }}
        renderItem={({ item }) => (
          <View style={[styles.courseCardWrapper, { borderColor: theme.primary }]}>
            <ImageBackground
              source={{ uri: item.image }}
              style={styles.courseImage}
              imageStyle={{ borderRadius: 12 }}
            >
              <View style={styles.courseOverlay}>
                <Text style={styles.courseText}>{item.title}</Text>
              </View>
            </ImageBackground>
          </View>
        )}
      />

      {/* Section header — label changes based on whether there are classes today */}
      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {todayClasses.length > 0
            ? `Today's Classes (${getTodayDayName()})`
            : "Free Time Fun"}
        </Text>
        {todayClasses.length > 0 && (
          <View style={styles.linkRow}>
            <Text style={[styles.linkText, { color: theme.primary }]}>Open schedule</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.primary} />
          </View>
        )}
      </View>

      {/* Classes today — or trivia if none */}
      {todayClasses.length > 0 ? (
        todayClasses.map((cls, index) => (
          <View
            key={cls.id || index}
            style={[styles.classCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            <Text style={[styles.classTitle, { color: theme.text }]}>{cls.title}</Text>
            <View style={styles.classDetailsRow}>
              <View style={styles.classDetailItem}>
                <Ionicons name="time-outline" size={14} color={theme.subtext} />
                <Text style={[styles.classSubText, { color: theme.subtext }]}>{cls.time}</Text>
              </View>
              <View style={styles.classDetailItem}>
                <Ionicons name="location-outline" size={14} color={theme.subtext} />
                <Text style={[styles.classSubText, { color: theme.subtext }]}>{cls.location}</Text>
              </View>
            </View>
            {cls.lecturer && (
              <Text style={{ color: theme.subtext, fontSize: 12, fontWeight: "500" }}>
                {cls.lecturer}
              </Text>
            )}
          </View>
        ))
      ) : (
        <View style={[styles.classCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[{ color: theme.text, marginBottom: 15, fontSize: 16, fontWeight: "bold" }]}>
            🎮 {currentTrivia.question}
          </Text>
          {currentTrivia.options.map((opt: string, idx: number) => (
            <Pressable
              key={idx}
              onPress={() => setTriviaOption(opt)}
              style={{
                padding: 15,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: triviaOption === opt ? theme.primary : theme.border,
                backgroundColor:
                  triviaOption === opt ? theme.primary + "20" : "transparent",
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: triviaOption === opt ? theme.primary : theme.text,
                  fontWeight: "600",
                }}
              >
                {opt}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* News / Events tabs — unchanged */}
      <View style={styles.tabsContainer}>
        <Pressable onPress={() => setActiveContentTab("news")} style={styles.tabButton}>
          <Text
            style={[
              styles.tabText,
              { color: theme.text },
              activeContentTab === "news" && { color: theme.primary, fontWeight: "700" },
            ]}
          >
            News
          </Text>
          {activeContentTab === "news" && (
            <View style={[styles.activeTabIndicator, { backgroundColor: theme.primary }]} />
          )}
        </Pressable>
        <Pressable onPress={() => setActiveContentTab("events")} style={styles.tabButton}>
          <Text
            style={[
              styles.tabText,
              { color: theme.text },
              activeContentTab === "events" && { color: theme.primary, fontWeight: "700" },
            ]}
          >
            Events
          </Text>
          {activeContentTab === "events" && (
            <View style={[styles.activeTabIndicator, { backgroundColor: theme.primary }]} />
          )}
        </Pressable>
      </View>

      <View style={[styles.contentWrapper, { backgroundColor: theme.background }]}>
        {activeContentTab === "news" ? (
          newsData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.newsCard,
                { backgroundColor: theme.card, shadowColor: isDarkMode ? "#FFF" : "#000" },
              ]}
            >
              <View style={styles.newsHeader}>
                <Text style={[styles.newsTitle, { color: theme.text }]}>{item.title}</Text>
                <View style={[styles.badge, { backgroundColor: item.badgeBg }]}>
                  <Text style={[styles.badgeText, { color: item.badgeText }]}>{item.date}</Text>
                </View>
              </View>
              <Text
                style={{ color: theme.subtext, fontSize: 13, lineHeight: 20 }}
                numberOfLines={4}
              >
                {item.desc}
              </Text>
            </View>
          ))
        ) : (
          eventsData.map((item) => (
            <View
              key={item.id}
              style={[
                styles.eventCard,
                { backgroundColor: theme.card, shadowColor: isDarkMode ? "#FFF" : "#000" },
              ]}
            >
              <View style={styles.eventInfo}>
                <Text style={[styles.eventTitle, { color: theme.text }]}>{item.title}</Text>
                <Text style={[styles.eventSubText, { color: theme.subtext }]}>{item.location}</Text>
                <Text style={[styles.eventSubText, { color: theme.subtext }]}>{item.date}</Text>
              </View>
              <Image source={{ uri: item.image }} style={styles.eventImage} />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
