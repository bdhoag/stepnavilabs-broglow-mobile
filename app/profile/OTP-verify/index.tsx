import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OTPVerifyScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const [lastEditedIndex, setLastEditedIndex] = useState<number | null>(null);

  const handleBackPress = () => {
    router.back();
  };

  const handleOtpChange = (value: string, index: number) => {
    if (index >= 4 || value.length > 1 || isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setLastEditedIndex(index); // 👉 Hiển thị tạm thời ô này

    // Tự ẩn sau 1.5 giây
    setTimeout(() => {
      setLastEditedIndex(null);
    }, 1500);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    }
  };

  const renderNumberPad = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, "", 0];

    return (
      <View style={styles.numberPad}>
        {numbers.map((num, index) =>
          num === "" ? (
            <View
              key={index}
              style={[styles.numberButton, { backgroundColor: "transparent" }]}
            />
          ) : (
            <TouchableOpacity
              key={index}
              style={styles.numberButton}
              onPress={() => {
                if (otp.filter((d) => d).length < 4) {
                  handleOtpChange(num.toString(), activeIndex);
                }
              }}
            >
              <Text style={styles.numberText}>{num}</Text>
            </TouchableOpacity>
          )
        )}
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => {
            const filledCount = otp.filter((d) => d).length;
            if (filledCount === 0) return;

            const indexToClear = filledCount - 1;
            const newOtp = [...otp];
            newOtp[indexToClear] = "";
            setOtp(newOtp);
            inputRefs.current[indexToClear]?.focus();
            setActiveIndex(indexToClear);
          }}
        >
          <Ionicons name="backspace-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={23} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Mã xác nhận đã được gửi qua email
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View key={index} style={styles.otpInputWrapper}>
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputFilled : null,
                  activeIndex === index ? styles.otpInputActive : null,
                ]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={({ nativeEvent }) =>
                  handleKeyPress(nativeEvent.key, index)
                }
                maxLength={1}
                keyboardType="number-pad"
                textAlign="center"
                onFocus={() => setActiveIndex(index)}
                showSoftInputOnFocus={false}
                secureTextEntry={index !== lastEditedIndex}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            { backgroundColor: otp.every((d) => d) ? "#3B82F6" : "#9CA3AF" },
          ]}
          disabled={!otp.every((d) => d)}
          onPress={() => {
            console.log("OTP:", otp.join(""));
            // router.push('/next-screen'); // chuyển trang nếu cần
          }}
        >
          <Text style={styles.confirmButtonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
      {renderNumberPad()}
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
    paddingTop: 40,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 40,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 50,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  otpInputWrapper: {
    width: 50,
    height: 50,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    backgroundColor: "white",
  },
  otpInputFilled: {
    borderColor: "#D1D5DB",
    backgroundColor: "#FFFFFF",
    color: "#000000",
  },
  otpInputActive: {
    borderColor: "#00bfff",
    backgroundColor: "#DBEAFE",
    color: "#1E3A8A",
  },
  confirmButton: {
    backgroundColor: "#3B82F6",
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 40,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  numberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#F3F4F6",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  numberButton: {
    width: 70,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  numberText: {
    fontSize: 24,
    fontWeight: "400",
    color: "#374151",
  },
});
