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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";


type LoginResponse = {
  message: string;
  token: string;
  role: string;
  user: {
    username: string;
    email: string;
    matricNo: string;
  };
};

export default function Login() {
  const { role } = useLocalSearchParams();
  const router = useRouter();

  const roleValue = Array.isArray(role) ? role[0] : role;

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [loading, setLoading] = useState(false);

  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;

  const [error, setError] = useState("");


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

  const handleLogin = async () => {
    if (!identifier || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post<LoginResponse>("http://192.168.1.4:5000/api/login", {
        identifier,
        password,
        portalRole: roleValue || "student", // 🔥 Tell the server which portal they are at
      });

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("role", res.data.role);
      await AsyncStorage.setItem("username", res.data.user.username);
      await AsyncStorage.setItem("email", res.data.user.email);
      await AsyncStorage.setItem("matricNo", res.data.user.matricNo);

      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.response?.data?.message || "Server not reachable");
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              {roleValue === "staff" ? "Staff Portal" : "Student Portal"}
            </Text>

            <View style={styles.inputWrap}>
              <Ionicons name="person-outline" size={18} color="#0B6E4F" />
              <TextInput
                placeholder="Username or Email"
                style={styles.input}
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
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

            <Pressable onPress={handleLogin} style={styles.button}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Log in</Text>
              )}
            </Pressable>

            <Pressable onPress={() => router.push({ pathname: "/signup", params: { role: roleValue || "student" } } as any)}>
              <Text style={styles.link}>Don&apos;t have an account? Sign up</Text>
            </Pressable>

            <Pressable onPress={() => Alert.alert("Coming soon")}>
              <Text style={styles.link}>Forgot Password?</Text>
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