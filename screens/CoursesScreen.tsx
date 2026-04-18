import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Theme } from "../utils/theme";
import { styles } from "./commonStyles";
import { universityData } from "../utils/dummyData";

type StandardProps = { theme: Theme };

export default function CoursesScreen({ theme }: StandardProps) {
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const dept = await AsyncStorage.getItem("department") || "Computer Science";
        const lvl = await AsyncStorage.getItem("level") || "200";
        
        const studentData = (universityData as any)[dept]?.[lvl];
        setMyCourses(studentData?.courses || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <View style={[styles.screenContainer, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <View style={{ width: 24 }} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Courses</Text>
        <Ionicons name="notifications-outline" size={24} color={theme.subtext} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Ionicons name="search-outline" size={20} color={theme.subtext} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search"
          placeholderTextColor={theme.subtext}
        />
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.coursesListWrapper, { backgroundColor: theme.background }]}
        >
          {myCourses.map((course, index) => (
            <Pressable key={course.id || index} style={[styles.courseListItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.courseListTitle, { color: theme.text }]}>
                {course.title || course}
              </Text>
              <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
            </Pressable>
          ))}
          
          {myCourses.length === 0 && (
            <Text style={{ color: theme.subtext, textAlign: "center", marginTop: 40 }}>
              No courses registered for your current level.
            </Text>
          )}
        </ScrollView>
      )}
    </View>
  );
}