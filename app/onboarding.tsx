import { AuthService } from "@/src/services/auth.service";
import * as AuthSession from "expo-auth-session";
import { Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
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

export default function OnboardingScreen() {
    const logoApp = require('../assets/images/splash-icon.png');
    const logoGoogle = require('../assets/images/icons8-google-48.png');
    const router = useRouter();
    const [googleLoading, setGoogleLoading] = useState(false);

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

    const handlePasswordLogin = () => {
        router.push("/login" as Href);
    };

    const handleSignUp = () => {
        router.push("/register" as Href);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Logo Section */}
                <View style={styles.logoSection}>
                    <View style={styles.logoContainer}>
                        <Image source={logoApp} style={styles.logoImage} resizeMode="contain" />
                    </View>
                    <Text style={styles.welcomeText}>Xin chào</Text>
                </View>

                {/* Buttons Section */}
                <View style={styles.buttonsSection}>
                    {/* Google Login Button */}
                    {/* <TouchableOpacity
                        style={[styles.googleButton, googleLoading && styles.googleButtonDisabled]}
                        onPress={handleGoogleLogin}
                        disabled={googleLoading}
                    >
                        {googleLoading ? (
                            <ActivityIndicator color="#4285F4" />
                        ) : (
                            <>
                                <Image source={logoGoogle} style={styles.googleLogo} />
                                <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
                            </>
                        )}
                    </TouchableOpacity> */}

                    {/* Divider
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>hoặc</Text>
                        <View style={styles.dividerLine} />
                    </View> */}

                    {/* Password Login Button */}
                    <TouchableOpacity
                        style={styles.passwordButton}
                        onPress={handlePasswordLogin}
                    >
                        <Text style={styles.passwordButtonText}>Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Chưa có tài khoản? </Text>
                <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.signUpLink}>Đăng Ký Ngay</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: "center",
    },
    logoSection: {
        alignItems: "center",
        marginBottom: 50,
    },
    logoContainer: {
        width: 210,
        height: 215,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 30,
    },
    logoImage: {
        width: 206,
        height: 213,
    },
    welcomeText: {
        fontSize: 48,
        fontWeight: "700",
        color: "#171B2E",
        textAlign: "center",
    },
    buttonsSection: {
        width: "100%",
    },
    googleButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "#EFF0F9",
        borderRadius: 28,
        padding: 16,
        marginBottom: 32,
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
    dividerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 32,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#EEEEEE",
    },
    dividerText: {
        marginHorizontal: 16,
        color: "#9496A5",
        fontSize: 14,
        fontWeight: "400",
    },
    passwordButton: {
        backgroundColor: "#1584F2",
        borderRadius: 28,
        padding: 16,
        alignItems: "center",
    },
    passwordButtonText: {
        color: "#FFFFFF",
        fontSize: 13,
        fontWeight: "600",
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 24,
        backgroundColor: "#FFFFFF",
    },
    signUpText: {
        color: "#9496A5",
        fontSize: 14,
    },
    signUpLink: {
        color: "#2972FE",
        fontSize: 14,
        fontWeight: "600",
    },
});