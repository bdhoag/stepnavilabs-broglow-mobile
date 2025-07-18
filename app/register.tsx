import { AuthService } from "@/src/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();
const API_URL = process.env.EXPO_PUBLIC_API || "http://localhost:3000";
const redirectUri = AuthSession.makeRedirectUri({
  scheme: "broglow-app",
  path: "/login",
});

export default function RegisterScreen() {
  const logoGoogle = require("../assets/images/icons8-google-48.png");
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const validateForm = () => {
    if (!firstName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên");
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập họ");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập email");
      return false;
    }
    if (!email.includes("@")) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return false;
    }
    if (!password) {
      Alert.alert("Lỗi", "Vui lòng nhập mật khẩu");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return false;
    }
    if (!agreeToTerms) {
      Alert.alert("Lỗi", "Vui lòng đồng ý với Điều khoản Sử dụng và Chính sách Quyền riêng tư");
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await AuthService.register(
        firstName.trim(),
        lastName.trim(),
        email.trim().toLowerCase(),
        password,
        "" // Empty turnstile token for now
      );

      Alert.alert(
        "Đăng ký thành công!",
        "Vui lòng kiểm tra email để xác thực tài khoản.",
        [{ text: "OK", onPress: () => router.replace("/login" as Href) }]
      );
    } catch (error) {
      Alert.alert(
        "Lỗi đăng ký",
        error instanceof Error ? error.message : "Đã xảy ra lỗi"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const authUrl = `${API_URL}/auth/google`;
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if (result.type === "success" && result.url) {
        const url = new URL(result.url);
        const code = url.searchParams.get("code");

        if (code) {
          await AuthService.redirectGoogleLogin(code);
          Alert.alert("Thành công", "Đăng nhập Google thành công!", [
            { text: "OK", onPress: () => router.replace("/(tabs)/home") },
          ]);
        }
      }
    } catch (error) {
      Alert.alert(
        "Lỗi Google Sign In",
        error instanceof Error ? error.message : "Đã xảy ra lỗi"
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLogin = () => {
    router.replace("/login" as Href);
  };

  const handleTermsPress = () => {
    setShowTermsModal(true);
  };

  const handlePrivacyPress = () => {
    setShowPrivacyModal(true);
  };

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
            <View style={styles.headerIconContainer}>
              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#171B2E" />
              </TouchableOpacity>
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerText}>Đăng ký</Text>
            </View>
          </View>

          {/* Logo
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo-text.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View> */}

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Name Inputs */}
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <Text style={styles.inputLabel}>Tên</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nguyễn"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <Text style={styles.inputLabel}>Họ</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Văn A"
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Vui lòng nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mật khẩu của bạn"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Nhập lại mật khẩu"
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
                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Terms and Privacy Policy Checkbox */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && (
                    <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.termsText}>
                  Bằng cách chọn &quot;Tạo tài khoản&quot;, bạn xác nhận rằng bạn đã đọc và đồng ý với{" "}
                  <Text style={styles.termsLink} onPress={handleTermsPress}>
                    Điều khoản Sử dụng
                  </Text>{" "}
                  và{" "}
                  <Text style={styles.termsLink} onPress={handlePrivacyPress}>
                    Chính sách Quyền riêng tư
                  </Text>{" "}
                  của BroGlow.
                </Text>
              </TouchableOpacity>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                loading && styles.registerButtonDisabled,
              ]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Tạo tài khoản</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            {/* <View style={styles.dividerContainer}>
              <Text style={styles.dividerText}>hoặc</Text>
            </View> */}

            {/* Google Login Button
            <TouchableOpacity
              style={[
                styles.googleButton,
                googleLoading && styles.googleButtonDisabled,
              ]}
              onPress={handleGoogleLogin}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color="#4285F4" />
              ) : (
                <>
                  <Image source={logoGoogle} style={styles.googleLogo} />
                  <Text style={styles.googleButtonText}>Đăng nhập với Google</Text>
                </>
              )}
            </TouchableOpacity> */}
          </View>
        </ScrollView>

        {/* Login Link - Moved to bottom */}
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Đăng nhập ngay!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Terms of Service Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Điều khoản Sử dụng</Text>
            <TouchableOpacity
              onPress={() => setShowTermsModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#171B2E" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>
              {`1. CHẤP NHẬN ĐIỀU KHOẢN

Bằng cách truy cập và sử dụng ứng dụng BroGlow, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng này.

2. MÔ TẢ DỊCH VỤ

BroGlow là một ứng dụng di động cung cấp các dịch vụ chăm sóc sức khỏe và sắc đẹp cho nam giới.

3. QUYỀN VÀ NGHĨA VỤ NGƯỜI DÙNG

- Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký
- Bạn có trách nhiệm bảo mật thông tin tài khoản
- Không được sử dụng dịch vụ cho mục đích bất hợp pháp

4. QUYỀN SỞ HỮU TRÍ TUỆ

Tất cả nội dung trong ứng dụng đều thuộc quyền sở hữu của BroGlow và được bảo vệ bởi luật bản quyền.

5. GIỚI HẠN TRÁCH NHIỆM

BroGlow không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng ứng dụng.

6. THAY ĐỔI ĐIỀU KHOẢN

BroGlow có quyền thay đổi các điều khoản này bất cứ lúc nào mà không cần thông báo trước.

7. LUẬT ÁP DỤNG

Các điều khoản này được điều chỉnh bởi luật pháp Việt Nam.`}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        visible={showPrivacyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Chính sách Quyền riêng tư</Text>
            <TouchableOpacity
              onPress={() => setShowPrivacyModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#171B2E" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>
              {`1. THU THẬP THÔNG TIN

BroGlow thu thập các thông tin sau:
- Thông tin cá nhân: tên, email, số điện thoại
- Thông tin sử dụng ứng dụng
- Thông tin thiết bị và vị trí

2. SỬ DỤNG THÔNG TIN

Chúng tôi sử dụng thông tin để:
- Cung cấp dịch vụ tốt hơn
- Gửi thông báo quan trọng
- Cải thiện trải nghiệm người dùng

3. CHIA SẺ THÔNG TIN

BroGlow không chia sẻ thông tin cá nhân với bên thứ ba trừ khi:
- Có sự đồng ý của người dùng
- Theo yêu cầu của pháp luật
- Để bảo vệ quyền lợi của BroGlow

4. BẢO MẬT THÔNG TIN

Chúng tôi áp dụng các biện pháp bảo mật tiên tiến để bảo vệ thông tin của bạn.

5. QUYỀN CỦA NGƯỜI DÙNG

Bạn có quyền:
- Truy cập thông tin cá nhân
- Chỉnh sửa thông tin
- Xóa tài khoản

6. COOKIE VÀ CÔNG NGHỆ THEO DÕI

Ứng dụng có thể sử dụng cookie để cải thiện trải nghiệm người dùng.

7. THAY ĐỔI CHÍNH SÁCH

Chính sách này có thể được cập nhật định kỳ. Chúng tôi sẽ thông báo về những thay đổi quan trọng.

8. LIÊN HỆ

Nếu có câu hỏi về chính sách này, vui lòng liên hệ: privacy@broglow.com`}
            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  headerIconContainer: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#171B2E",
    textAlign: "center",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#F9F6EF",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    flex: 1,
    paddingVertical: 50,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInput: {
    width: "48%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#171B2E",
    marginBottom: 8,
    fontWeight: "600",
  },
  input: {
    borderRadius: 26,
    padding: 16,
    fontSize: 14,
    backgroundColor: "#F9F9F9",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 26,
    backgroundColor: "#F9F9F9",
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 14,
  },
  eyeIcon: {
    padding: 12,
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#171B2E",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: "#1584F2",
    borderColor: "#1584F2",
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: "#171B2E",
    lineHeight: 20,
  },
  termsLink: {
    color: "#171B2E",
    fontWeight: "700",
  },
  registerButton: {
    backgroundColor: "#1584F2",
    borderRadius: 28,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#9496A5",
    fontSize: 14,
    fontWeight: "400",
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 28,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#FFFFFF",
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleLogo: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: "#171B2E",
    fontSize: 14,
    fontWeight: "500",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  loginText: {
    color: "#9496A5",
    fontSize: 14,
  },
  loginLink: {
    color: "#2972FE",
    fontSize: 14,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171B2E",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9F9F9",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  modalText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#374151",
  },
});
