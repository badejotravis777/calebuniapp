import { useEffect, useRef } from "react";
import { View, Text, Image, Animated, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 55,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/role" as never);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <View style={styles.logoWrap}>
          <Image
            source={require("../assets/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Caleb University</Text>
        <Text style={styles.subtitle}>Student & Staff Portal</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    alignItems: "center",
  },
  logoWrap: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#EAF7F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
  },
  logo: {
    width: 96,
    height: 96,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0B6E4F",
    letterSpacing: 0.3,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "#1E3A8A",
    fontWeight: "600",
  },
});