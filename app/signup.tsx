import { useEffect, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { universityData } from "../utils/dummyData";
import { BASE_URL } from "../utils/config"; // ✅ single source of truth

export default function Signup() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const roleValue   = Array.isArray(role) ? role[0] : role;
  const departments = Object.keys(universityData);
  const levels      = ["100", "200", "300", "400"];

  const [username, setUsername]         = useState("");
  const [matricNo, setMatricNo]         = useState("");
  const [email, setEmail]               = useState("");
  const [department, setDepartment]     = useState("");
  const [level, setLevel]               = useState("");
  const [password, setPassword]         = useState("");
  const [secure, setSecure]             = useState(true);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [showDeptModal, setShowDeptModal]   = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [usernameStatus, setUsernameStatus] =
    useState<"idle" | "checking" | "taken" | "available">("idle");

  const fade  = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [fade, scale]);

  // Debounced username availability check
  useEffect(() => {
    if (!username) { setUsernameStatus("idle"); return; }
    const delay = setTimeout(async () => {
      setUsernameStatus("checking");
      try {
        const res = await axios.get(`${BASE_URL}/api/check-username/${username}`); // ✅
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [username]);

  const handleSignup = async () => {
    setError("");
    if (!username || !matricNo || !email || !department || !level || !password) {
      setError("Please fill all fields");
      return;
    }
    if (usernameStatus === "taken") {
      setError("Username already taken");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${BASE_URL}/api/signup`, { // ✅
        username, matricNo, email, password, department, level,
        role: roleValue || "student",
      });

      const loginRes = await axios.post(`${BASE_URL}/api/login`, { // ✅
        identifier: username,
        password,
      });

      await AsyncStorage.multiSet([
        ["token",      loginRes.data.token],
        ["role",       loginRes.data.role],
        ["username",   loginRes.data.user.username],
        ["email",      loginRes.data.user.email   ?? ""],
        ["matricNo",   loginRes.data.user.matricNo ?? ""],
        ["department", loginRes.data.user.department ?? department],
        ["level",      loginRes.data.user.level      ?? level],
      ]);

      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Username status icon
  const usernameIcon = () => {
    if (usernameStatus === "checking")
      return <ActivityIndicator size="small" color="#888" />;
    if (usernameStatus === "available")
      return <Ionicons name="checkmark-circle" size={18} color="#16A34A" />;
    if (usernameStatus === "taken")
      return <Ionicons name="close-circle" size={18} color="#DC2626" />;
    return null;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <Animated.View style={[styles.cardWrap, { opacity: fade, transform: [{ scale }] }]}>
            <BlurView intensity={60} tint="light" style={styles.card}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                {roleValue === "staff" ? "Staff Signup" : "Student Signup"}
              </Text>

              {/* USERNAME */}
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color="#0B6E4F" />
                <TextInput
                  placeholder="Username"
                  placeholderTextColor="#888"
                  style={styles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
                {usernameIcon()}
              </View>

              {/* MATRIC */}
              <View style={styles.inputWrap}>
                <Ionicons name="card-outline" size={18} color="#0B6E4F" />
                <TextInput
                  placeholder="Matric Number"
                  placeholderTextColor="#888"
                  style={styles.input}
                  value={matricNo}
                  onChangeText={setMatricNo}
                  autoCapitalize="characters"
                />
              </View>

              {/* EMAIL */}
              <View style={styles.inputWrap}>
                <Ionicons name="mail-outline" size={18} color="#0B6E4F" />
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#888"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* DEPARTMENT DROPDOWN */}
              <Pressable style={styles.inputWrap} onPress={() => setShowDeptModal(true)}>
                <Ionicons name="business-outline" size={18} color="#0B6E4F" />
                <Text style={[styles.dropdownText, !department && { color: "#888" }]}>
                  {department || "Select Department"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#888" />
              </Pressable>

              {/* LEVEL DROPDOWN */}
              <Pressable style={styles.inputWrap} onPress={() => setShowLevelModal(true)}>
                <Ionicons name="school-outline" size={18} color="#0B6E4F" />
                <Text style={[styles.dropdownText, !level && { color: "#888" }]}>
                  {level ? `${level} Level` : "Select Level"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#888" />
              </Pressable>

              {/* PASSWORD */}
              <View style={styles.inputWrap}>
                <Ionicons name="lock-closed-outline" size={18} color="#0B6E4F" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#888"
                  secureTextEntry={secure}
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable onPress={() => setSecure(!secure)}>
                  <Ionicons name={secure ? "eye-off" : "eye"} size={18} color="#888" />
                </Pressable>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                onPress={handleSignup}
                style={({ pressed }) => [
                  styles.button,
                  pressed && { transform: [{ scale: 0.96 }] },
                  loading && { opacity: 0.7 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({ pathname: "/login", params: { role: roleValue || "student" } } as any)
                }
              >
                <Text style={styles.link}>Already have an account? Log in</Text>
              </Pressable>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* DEPARTMENT MODAL */}
      <Modal visible={showDeptModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Department</Text>
              <Pressable onPress={() => setShowDeptModal(false)}>
                <Ionicons name="close-circle" size={28} color="#888" />
              </Pressable>
            </View>
            <FlatList
              data={departments}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => { setDepartment(item); setShowDeptModal(false); }}
                >
                  <Text style={[styles.modalItemText, department === item && styles.modalItemActive]}>
                    {item}
                  </Text>
                  {department === item && (
                    <Ionicons name="checkmark-circle" size={20} color="#0B6E4F" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* LEVEL MODAL */}
      <Modal visible={showLevelModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Level</Text>
              <Pressable onPress={() => setShowLevelModal(false)}>
                <Ionicons name="close-circle" size={28} color="#888" />
              </Pressable>
            </View>
            <FlatList
              data={levels}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => { setLevel(item); setShowLevelModal(false); }}
                >
                  <Text style={[styles.modalItemText, level === item && styles.modalItemActive]}>
                    {item} Level
                  </Text>
                  {level === item && (
                    <Ionicons name="checkmark-circle" size={20} color="#0B6E4F" />
                  )}
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: "#EAF5F1" },
  container: { flex: 1, padding: 20 },
  cardWrap:  { alignItems: "center" },
  card:      { width: "100%", borderRadius: 24, padding: 22 },
  title:     { fontSize: 26, fontWeight: "900", textAlign: "center", color: "#111" },
  subtitle:  { textAlign: "center", marginBottom: 20, color: "#555" },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 12,
    paddingHorizontal: 12, marginBottom: 12, height: 54,
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 8, color: "#111", fontSize: 15 },
  dropdownText: { flex: 1, marginLeft: 8, color: "#111", fontSize: 15 },
  button: {
    backgroundColor: "#0B6E4F", padding: 15, borderRadius: 12,
    alignItems: "center", marginTop: 10, height: 54, justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  link:       { textAlign: "center", marginTop: 15, color: "#1E3A8A", fontWeight: "600" },
  error:      { color: "red", marginBottom: 10, fontSize: 13, textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalContent: {
    backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: "#eee",
  },
  modalTitle:    { fontSize: 18, fontWeight: "700", color: "#111" },
  modalItem: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#f5f5f5",
  },
  modalItemText:   { fontSize: 16, color: "#333" },
  modalItemActive: { fontWeight: "700", color: "#0B6E4F" },
});
