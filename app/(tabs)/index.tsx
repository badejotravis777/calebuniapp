import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  ImageBackground,
  SafeAreaView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

// ==============================
// TYPES & INTERFACES
// ==============================
type Theme = {
  background: string;
  card: string;
  text: string;
  subtext: string;
  border: string;
  primary: string;
  input: string;
  chatOther: string;
};

// Extracts the exact valid icon names from Ionicons
type IconName = React.ComponentProps<typeof Ionicons>["name"];

type TabItem = {
  id: string;
  icon: IconName;
  label: string;
};

type Message = {
  id: string;
  sender: string;
  text: string;
  time: string;
  isSystem?: boolean;
  isMe?: boolean;
};

// ==============================
// THEME CONFIGURATION
// ==============================
const getTheme = (isDark: boolean): Theme => ({
  background: isDark ? "#121212" : "#F8FAFC",
  card: isDark ? "#1E1E1E" : "#FFFFFF",
  text: isDark ? "#FFFFFF" : "#111111",
  subtext: isDark ? "#A1A1AA" : "#71717A",
  border: isDark ? "#333333" : "#E5E7EB",
  primary: "#0B6E4F",
  input: isDark ? "#2A2A2A" : "#F4F4F5",
  chatOther: isDark ? "#2A2A2A" : "#FFFFFF",
});

// ==============================
// MOCK DATA
// ==============================
const tabs: TabItem[] = [
  { id: "Home", icon: "home-outline", label: "Home" },
  { id: "Courses", icon: "folder-outline", label: "Courses" },
  { id: "Schedule", icon: "calendar-outline", label: "Schedule" },
  { id: "Community", icon: "people-outline", label: "Community" },
  { id: "Profile", icon: "person-outline", label: "Profile" },
];

