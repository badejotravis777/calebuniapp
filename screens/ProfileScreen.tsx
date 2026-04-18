import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Theme } from "../utils/theme";
import { styles } from "./commonStyles";

type ProfileProps = {
  theme: Theme;
  setShowSettings: (val: boolean) => void;
};

const getInitials = (username: string): string => {
  if (!username) return "CU";
  const dotParts = username.split(".").map((s) => s.replace(/[^a-zA-Z]/g, ""));
  if (dotParts.length >= 2 && dotParts[0] && dotParts[1]) {
    return (dotParts[0][0] + dotParts[1][0]).toUpperCase();
  }
  const spaceParts = username.trim().split(" ").filter(Boolean);
  if (spaceParts.length >= 2) {
    return (spaceParts[0][0] + spaceParts[1][0]).toUpperCase();
  }
  const clean = username.replace(/[^a-zA-Z]/g, "");
  return clean.substring(0, 2).toUpperCase() || "CU";
};

const abbreviateDept = (dept: string): string => {
  if (!dept) return "N/A";
  const map: Record<string, string> = {
    "Computer Science": "CSC", Biochemistry: "BCH", Chemistry: "CHM",
    Mathematics: "MTH", Microbiology: "MCB",
    "Microbiology and Industrial Biotechnology": "MIB", Physics: "PHY",
    "Physics with Computational Modeling": "PCM",
    "Plant Science and Biotechnology": "PSB", Statistics: "STA",
    "Zoology and Aquaculture": "ZOA", Accounting: "ACC",
    "Banking and Finance": "BAF", "Business Administration": "BUS",
    Criminology: "CRM", Economics: "ECO", "Mass Communication": "MAC",
    "Peace Studies and Conflict Resolution": "PCR", "Political Science": "PSC",
    Psychology: "PSY", Taxation: "TAX", Architecture: "ARC", Building: "BLD",
    "Environmental Management and Toxicology": "EMT", "Estate Management": "ESM",
    "Quantity Surveying": "QUS", "Christian Religious Studies": "CRS",
    "English and Literary Studies": "ENG", "History and Diplomatic Studies": "HIS",
    Philosophy: "PHI", Law: "LAW", "Nursing Science": "NSC",
  };
  return map[dept] || dept.substring(0, 3).toUpperCase();
};

