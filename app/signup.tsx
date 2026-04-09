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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function Signup() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const roleValue = Array.isArray(role) ? role[0] : role;
  const [username, setUsername] = useState("");
  const [matricNo, setMatricNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "taken" | "available">("idle");

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;


  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  useEffect(() => {
    if (!username) {
      setUsernameStatus("idle");
      return;
    }
  
    const delay = setTimeout(async () => {
      setUsernameStatus("checking");
      try {
        const res = await axios.get(`http://192.168.1.4:5000/api/check-username/${username}`);
        setUsernameStatus(res.data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);
  
    return () => clearTimeout(delay);
  }, [username]);

  
  const handleSignup = async () => {
    setError("");
  
    if (!username || !matricNo || !email || !password) {
      setError("Please fill all fields");
      return;
    }
  
    if (usernameStatus === "taken") {
      setError("Username already taken");
      return;
    }
  
    setLoading(true);
  
    try {
      await axios.post("http://192.168.1.4:5000/api/signup", {
        username,
        matricNo,
        email,
        password,
        role: roleValue || "student",
      });
  
      // 🔥 AUTO LOGIN AFTER SIGNUP
      const loginRes = await axios.post("http://192.168.1.4:5000/api/login", {
        identifier: username,
        password,
      });
  
      await AsyncStorage.setItem("token", loginRes.data.token);
      await AsyncStorage.setItem("role", loginRes.data.role);
  
      // 🚀 GO STRAIGHT TO DASHBOARD
      router.replace("/(tabs)");
  
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <Animated.View style={[styles.cardWrap, { opacity: fade, transform: [{ scale }] }]}>
          <BlurView intensity={60} tint="light" style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              {roleValue === "staff" ? "Staff Signup" : "Student Signup"}
            </Text>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color="#0B6E4F" />
              <TextInput
                placeholder="Username"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            {usernameStatus === "checking" && <Text style={styles.info}>Checking...</Text>}
{usernameStatus === "taken" && <Text style={styles.error}>Username already taken</Text>}
{usernameStatus === "available" && <Text style={styles.success}>Username available ✓</Text>}

            <View style={styles.inputWrap}>
              <Ionicons name="card-outline" size={18} color="#0B6E4F" />
              <TextInput
                placeholder="Matric Number"
                style={styles.input}
                value={matricNo}
                onChangeText={setMatricNo}
                autoCapitalize="characters"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="#0B6E4F" />
              <TextInput
                placeholder="Email"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#0B6E4F" />
              <TextInput
                placeholder="Password"
                secureTextEntry={secure}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setSecure(!secure)}>
                <Ionicons name={secure ? "eye-off" : "eye"} size={18} />
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

            <Pressable onPress={() => router.push({ pathname: "/login", params: { role: roleValue || "student" } } as any)}>
              <Text style={styles.link}>Already have an account? Log in</Text>
            </Pressable>
          </BlurView>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#EAF5F1" },
  container: { flex: 1, justifyContent: "center", padding: 20 },
  cardWrap: { alignItems: "center" },
  card: { width: "100%", borderRadius: 24, padding: 22 },
  title: { fontSize: 26, fontWeight: "900", textAlign: "center" },
  subtitle: { textAlign: "center", marginBottom: 20 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  input: { flex: 1, paddingVertical: 12, marginLeft: 8 },
  button: {
    backgroundColor: "#0B6E4F",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "800" },
  link: {
    textAlign: "center",
    marginTop: 15,
    color: "#1E3A8A",
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: 10,
    fontSize: 13,
  },
  success: {
    color: "green",
    marginBottom: 10,
    fontSize: 13,
  },
  info: {
    color: "#555",
    marginBottom: 10,
    fontSize: 13,
  },
});