const homeCourses = [
  { id: "1", title: "Computer\nScience", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=300&q=80" },
  { id: "2", title: "Mathematics", image: "https://images.unsplash.com/photo-1632516643720-e7f5d7d6eca1?auto=format&fit=crop&w=300&q=80" },
  { id: "3", title: "History &\nGeography", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=300&q=80" },
];

const newsData = [
  { id: "1", title: "ASUU Update", desc: "The Academic Staff Union of Universities has released the new calendar.", date: "May 01", badgeBg: "#E0F2FE", badgeText: "#0284C7" },
  { id: "2", title: "NUC Directive", desc: "The National Universities Commission has issued a new directive on grading.", date: "June 07", badgeBg: "#DCFCE7", badgeText: "#16A34A" },
];

const eventsData = [
  { id: "1", title: "Tech Fest Lagos", location: "Lagos", date: "Wed, 28 Feb 2026", image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=300&q=80" },
];

const allCoursesList = [
  "Digital Marketing", "Design Learning", "Artificial Intelligence", "Software Management",
  "Digital Logical Thoughts", "Web 3.0", "Calculus"
];

const scheduleDays = [
  { day: "S", date: "04" }, { day: "S", date: "05" }, { day: "M", date: "06", active: true },
  { day: "T", date: "07" }, { day: "W", date: "08" }, { day: "T", date: "09" }, { day: "F", date: "10" }
];

const scheduleItems = [
  {
    id: "1", startTime: "11:35", endTime: "13:05", title: "Computer Science",
    subtitle: "Lecture 2: Data management", room: "Room 2 - 124", instructor: "Dr. Adeola",
    bg: "#8DF08B", textPrimary: "#111", textSecondary: "#111", iconColor: "#111"
  },
  {
    id: "2", startTime: "13:15", endTime: "14:45", title: "Digital Marketing",
    subtitle: "Lecture 3: Shopify Creation", room: "Room 3A - G4", instructor: "Mrs. Nwachukwu",
    bg: "#D9FA5A", textPrimary: "#E11D48", textSecondary: "#E11D48", iconColor: "#E11D48"
  }
];

const mockMessages: Message[] = [
  { id: "1", sender: "System", text: "Welcome to the CS - 100 Level group chat!", time: "09:00 AM", isSystem: true },
  { id: "2", sender: "Chidi", text: "Hey guys! Has anyone started the programming assignment?", time: "10:15 AM", isMe: false },
  { id: "4", sender: "Me", text: "I'm stuck on question 3. Anyone available to discuss it later?", time: "10:25 AM", isMe: true },
];

// ==============================
// SCREENS
// ==============================

type SettingsProps = {
  onBack: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  theme: Theme;
};

const SettingsScreen = ({ onBack, isDarkMode, toggleDarkMode, theme }: SettingsProps) => {
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
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} trackColor={{ false: "#D1D5DB", true: "#0B6E4F" }} />
          </View>
          <View style={[styles.settingsDivider, { backgroundColor: theme.border }]} />
          <View style={styles.settingsRow}>
            <View style={styles.settingsLabelGroup}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
              <Text style={[styles.settingsLabel, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: "#D1D5DB", true: "#0B6E4F" }} />
          </View>
        </View>

        <Text style={[styles.settingsSectionTitle, { color: theme.primary, marginTop: 25 }]}>SECURITY</Text>
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
};

type HomeProps = { theme: Theme; isDarkMode: boolean };

const HomeScreen = ({ theme, isDarkMode }: HomeProps) => {
  const [activeContentTab, setActiveContentTab] = useState("events");
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Home</Text>
        <Ionicons name="notifications-outline" size={24} color={theme.subtext} />
      </View>
      <FlatList
        data={homeCourses} horizontal showsHorizontalScrollIndicator={false} keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 10, marginBottom: 25 }}
        renderItem={({ item }) => (
          <View style={[styles.courseCardWrapper, { borderColor: theme.primary }]}>
            <ImageBackground source={{ uri: item.image }} style={styles.courseImage} imageStyle={{ borderRadius: 12 }}>
              <View style={styles.courseOverlay}><Text style={styles.courseText}>{item.title}</Text></View>
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
          <View style={styles.classDetailItem}><Ionicons name="time-outline" size={14} color={theme.subtext} /><Text style={[styles.classSubText, { color: theme.subtext }]}>09:00 - 11:00</Text></View>
          <View style={styles.classDetailItem}><Ionicons name="location-outline" size={14} color={theme.subtext} /><Text style={[styles.classSubText, { color: theme.subtext }]}>Main auditorium</Text></View>
        </View>
        <Text style={{ color: theme.subtext, fontSize: 12, fontWeight: "500" }}>Dr. Ibrahim Babatunde</Text>
      </View>
      <View style={styles.tabsContainer}>
        <Pressable onPress={() => setActiveContentTab("news")} style={styles.tabButton}>
          <Text style={[styles.tabText, { color: theme.text }, activeContentTab === "news" && { color: theme.primary, fontWeight: "700" }]}>News</Text>
          {activeContentTab === "news" && <View style={[styles.activeTabIndicator, { backgroundColor: theme.primary }]} />}
        </Pressable>
        <Pressable onPress={() => setActiveContentTab("events")} style={styles.tabButton}>
          <Text style={[styles.tabText, { color: theme.text }, activeContentTab === "events" && { color: theme.primary, fontWeight: "700" }]}>Events</Text>
          {activeContentTab === "events" && <View style={[styles.activeTabIndicator, { backgroundColor: theme.primary }]} />}
        </Pressable>
      </View>
      <View style={[styles.contentWrapper, { backgroundColor: theme.background }]}>
        {activeContentTab === "news" ? (
          newsData.map((item) => (
            <View key={item.id} style={[styles.newsCard, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#FFF" : "#000" }]}>
              <View style={styles.newsHeader}>
                <Text style={[styles.newsTitle, { color: theme.text }]}>{item.title}</Text>
                <View style={[styles.badge, { backgroundColor: item.badgeBg }]}><Text style={[styles.badgeText, { color: item.badgeText }]}>{item.date}</Text></View>
              </View>
              <Text style={{ color: theme.subtext, fontSize: 13, lineHeight: 20 }} numberOfLines={4}>{item.desc}</Text>
            </View>
          ))
        ) : (
          eventsData.map((item) => (
            <View key={item.id} style={[styles.eventCard, { backgroundColor: theme.card, shadowColor: isDarkMode ? "#FFF" : "#000" }]}>
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
};

type StandardProps = { theme: Theme };

const CoursesScreen = ({ theme }: StandardProps) => {
  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Courses</Text>
        <Ionicons name="notifications-outline" size={24} color={theme.subtext} />
      </View>
      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput style={[styles.searchInput, { color: theme.text }]} placeholder="Search" placeholderTextColor={theme.subtext} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.coursesListWrapper, { backgroundColor: theme.background }]}>
        {allCoursesList.map((course, index) => (
          <Pressable key={index} style={[styles.courseListItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.courseListTitle, { color: theme.text }]}>{course}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const ScheduleScreen = ({ theme }: StandardProps) => {
  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Schedule</Text>
        <Ionicons name="notifications-outline" size={24} color={theme.subtext} />
      </View>
      <View style={styles.dateHeaderRow}>
        <Text style={[styles.largeDateText, { color: theme.text }]}>06</Text>
        <View style={styles.monthYearCol}>
          <Text style={[styles.monthText, { color: theme.subtext }]}>Mon</Text>
          <Text style={[styles.yearText, { color: theme.subtext }]}>July, 2026</Text>
        </View>
      </View>
      <View style={[styles.scheduleContentWrapper, { backgroundColor: theme.background }]}>
        <View style={styles.daysRow}>
          {scheduleDays.map((item, index) => (
            <View key={index} style={[styles.dayItem, item.active && { backgroundColor: theme.primary }]}>
              <Text style={[styles.dayName, { color: theme.subtext }, item.active && styles.dayTextActive]}>{item.day}</Text>
              <Text style={[styles.dayNumber, { color: theme.text }, item.active && styles.dayTextActive]}>{item.date}</Text>
            </View>
          ))}
        </View>
        <View style={styles.timelineHeader}>
          <Text style={[styles.timelineHeaderText, { color: theme.subtext }]}>Time</Text>
          <Text style={[styles.timelineHeaderText, { color: theme.subtext, marginLeft: 25 }]}>Courses</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {scheduleItems.map((item) => (
            <View key={item.id} style={styles.timelineRow}>
              <View style={styles.timeColumn}>
                <Text style={[styles.startTimeText, { color: theme.text }]}>{item.startTime}</Text>
                <Text style={[styles.endTimeText, { color: theme.subtext }]}>{item.endTime}</Text>
              </View>
              <View style={[styles.timelineDivider, { backgroundColor: theme.border }]} />
              <View style={[styles.scheduleCard, { backgroundColor: item.bg }]}>
                <View style={styles.scheduleCardTop}>
                  <View>
                    <Text style={[styles.scheduleCardTitle, { color: item.textPrimary }]}>{item.title}</Text>
                    <Text style={[styles.scheduleCardSubtitle, { color: item.textSecondary }]}>{item.subtitle}</Text>
                  </View>
                  <Ionicons name="ellipsis-vertical" size={20} color={item.iconColor} />
                </View>
                <View style={styles.scheduleCardBottom}>
                  <View>
                    <View style={styles.scheduleInfoRow}>
                      <Ionicons name="location-outline" size={14} color={item.textSecondary} />
                      <Text style={[styles.scheduleInfoText, { color: item.textSecondary }]}>{item.room}</Text>
                    </View>
                    <View style={styles.scheduleInfoRow}>
                      <Ionicons name="person-circle-outline" size={14} color={item.textSecondary} />
                      <Text style={[styles.scheduleInfoText, { color: item.textSecondary }]}>{item.instructor}</Text>
                    </View>
                  </View>
                  <Ionicons name="notifications-outline" size={20} color={item.iconColor} style={{ alignSelf: "flex-end" }} />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const CommunityScreen = ({ theme }: StandardProps) => {
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
      <View style={[styles.messageWrapper, isMe ? styles.messageWrapperMe : styles.messageWrapperOther]}>
        {!isMe && (
          <View style={[styles.avatarCircle, { backgroundColor: theme.border }]}>
            <Text style={[styles.avatarText, { color: theme.text }]}>{item.sender.charAt(0)}</Text>
          </View>
        )}
        <View style={[styles.messageBubble, isMe ? { backgroundColor: theme.primary, borderBottomRightRadius: 4 } : { backgroundColor: theme.chatOther, borderBottomLeftRadius: 4 }]}>
          {!isMe && <Text style={[styles.messageSender, { color: theme.primary }]}>{item.sender}</Text>}
          <Text style={[styles.messageText, isMe ? { color: "#FFFFFF" } : { color: theme.text }]}>{item.text}</Text>
          <Text style={[styles.messageTime, isMe ? { color: "rgba(255,255,255,0.7)" } : { color: theme.subtext }]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={[styles.screenContainer, { backgroundColor: theme.background }]} behavior={Platform.OS === "ios" ? "padding" : undefined}>
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
          data={mockMessages} keyExtractor={(item) => item.id} renderItem={renderMessage}
          contentContainerStyle={styles.chatListContent} showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Pressable style={styles.attachButton}><Ionicons name="add-outline" size={24} color={theme.subtext} /></Pressable>
        <TextInput
          style={[styles.chatInput, { backgroundColor: theme.input, color: theme.text }]}
          placeholder="Type a message..." placeholderTextColor={theme.subtext}
          value={message} onChangeText={setMessage} multiline
        />
        <Pressable style={[styles.sendButton, { backgroundColor: theme.primary }]}><Ionicons name="send" size={18} color="#FFFFFF" /></Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

type ProfileProps = {
  theme: Theme;
  setShowSettings: (val: boolean) => void;
};

const ProfileScreen = ({ theme, setShowSettings }: ProfileProps) => {
  const [userRole, setUserRole] = useState("student"); 
  const user = {
    name: userRole === "student" ? "Oluwaseun Adebayo" : "Dr. Ibrahim Babatunde",
    id: userRole === "student" ? "MATRIC: 23/CSC/040" : "STAFF ID: 0924-CS",
    roleLabel: userRole === "student" ? "Undergraduate Student" : "Senior Lecturer",
    avatar: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&w=150&q=80",
    university: "University of Lagos (UNILAG)",
    stats: userRole === "student" 
      ? { label1: "Credits", val1: "50/120", label2: "CGPA", val2: "4.25", label3: "Level", val3: "200" }
      : { label1: "Courses", val1: "4", label2: "Students", val2: "520", label3: "Dept", val3: "CSC" }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={[styles.profileHeaderBg, { backgroundColor: theme.primary }]}>
        <View style={styles.profileTopNav}>
          <Text style={styles.headerTitleLight}>Profile</Text>
          <Pressable onPress={() => setUserRole(userRole === "student" ? "staff" : "student")}>
             <Ionicons name="swap-horizontal" size={24} color="#FFF" />
          </Pressable>
        </View>

        <View style={styles.profileCardPrimary}>
          <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
          <View style={styles.profileInfoCore}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileId}>{user.id}</Text>
            <View style={styles.roleBadge}><Text style={styles.roleBadgeText}>{user.roleLabel}</Text></View>
            <Text style={styles.universityText}>📍 {user.university}</Text>
          </View>
        </View>
      </View>

      <View style={styles.profileContentWrapper}>
        <View style={[styles.statsBanner, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>{user.stats.val1}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{user.stats.label1}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>{user.stats.val2}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{user.stats.label2}</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, { color: theme.text }]}>{user.stats.val3}</Text>
            <Text style={[styles.statLabel, { color: theme.subtext }]}>{user.stats.label3}</Text>
          </View>
        </View>

        <View style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Academic Overview</Text>
            <Pressable style={[styles.actionButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.actionButtonText}>{userRole === "student" ? "Mark Attendance" : "Generate Code"}</Text>
            </Pressable>
          </View>
          {userRole === "student" ? (
             <View style={styles.progressSection}>
               <View style={styles.progressRow}>
                 <View style={styles.progressInfo}><View style={[styles.dot, { backgroundColor: "#F59E0B" }]} /><Text style={[styles.progressText, { color: theme.text }]}>Attendance Rate</Text></View>
                 <Text style={[styles.progressPercent, { color: theme.text }]}>92%</Text>
               </View>
               <View style={styles.progressRow}>
                 <View style={styles.progressInfo}><View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} /><Text style={[styles.progressText, { color: theme.text }]}>Continuous Assessment</Text></View>
                 <Text style={[styles.progressPercent, { color: theme.text }]}>75%</Text>
               </View>
             </View>
          ) : (
             <View style={styles.progressSection}>
               <Text style={[styles.staffPromptText, { color: theme.subtext }]}>You have 2 active classes today. Generate the rolling code to begin marking attendance for CSC 201.</Text>
             </View>
          )}
        </View>

        <View style={[styles.premiumCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.cardTitle, { color: theme.text }]}>Dashboard</Text>
          
          <Pressable style={styles.menuItem} onPress={() => setShowSettings(true)}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}><Ionicons name="settings-outline" size={20} color={theme.primary} /></View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Account Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>

          <Pressable style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}><Ionicons name="ribbon-outline" size={20} color="#DB2777" /></View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Achievements & Records</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>

          <Pressable style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconBox, { backgroundColor: theme.background }]}><Ionicons name="shield-checkmark-outline" size={20} color="#16A34A" /></View>
              <Text style={[styles.menuItemText, { color: theme.text }]}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

// ==============================
// MAIN APP COMPONENT
// ==============================
export default function App() {
  const [activeBottomTab, setActiveBottomTab] = useState("Profile");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const theme = getTheme(isDarkMode);

  if (showSettings) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <SettingsScreen onBack={() => setShowSettings(false)} isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(!isDarkMode)} theme={theme} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {activeBottomTab === "Home" && <HomeScreen theme={theme} isDarkMode={isDarkMode} />}
        {activeBottomTab === "Courses" && <CoursesScreen theme={theme} />}
        {activeBottomTab === "Schedule" && <ScheduleScreen theme={theme} />}
        {activeBottomTab === "Community" && <CommunityScreen theme={theme} />}
        {activeBottomTab === "Profile" && <ProfileScreen theme={theme} setShowSettings={setShowSettings} />}

        <View style={[styles.tabBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {tabs.map((item) => {
            const isActive = activeBottomTab === item.id;
            return (
              <Pressable key={item.id} style={styles.tabItem} onPress={() => setActiveBottomTab(item.id)}>
                <Ionicons name={item.icon} size={24} color={isActive ? theme.primary : theme.subtext} />
                <Text style={[styles.tabLabel, isActive && { color: theme.primary, fontWeight: "700" }, { color: theme.subtext }]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

// ==============================
// STYLES
// ==============================
const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  screenContainer: { flex: 1 },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginTop: 15, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "700" },
  headerSubtitle: { fontSize: 12, fontWeight: "600", marginTop: 2 },

  // --- HOME SCREEN ---
  courseCardWrapper: { width: 95, height: 110, borderRadius: 14, marginRight: 15, borderWidth: 2, padding: 2 },
  courseImage: { flex: 1, justifyContent: "flex-end" },
  courseOverlay: { backgroundColor: "rgba(0,0,0,0.3)", padding: 8, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  courseText: { color: "#FFFFFF", fontWeight: "700", fontSize: 10, lineHeight: 14 },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontWeight: "800", fontSize: 18 },
  linkRow: { flexDirection: "row", alignItems: "center" },
  linkText: { fontWeight: "700", fontSize: 14, marginRight: 2 },
  classCard: { marginHorizontal: 20, padding: 18, borderRadius: 12, marginBottom: 25, borderWidth: 1, elevation: 2 },
  classTitle: { fontWeight: "800", fontSize: 16, marginBottom: 10 },
  classDetailsRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  classDetailItem: { flexDirection: "row", alignItems: "center", marginRight: 15 },
  classSubText: { fontSize: 12, marginLeft: 4, fontWeight: "500" },
  tabsContainer: { flexDirection: "row", marginHorizontal: 20, marginBottom: 10 },
  tabButton: { marginRight: 25, alignItems: "center", paddingBottom: 6 },
  tabText: { fontSize: 18, fontWeight: "500" },
  activeTabIndicator: { height: 3, width: "100%", position: "absolute", bottom: 0, borderRadius: 2 },
  contentWrapper: { paddingTop: 15, paddingBottom: 20, minHeight: 400 },
  newsCard: { marginHorizontal: 20, padding: 18, borderRadius: 12, marginBottom: 15, elevation: 2 },
  newsHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  newsTitle: { fontWeight: "800", fontSize: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 12 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  eventCard: { marginHorizontal: 20, borderRadius: 12, marginBottom: 15, flexDirection: "row", elevation: 2 },
  eventInfo: { flex: 1, padding: 16, justifyContent: "center" },
  eventTitle: { fontWeight: "700", fontSize: 15, marginBottom: 12, lineHeight: 20 },
  eventSubText: { fontSize: 12, marginBottom: 4, fontWeight: "500" },
  eventImage: { width: 110, borderTopRightRadius: 12, borderBottomRightRadius: 12 },

  // --- COURSES SCREEN ---
  searchContainer: { flexDirection: "row", alignItems: "center", marginHorizontal: 20, paddingHorizontal: 15, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  coursesListWrapper: { paddingTop: 15, paddingBottom: 40, minHeight: "100%" },
  courseListItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, padding: 18, borderRadius: 12, marginBottom: 12, elevation: 2 },
  courseListTitle: { fontSize: 15, fontWeight: "700" },

  // --- SCHEDULE SCREEN ---
  dateHeaderRow: { flexDirection: "row", alignItems: "center", marginHorizontal: 25, marginBottom: 25 },
  largeDateText: { fontSize: 44, fontWeight: "800", marginRight: 10 },
  monthYearCol: { justifyContent: "center" },
  monthText: { fontSize: 16, fontWeight: "600" },
  yearText: { fontSize: 16 },
  scheduleContentWrapper: { flex: 1, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 25 },
  daysRow: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 25, marginBottom: 30 },
  dayItem: { alignItems: "center", paddingVertical: 12, paddingHorizontal: 10, borderRadius: 12 },
  dayName: { fontSize: 13, marginBottom: 8, fontWeight: "600" },
  dayNumber: { fontSize: 16, fontWeight: "700" },
  dayTextActive: { color: "#FFFFFF" },
  timelineHeader: { flexDirection: "row", marginHorizontal: 25, marginBottom: 15 },
  timelineHeaderText: { fontSize: 16, fontWeight: "500" },
  timelineRow: { flexDirection: "row", paddingHorizontal: 25, marginBottom: 20 },
  timeColumn: { width: 50, alignItems: "center", paddingTop: 10 },
  startTimeText: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
  endTimeText: { fontSize: 13, fontWeight: "500" },
  timelineDivider: { width: 1, marginHorizontal: 15, marginTop: 15, height: "80%" },
  scheduleCard: { flex: 1, borderRadius: 16, padding: 16, minHeight: 120, justifyContent: "space-between" },
  scheduleCardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  scheduleCardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  scheduleCardSubtitle: { fontSize: 12, fontWeight: "500" },
  scheduleCardBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 15 },
  scheduleInfoRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  scheduleInfoText: { fontSize: 11, fontWeight: "500", marginLeft: 6 },

  // --- COMMUNITY SCREEN ---
  chatContainer: { flex: 1 },
  chatListContent: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 20 },
  systemMessageContainer: { alignSelf: "center", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 15 },
  systemMessageText: { fontSize: 12, fontWeight: "500" },
  messageWrapper: { flexDirection: "row", marginBottom: 15, maxWidth: "80%" },
  messageWrapperMe: { alignSelf: "flex-end" },
  messageWrapperOther: { alignSelf: "flex-start" },
  avatarCircle: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center", marginRight: 10, alignSelf: "flex-end" },
  avatarText: { fontSize: 14, fontWeight: "700" },
  messageBubble: { padding: 12, borderRadius: 16, elevation: 1 },
  messageSender: { fontSize: 12, fontWeight: "700", marginBottom: 4 },
  messageText: { fontSize: 15, lineHeight: 22 },
  messageTime: { fontSize: 10, marginTop: 6, alignSelf: "flex-end" },
  inputContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 15, paddingVertical: 10, borderTopWidth: 1 },
  attachButton: { padding: 5, marginRight: 5 },
  chatInput: { flex: 1, borderRadius: 20, paddingHorizontal: 15, paddingTop: 10, paddingBottom: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginLeft: 10 },

  // --- PROFILE SCREEN ---
  profileHeaderBg: { paddingBottom: 60, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  profileTopNav: { flexDirection: "row", justifyContent: "space-between", marginHorizontal: 25, marginTop: 20 },
  headerTitleLight: { fontSize: 22, fontWeight: "800", color: "#FFFFFF" },
  profileCardPrimary: { alignItems: "center", marginTop: 20 },
  profileAvatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: "#FFFFFF", marginBottom: 15 },
  profileInfoCore: { alignItems: "center" },
  profileName: { fontSize: 22, fontWeight: "800", color: "#FFFFFF", marginBottom: 4 },
  profileId: { fontSize: 14, color: "#D1FAE5", fontWeight: "600", marginBottom: 10 },
  roleBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 10 },
  roleBadgeText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  universityText: { color: "#D1FAE5", fontSize: 12, fontWeight: "500" },
  profileContentWrapper: { paddingHorizontal: 20, marginTop: -30 },
  statsBanner: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 15, borderRadius: 16, borderWidth: 1, elevation: 3, marginBottom: 20 },
  statBox: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", marginBottom: 4 },
  statLabel: { fontSize: 12, fontWeight: "500" },
  statDivider: { width: 1, height: "80%", alignSelf: "center" },
  premiumCard: { borderRadius: 16, padding: 20, borderWidth: 1, elevation: 3, marginBottom: 20 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: "800" },
  actionButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  actionButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  progressSection: { marginTop: 5 },
  progressRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  progressInfo: { flexDirection: "row", alignItems: "center" },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  progressText: { fontSize: 14, fontWeight: "500" },
  progressPercent: { fontSize: 14, fontWeight: "700" },
  staffPromptText: { fontSize: 14, lineHeight: 22 },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
  menuItemLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 15 },
  menuItemText: { fontSize: 15, fontWeight: "600" },

  // --- SETTINGS SCREEN ---
  settingsSectionTitle: { fontSize: 12, fontWeight: "800", marginBottom: 10, marginLeft: 5 },
  settingsCard: { borderRadius: 12, borderWidth: 1, paddingHorizontal: 15 },
  settingsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 15 },
  settingsLabelGroup: { flexDirection: "row", alignItems: "center" },
  settingsLabel: { fontSize: 15, fontWeight: "600", marginLeft: 12 },
  settingsDivider: { height: 1 },
  logoutButton: { marginTop: 40, backgroundColor: "#FEE2E2", padding: 16, borderRadius: 12, alignItems: "center" },
  logoutText: { color: "#EF4444", fontWeight: "700", fontSize: 16 },

  // --- TABS ---
  tabBar: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 25, paddingTop: 12, paddingBottom: 25, borderTopWidth: 1 },
  tabItem: { alignItems: "center" },
  tabLabel: { fontSize: 10, marginTop: 4 },
});