export default function ProfileScreen({ theme, setShowSettings }: ProfileProps) {
  const [role, setRole]             = useState<string>("student");
  const [username, setUsername]     = useState("");
  const [matricNo, setMatricNo]     = useState("");
  const [department, setDepartment] = useState("");
  const [level, setLevel]           = useState("");
  const [photoUri, setPhotoUri]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [storedRole, storedName, storedMatric, storedDept, storedLevel] =
          await Promise.all([
            AsyncStorage.getItem("role"),
            AsyncStorage.getItem("username"),
            AsyncStorage.getItem("matricNo"),
            AsyncStorage.getItem("department"),
            AsyncStorage.getItem("level"),
          ]);

        const resolvedUsername = storedName || "";
        if (storedRole)        setRole(storedRole);
        if (resolvedUsername)  setUsername(resolvedUsername);
        if (storedMatric)      setMatricNo(storedMatric);
        if (storedDept)        setDepartment(storedDept);
        if (storedLevel)       setLevel(storedLevel);

        // ✅ THE FIX: load photo using a key that includes the username.
        // "profilePhoto_b.travis7" is completely separate from "profilePhoto_biochemistry".
        // Switching accounts will never bleed one user's photo into another's.
        if (resolvedUsername) {
          const photo = await AsyncStorage.getItem(`profilePhoto_${resolvedUsername}`);
          if (photo) setPhotoUri(photo);
        }
      } catch (e) {
        console.error("Profile load error:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePickImage = async () => {
    if (!username) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please allow access to your photo library.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      const uri = result.assets[0].uri;
      setPhotoUri(uri);
      // ✅ Save under this specific user's key only
      await AsyncStorage.setItem(`profilePhoto_${username}`, uri);
    }
  };

  const handleRemovePhoto = async () => {
    if (!username) return;
    Alert.alert("Remove Photo", "Go back to your initials avatar?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setPhotoUri(null);
          await AsyncStorage.removeItem(`profilePhoto_${username}`);
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.screenContainer, { backgroundColor: theme.background, justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const initials  = getInitials(username);
  const deptAbbr  = abbreviateDept(department);
  const isStudent = role === "student";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.screenContainer, { backgroundColor: theme.background }]}
    >
      <View style={[styles.profileHeaderBg, { backgroundColor: theme.primary }]}>
        <View style={styles.profileTopNav}>
          <Text style={styles.headerTitleLight}>Profile</Text>
        </View>

        <View style={styles.profileCardPrimary}>
          <Pressable
            onPress={handlePickImage}
            onLongPress={photoUri ? handleRemovePhoto : undefined}
            style={localStyles.avatarWrapper}
          >
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={localStyles.avatarImage} />
            ) : (
              <View style={[localStyles.initialsCircle, { backgroundColor: "#fff" }]}>
                <Text style={[localStyles.initialsText, { color: theme.primary }]}>
                  {initials}
                </Text>
              </View>
            )}
            <View style={[localStyles.cameraBadge, { backgroundColor: theme.primary }]}>
              <Ionicons name="camera" size={12} color="#fff" />
            </View>
          </Pressable>

          <View style={styles.profileInfoCore}>
            <Text style={styles.profileName}>{username}</Text>
            <Text style={styles.profileId}>{matricNo}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {isStudent ? "Undergraduate Student" : "Senior Lecturer"}
              </Text>
            </View>
            <Text style={styles.universityText}>📍 Caleb University</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileContentWrapper}>
        <View style={[styles.statsBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {isStudent ? (
            <>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.text }]}>{level ? `${level}L` : "—"}</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Level</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.text }]}>{deptAbbr}</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Dept</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.text }]}>25/26</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Session</Text>
              </View>
            </>
          ) : (
            <>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.text }]}>4</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Courses</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.text }]}>520</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Students</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: theme.text }]}>{deptAbbr}</Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>Dept</Text>
              </View>
            </>
          )}
        </View>

        {isStudent && (
          <View style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Enrollment Info</Text>
            <View style={localStyles.enrollRow}>
              <View style={localStyles.enrollItem}>
                <Ionicons name="business-outline" size={18} color={theme.primary} />
                <View style={localStyles.enrollText}>
                  <Text style={[localStyles.enrollLabel, { color: theme.subtext }]}>Department</Text>
                  <Text style={[localStyles.enrollValue, { color: theme.text }]} numberOfLines={2}>
                    {department || "Not set"}
                  </Text>
                </View>
              </View>
              <View style={[localStyles.enrollDivider, { backgroundColor: theme.border }]} />
              <View style={localStyles.enrollItem}>
                <Ionicons name="school-outline" size={18} color={theme.primary} />
                <View style={localStyles.enrollText}>
                  <Text style={[localStyles.enrollLabel, { color: theme.subtext }]}>Level</Text>
                  <Text style={[localStyles.enrollValue, { color: theme.text }]}>
                    {level ? `${level} Level` : "Not set"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Academic Overview</Text>
            <Pressable style={[styles.actionButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.actionButtonText}>
                {isStudent ? "Mark Attendance" : "Generate Code"}
              </Text>
            </Pressable>
          </View>
          {isStudent ? (
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
                  <View style={[styles.dot, { backgroundColor: "#3B82F6" }]} />
                  <Text style={[styles.progressText, { color: theme.text }]}>Assignments Completed</Text>
                </View>
                <Text style={[styles.progressPercent, { color: theme.text }]}>14 / 16</Text>
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
              <Text style={[styles.menuItemText, { color: theme.text }]}>Achievements & Records</Text>
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

        <Text style={[localStyles.hint, { color: theme.subtext }]}>
          Tap your avatar to upload a photo · Long-press to remove it
        </Text>
      </View>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatarImage: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: "#fff" },
  initialsCircle: {
    width: 90, height: 90, borderRadius: 45,
    justifyContent: "center", alignItems: "center",
    borderWidth: 3, borderColor: "rgba(255,255,255,0.6)",
  },
  initialsText: { fontSize: 32, fontWeight: "900", letterSpacing: 1 },
  cameraBadge: {
    position: "absolute", bottom: 2, right: 2,
    width: 26, height: 26, borderRadius: 13,
    justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "#fff",
  },
  enrollRow: { flexDirection: "row", marginTop: 12 },
  enrollItem: { flex: 1, flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 4 },
  enrollText: { flex: 1 },
  enrollLabel: { fontSize: 11, marginBottom: 2 },
  enrollValue: { fontSize: 14, fontWeight: "700" },
  enrollDivider: { width: 1, marginHorizontal: 8, marginVertical: 4 },
  hint: { textAlign: "center", fontSize: 12, marginTop: 4, marginBottom: 30, opacity: 0.6 },
});
