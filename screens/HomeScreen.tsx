import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ImageBackground,
  Pressable,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../utils/theme";
import { homeCourses, newsData, eventsData } from "../utils/data";
import { styles } from "./commonStyles";

type HomeProps = { theme: Theme; isDarkMode: boolean };

export default function HomeScreen({ theme, isDarkMode }: HomeProps) {
  const [activeContentTab, setActiveContentTab] = useState<"news" | "events">("events");

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

      <View style={styles.sectionRow}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Todays Classes</Text>
        <View style={styles.linkRow}>
          <Text style={[styles.linkText, { color: theme.primary }]}>Open schedule</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.primary} />
        </View>
      </View>

      <View style={[styles.classCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.classTitle, { color: theme.text }]}>Digital Thinking</Text>
        <View style={styles.classDetailsRow}>
          <View style={styles.classDetailItem}>
            <Ionicons name="time-outline" size={14} color={theme.subtext} />
            <Text style={[styles.classSubText, { color: theme.subtext }]}>09:00 - 11:00</Text>
          </View>
          <View style={styles.classDetailItem}>
            <Ionicons name="location-outline" size={14} color={theme.subtext} />
            <Text style={[styles.classSubText, { color: theme.subtext }]}>Main auditorium</Text>
          </View>
        </View>
        <Text style={{ color: theme.subtext, fontSize: 12, fontWeight: "500" }}>
          Dr. Ibrahim Babatunde
        </Text>
      </View>

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
              <Text style={{ color: theme.subtext, fontSize: 13, lineHeight: 20 }} numberOfLines={4}>
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