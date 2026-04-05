import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function RoleScreen() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;
  const scale = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 70,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.bgBlobTop} />
        <View style={styles.bgBlobBottom} />
        <View style={styles.bgLine} />

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fade,
              transform: [{ translateY: slide }, { scale }],
            },
          ]}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandBadge}>
              <Ionicons name="school-outline" size={20} color="#0B6E4F" />
            </View>
            <View>
              <Text style={styles.brandName}>Caleb University</Text>
              <Text style={styles.brandSub}>Official Mobile Access</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <Text style={styles.title}>Choose your access</Text>
            <Text style={styles.subtitle}>
              Continue as a student or staff member to access the right portal, updates, and
              services.
            </Text>

            <View style={styles.sep} />

            <Pressable
             onPress={() =>
              router.push({
                pathname: "/login" as never,
                params: { role: "student" },
              })
            }
              style={({ pressed }) => [
                styles.optionCard,
                styles.studentCard,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.iconWrap, styles.studentIconWrap]}>
                <Ionicons name="person-outline" size={22} color="#FFFFFF" />
              </View>

              <View style={styles.optionTextWrap}>
                <Text style={styles.optionTitle}>Student Login</Text>
                <Text style={styles.optionDesc}>
                  Access timetable, news, announcements, and student services.
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
            </Pressable>

            <Pressable
  onPress={() =>
    router.push({
      pathname: "/login" as never,
      params: { role: "staff" },
    })
  }
  style={({ pressed }) => [
    styles.optionCard,
    styles.staffCard,
    pressed && styles.pressed,
  ]}
>
              <View style={[styles.iconWrap, styles.staffIconWrap]}>
                <Ionicons name="briefcase-outline" size={22} color="#1E3A8A" />
              </View>

              <View style={styles.optionTextWrap}>
                <Text style={[styles.optionTitle, styles.staffTitle]}>Staff Login</Text>
                <Text style={styles.optionDesc}>
                  Access staff tools, admin updates, and internal resources.
                </Text>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#1E3A8A" />
            </Pressable>
          </View>

          <Text style={styles.footer}>
            Secure access for the Caleb University community
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#EEF6F4",
  },
  container: {
    flex: 1,
    backgroundColor: "#EEF6F4",
    paddingHorizontal: 20,
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
  },
  bgBlobTop: {
    position: "absolute",
    top: -80,
    right: -90,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(11,110,79,0.12)",
  },
  bgBlobBottom: {
    position: "absolute",
    bottom: -100,
    left: -90,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(30,58,138,0.10)",
  },
  bgLine: {
    position: "absolute",
    top: 120,
    left: -40,
    width: width + 80,
    height: 1,
    backgroundColor: "rgba(11,110,79,0.10)",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  brandBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0B6E4F",
    letterSpacing: 0.2,
  },
  brandSub: {
    fontSize: 13,
    color: "#1E3A8A",
    marginTop: 2,
    fontWeight: "600",
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    shadowColor: "#0B6E4F",
    shadowOpacity: 0.10,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 16 },
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(11,110,79,0.08)",
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    color: "#101828",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 23,
    color: "#475467",
    fontWeight: "500",
  },
  sep: {
    height: 1,
    backgroundColor: "rgba(16,24,40,0.08)",
    marginVertical: 20,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  studentCard: {
    backgroundColor: "#0B6E4F",
  },
  staffCard: {
    backgroundColor: "#F4F7FB",
    borderWidth: 1,
    borderColor: "rgba(30,58,138,0.14)",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  studentIconWrap: {
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  staffIconWrap: {
    backgroundColor: "#FFFFFF",
  },
  optionTextWrap: {
    flex: 1,
    paddingRight: 10,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  staffTitle: {
    color: "#111827",
  },
  optionDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: "rgba(255,255,255,0.82)",
    fontWeight: "500",
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  footer: {
    textAlign: "center",
    marginTop: 18,
    color: "#667085",
    fontSize: 13,
    fontWeight: "600",
  },
});