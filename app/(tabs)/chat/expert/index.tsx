import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
    Platform,
    Pressable,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";

const ExpertScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();

  // Ẩn tab bar
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({ tabBarStyle: { display: "none" } });
      }
      return () => {
        if (parent) {
          parent.setOptions({ tabBarStyle: { display: "flex" } });
        }
      };
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
        translucent={Platform.OS === "android"}
      />

      <View className="relative flex-row items-center self-center justify-between px-4 py-3 bg-white" style={styles.header}>
        <View className="relative right-16">
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={22} color="#374151" />
          </Pressable>
        </View>

        {/* Tab switch */}
        <View className="right-7" style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, styles.inactiveTab]}
            onPress={() => router.replace("/chat")}
          >
            <Text className="text-base" style={styles.inactiveText}>BroGlow AI</Text>
          </Pressable>

          <Pressable style={[styles.tab, styles.activeTab]}>
            <Text style={styles.activeText}>Chuyên gia</Text>
          </Pressable>
        </View>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.title}>SẮP RA MẮT</Text>
        <Text style={styles.subtitle}>
          Tính năng chuyên gia đang được phát triển
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ExpertScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 999,
    marginLeft: 20,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  inactiveTab: {
    backgroundColor: "transparent",
  },
  activeText: {
    color: "#fff",
    fontWeight: "600",
  },
  inactiveText: {
    color: "#374151",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
});
