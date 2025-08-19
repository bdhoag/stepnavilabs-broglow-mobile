import { AuthService } from "@/src/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { AuthService } from "@/services/auth.services"; // TODO: Implement sendOtp and resetPassword

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement sendOtp in AuthService
      const response = await AuthService.sendOTP(email.trim().toLowerCase());
      console.log("first response:", response);
      Alert.alert("Thông báo", "Đã gửi mã OTP đến email của bạn");
      setStep("otp");
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error instanceof Error ? error.message : "Đã xảy ra lỗi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (!otp.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }
    if (otp.length !== 6) {
      Alert.alert("Lỗi", "Mã OTP phải có 6 ký tự");
      return;
    }

    setStep("password");
  };

  const handleResetPassword = async () => {
    if (!newPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement resetPassword in AuthService
      await AuthService.resetPassword(email, otp, newPassword);
      Alert.alert("Thông báo", "Mật khẩu đã thay đổi", [
        { text: "OK", onPress: () => router.replace("/login" as Href) },
      ]);
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error instanceof Error ? error.message : "Đã xảy ra lỗi"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <>
      <Text style={styles.title}>Quên mật khẩu?</Text>
      <Text style={styles.subtitle}>
        Nhập địa chỉ email của bạn và chúng tôi sẽ gửi mã OTP để đặt lại mật
        khẩu.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="broglow@mail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Gửi mã OTP</Text>
        )}
      </TouchableOpacity>
    </>
  );

  const renderOTPStep = () => (
    <>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <Text style={styles.subtitle}>
        Mã OTP đã được gửi đến {email}. Vui lòng kiểm tra email và nhập mã bên
        dưới.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mã OTP</Text>
        <TextInput
          style={styles.input}
          placeholder="123456"
          value={otp}
          onChangeText={setOTP}
          keyboardType="number-pad"
          maxLength={6}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity style={styles.primaryButton} onPress={handleVerifyOTP}>
        <Text style={styles.primaryButtonText}>Xác nhận</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={handleSendOTP}
        disabled={loading}
      >
        <Text style={styles.secondaryButtonText}>Gửi lại mã OTP</Text>
      </TouchableOpacity>
    </>
  );

  const renderPasswordStep = () => (
    <>
      <Text style={styles.title}>Đặt lại mật khẩu</Text>
      <Text style={styles.subtitle}>
        Nhập mật khẩu mới cho tài khoản của bạn.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mật khẩu mới</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••••"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Xác nhận mật khẩu mới</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="••••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, loading && styles.buttonDisabled]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Đặt lại mật khẩu</Text>
        )}
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
          </View>

          {/* Logo */}
          <View style={styles.logoContainer}>
            <View style={styles.logoIconContainer}>
              <View style={styles.logoIcon}>
                <View style={styles.logoCircle1} />
                <View style={styles.logoCircle2} />
                <View style={styles.logoCircle3} />
              </View>
            </View>
            <Text style={styles.logoText}>BROGLOW</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {step === "email" && renderEmailStep()}
            {step === "otp" && renderOTPStep()}
            {step === "password" && renderPasswordStep()}
          </View>

          {/* Back to Login */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Nhớ mật khẩu? </Text>
            <TouchableOpacity onPress={() => router.replace("/login" as Href)}>
              <Text style={styles.loginLink}>Đăng nhập ngay!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoIconContainer: {
    marginBottom: 16,
  },
  logoIcon: {
    width: 80,
    height: 80,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  logoCircle1: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#60A5FA",
    opacity: 0.3,
  },
  logoCircle2: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3B82F6",
    opacity: 0.6,
  },
  logoCircle3: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#1D4ED8",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    letterSpacing: 1,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 16,
  },
  primaryButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#FFFFFF",
  },
  secondaryButtonText: {
    color: "#3B82F6",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 32,
  },
  loginText: {
    color: "#6B7280",
    fontSize: 14,
  },
  loginLink: {
    color: "#3B82F6",
    fontSize: 14,
    fontWeight: "600",
  },
});
