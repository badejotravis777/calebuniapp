import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "../utils/theme";
import { styles } from "./commonStyles";

type ProfileProps = {
  theme: Theme;
  setShowSettings: (val: boolean) => void;
};

export default function ProfileScreen({ theme, setShowSettings }: ProfileProps) {
  const [role, setRole] = useState<string>("student");
  const [userData, setUserData] = useState({ name: "", id: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const storedRole = await AsyncStorage.getItem("role");
        const storedName = await AsyncStorage.getItem("username");
        const storedId = await AsyncStorage.getItem("matricNo");

        if (storedRole) setRole(storedRole);
        
        setUserData({
          name: storedName || (storedRole === "staff" ? "Staff Member" : "Student"),
          id: storedId || (storedRole === "staff" ? "STAFF ID: N/A" : "MATRIC: N/A"),
        });
      } catch (error) {
        console.error("Failed to load user profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Merge real data from AsyncStorage with your UI mock structure
  const profileConfig =
    role === "student"
      ? {
          roleLabel: "Undergraduate Student",
          avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80",
          university: "Caleb University", // Updated from UNILAG for accuracy
          stats: {
            label1: "Credits",
            val1: "50/120",
            label2: "CGPA",
            val2: "4.25",
            label3: "Level",
            val3: "200",
          },
        }
      : {
          roleLabel: "Senior Lecturer",
          avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80",
          university: "Caleb University",
          stats: {
            label1: "Courses",
            val1: "4",
            label2: "Students",
            val2: "520",
            label3: "Dept",
            val3: "CSC",
          },
        };

  if (loading) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: theme.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
    >
      <View style={[styles.profileHeaderBg, { backgroundColor: theme.primary }]}>
        <View style={styles.profileTopNav}>
          <Text style={styles.headerTitleLight}>Profile</Text>
          {/* Toggle removed entirely */}
        </View>

        <View style={styles.profileCardPrimary}>
          <Image source={{ uri: profileConfig.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfoCore}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileId}>{userData.id}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{profileConfig.roleLabel}</Text>
            </View>
            <Text style={styles.universityText}>📍 {profileConfig.university}</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileContentWrapper}>
        <View style={[styles.statsBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>{profileConfig.stats.val1}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{profileConfig.stats.label1}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>{profileConfig.stats.val2}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{profileConfig.stats.label2}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>{profileConfig.stats.val3}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{profileConfig.stats.label3}</Text>
          </View>
        </View>

        <View style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Academic Overview</Text>
            <Pressable style={[styles.actionButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.actionButtonText}>
                {role === "student" ? "Mark Attendance" : "Generate Code"}
              </Text>
            </Pressable>
          </View>

          {role === "student" ? (
            <View style={styles.progressSection}>
              <View style={styles.progressRow}>
                <View style={styles.progressInfo}>
                  <View style={[styles.dot, { backgroundColor: "#F59E0B" }]} />
                  <Text style={[styles.progressText, { color: theme.text }]}>Attendance Rate</Text>
                </View>
                <Text style={[styles.progressPercent, { color: theme.text }]}>92%</Text>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressInfo}>
                  <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
                  <Text style={[styles.progressText, { color: theme.text }]}>
                    Continuous Assessment
                  </Text>
                </View>
                <Text style={[styles.progressPercent, { color: theme.text }]}>75%</Text>
              </View>
            </View>
          ) : (
            <View style={styles.progressSection}>
              <Text style={[styles.staffPromptText, { color: theme.subtext }]}>
                You have 2 active classes today. Generate the rolling code to begin marking
                attendance for CSC 201.
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Dashboard</Text>

          <Pressable style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                <Ionicons name="settings-outline" size={20} color={theme.primary} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                <Ionicons name="ribbon-outline" size={20} color="#DB2777" />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>
                Achievements & Records
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>

          <Pressable style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#16A34A" />
              </View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}