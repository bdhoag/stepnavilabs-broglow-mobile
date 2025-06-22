import React, { useEffect, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

const TypingIndicator: React.FC = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animate = (value: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/icon.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.aiText}>BroGlow AI</Text>
      </View>
      <View style={styles.bubble}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>
      </View>
    </View>
  );
};

export default TypingIndicator;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoContainer: {
    width: 24,
    height: 24,
    padding: 6,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoIcon: {
    width: "100%",
    height: "100%",
  },
  aiText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  bubble: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignSelf: "flex-start",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#374151",
    marginHorizontal: 2,
  },
});
