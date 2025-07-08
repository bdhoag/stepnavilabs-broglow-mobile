import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TwoFactorVerifyScreen() {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleBackPress = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={23} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác thực 2 yếu tố</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Nhập email của bạn, chúng tôi sẽ gửi cho bạn mã xác minh qua email
        </Text>

        {/* Email/Phone Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email hoặc số điện thoại</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Email/số điện thoại đã đăng ký"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
            />
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.fixedContinueButton}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: emailOrPhone.trim() ? "#3B82F6" : "#9CA3AF" },
            ]}
            disabled={!emailOrPhone.trim()}
            onPress={() => {
              // Giả sử validate thành công → chuyển trang
              router.push("/profile/OTP-verify");
            }}
          >
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 0,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
    lineHeight: 24,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 5,
  },
  textInput: {
    fontSize: 15,
    color: "#374151",
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 24,
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  fixedContinueButton: {
    position: "absolute",
    bottom: 49,
    left: 24,
    right: 24,
  },
});
