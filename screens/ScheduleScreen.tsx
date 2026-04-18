import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "../utils/theme";
import { universityData } from "../utils/dummyData";
import { styles } from "./commonStyles";

type StandardProps = { theme: Theme };

const cardColors = [
  { bg: "#EAF5F1", textPrimary: "#0B6E4F", textSecondary: "#2A8A6A", iconColor: "#0B6E4F" }, // Green
  { bg: "#F4F0FF", textPrimary: "#5D3FD3", textSecondary: "#7B61FF", iconColor: "#5D3FD3" }, // Purple
  { bg: "#FFF4E5", textPrimary: "#E67E22", textSecondary: "#F39C12", iconColor: "#E67E22" }, // Orange
];

export default function ScheduleScreen({ theme }: StandardProps) {
  const [mySchedule, setMySchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Figure out what today is, and default to Monday if it's the weekend
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
  const initialDayIndex = (currentDayOfWeek === 0 || currentDayOfWeek === 6) ? 1 : currentDayOfWeek;
  const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  const [selectedDay, setSelectedDay] = useState(fullDayNames[initialDayIndex]);
  const [weekDates, setWeekDates] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch user's schedule
    const fetchSchedule = async () => {
      try {
        const dept = await AsyncStorage.getItem("department") || "Computer Science";
        const lvl = await AsyncStorage.getItem("level") || "100";
        
        const studentData = (universityData as any)[dept]?.[lvl];
        setMySchedule(studentData?.schedule || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();

    // 2. Generate dynamic Mon-Fri dates for the current (or upcoming) week
    const generateWeekDays = () => {
      let diffToMonday = 1 - currentDayOfWeek;
      if (currentDayOfWeek === 0) diffToMonday = 1; // If Sunday, Monday is tomorrow
      if (currentDayOfWeek === 6) diffToMonday = 2; // If Saturday, Monday is in 2 days

      const monday = new Date(today);
      monday.setDate(today.getDate() + diffToMonday);

      const days = [];
      const shortDayNames = ["Mon", "Tue", "Wed", "Thu", "Fri"];
      const fullNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

      for (let i = 0; i < 5; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        days.push({
          dayName: shortDayNames[i],
          fullDayName: fullNames[i],
          dateNum: nextDay.getDate().toString().padStart(2, '0'),
          fullDateObj: nextDay // Keep the full date object to update the header
        });
      }
      setWeekDates(days);
    };

    generateWeekDays();
  }, []);

  // Filter schedule based on the day the user clicked
  const filteredSchedule = mySchedule.filter(item => item.day === selectedDay);

  // Get the date object for the currently selected day to display in the big header
  const activeDateObj = weekDates.find(d => d.fullDayName === selectedDay)?.fullDateObj || new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Schedule</Text>
        <Ionicons name="notifications-outline" size={24} color={theme.subtext} />
      </View>

      <View style={styles.dateHeaderRow}>
        <Text style={[styles.largeDateText, { color: theme.text }]}>
          {activeDateObj.getDate().toString().padStart(2, '0')}
        </Text>
        <View style={styles.monthYearCol}>
          <Text style={[styles.monthText, { color: theme.subtext }]}>{selectedDay.substring(0, 3)}</Text>
          <Text style={[styles.yearText, { color: theme.subtext }]}>
            {monthNames[activeDateObj.getMonth()]}, {activeDateObj.getFullYear()}
          </Text>
        </View>
      </View>

      <View style={[styles.scheduleContentWrapper, { backgroundColor: theme.background }]}>
        {/* DYNAMIC WEEKDAY SELECTOR */}
        <View style={styles.daysRow}>
          {weekDates.map((item, index) => {
            const isActive = selectedDay === item.fullDayName;
            return (
              <Pressable
                key={index}
                onPress={() => setSelectedDay(item.fullDayName)}
                style={[styles.dayItem, isActive && { backgroundColor: theme.primary }]}
              >
                <Text
                  style={[
                    styles.dayName,
                    { color: theme.subtext },
                    isActive && styles.dayTextActive,
                  ]}
                >
                  {item.dayName}
                </Text>
                <Text
                  style={[
                    styles.dayNumber,
                    { color: theme.text },
                    isActive && styles.dayTextActive,
                  ]}
                >
                  {item.dateNum}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.timelineHeader}>
          <Text style={[styles.timelineHeaderText, { color: theme.subtext }]}>Time</Text>
          <Text style={[styles.timelineHeaderText, { color: theme.subtext, marginLeft: 25 }]}>
            Courses
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {filteredSchedule.map((item, index) => {
              const [startTime, endTime] = item.time ? item.time.split(" - ") : ["--:--", "--:--"];
              const colors = cardColors[index % cardColors.length];

              return (
                <View key={item.id || index} style={styles.timelineRow}>
                  <View style={styles.timeColumn}>
                    <Text style={[styles.startTimeText, { color: theme.text }]}>{startTime}</Text>
                    <Text style={[styles.endTimeText, { color: theme.subtext }]}>{endTime}</Text>
                  </View>

                  <View style={[styles.timelineDivider, { backgroundColor: theme.border }]} />

                  <View style={[styles.scheduleCard, { backgroundColor: colors.bg }]}>
                    <View style={styles.scheduleCardTop}>
                      <View>
                        <Text style={[styles.scheduleCardTitle, { color: colors.textPrimary }]}>
                          {item.title}
                        </Text>
                        <Text style={[styles.scheduleCardSubtitle, { color: colors.textSecondary }]}>
                          Lecturer: {item.lecturer}
                        </Text>
                      </View>
                      <Ionicons name="ellipsis-vertical" size={20} color={colors.iconColor} />
                    </View>

                    <View style={styles.scheduleCardBottom}>
                      <View>
                        <View style={styles.scheduleInfoRow}>
                          <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                          <Text style={[styles.scheduleInfoText, { color: colors.textSecondary }]}>
                            {item.location}
                          </Text>
                        </View>
                        <View style={styles.scheduleInfoRow}>
                          <Ionicons name="people-circle-outline" size={14} color={colors.textSecondary} />
                          <Text style={[styles.scheduleInfoText, { color: colors.textSecondary }]}>
                            Department Only
                          </Text>
                        </View>
                      </View>
                      <Ionicons
                        name="notifications-outline"
                        size={20}
                        color={colors.iconColor}
                        style={{ alignSelf: "flex-end" }}
                      />
                    </View>
                  </View>
                </View>
              );
            })}

            {filteredSchedule.length === 0 && (
              <Text style={{ textAlign: "center", color: theme.subtext, marginTop: 40 }}>
                No lectures scheduled for {selectedDay}.
              </Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

