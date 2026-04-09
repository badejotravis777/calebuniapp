import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../utils/theme";
import { scheduleDays, scheduleItems } from "../utils/data";
import { styles } from "./commonStyles";

type StandardProps = { theme: Theme };

export default function ScheduleScreen({ theme }: StandardProps) {
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
            <View
              key={index}
              style={[styles.dayItem, item.active && { backgroundColor: theme.primary }]}
            >
              <Text
                style={[
                  styles.dayName,
                  { color: theme.subtext },
                  item.active && styles.dayTextActive,
                ]}
              >
                {item.day}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  { color: theme.text },
                  item.active && styles.dayTextActive,
                ]}
              >
                {item.date}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.timelineHeader}>
          <Text style={[styles.timelineHeaderText, { color: theme.subtext }]}>Time</Text>
          <Text style={[styles.timelineHeaderText, { color: theme.subtext, marginLeft: 25 }]}>
            Courses
          </Text>
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
                    <Text style={[styles.scheduleCardTitle, { color: item.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.scheduleCardSubtitle, { color: item.textSecondary }]}>
                      {item.subtitle}
                    </Text>
                  </View>
                  <Ionicons name="ellipsis-vertical" size={20} color={item.iconColor} />
                </View>

                <View style={styles.scheduleCardBottom}>
                  <View>
                    <View style={styles.scheduleInfoRow}>
                      <Ionicons name="location-outline" size={14} color={item.textSecondary} />
                      <Text style={[styles.scheduleInfoText, { color: item.textSecondary }]}>
                        {item.room}
                      </Text>
                    </View>
                    <View style={styles.scheduleInfoRow}>
                      <Ionicons name="person-circle-outline" size={14} color={item.textSecondary} />
                      <Text style={[styles.scheduleInfoText, { color: item.textSecondary }]}>
                        {item.instructor}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={item.iconColor}
                    style={{ alignSelf: "flex-end" }}
                  />
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}