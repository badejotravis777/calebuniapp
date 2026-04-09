import React from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../utils/theme";
import { allCoursesList } from "../utils/data";
import { styles } from "./commonStyles";

type StandardProps = { theme: Theme };

export default function CoursesScreen({ theme }: StandardProps) {
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.coursesListWrapper, { backgroundColor: theme.background }]}
      >
        {allCoursesList.map((course, index) => (
          <Pressable key={index} style={[styles.courseListItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.courseListTitle, { color: theme.text }]}>{course}</Text>
            <Ionicons name="chevron-forward" size={20} color={theme.subtext} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}