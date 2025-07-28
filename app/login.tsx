import { AuthService } from "@/src/services/auth.service";
import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { Href, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import
{
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../src/contexts/auth-context";

WebBrowser.maybeCompleteAuthSession();

const API_URL = process.env.EXPO_PUBLIC_API || "http://localhost:3000";

const redirectUri = AuthSession.makeRedirectUri( {
  scheme: "broglow-app",
  path: "/login",
} );

export default function LoginScreen ()
{
  const logoGoogle = require( "../assets/images/icons8-google-48.png" );
  const router = useRouter();
  const { login } = useAuth();
  const [ email, setEmail ] = useState( "" );
  const [ password, setPassword ] = useState( "" );
  const [ showPassword, setShowPassword ] = useState( false );
  const [ loading, setLoading ] = useState( false );
  const [ googleLoading, setGoogleLoading ] = useState( false );

  const handleLogin = async () =>
  {
    if ( !email || !password )
    {
      Alert.alert( "Lỗi", "Vui lòng nhập đầy đủ email và mật khẩu" );
      return;
    }

    setLoading( true );
    try
    {
      await login( email, password );
      router.navigate( "/(tabs)/home" );
    } catch ( error )
    {
      Alert.alert(
        "Lỗi đăng nhập",
        error instanceof Error ? error.message : "Đã xảy ra lỗi"
      );
      console.log( error );
    } finally
    {
      setLoading( false );
    }
  };

  const handleGoogleLogin = async () =>
  {
    setGoogleLoading( true );
    try
    {
      const authUrl = `${ API_URL }/auth/google`;
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        redirectUri
      );

      if ( result.type === "success" && result.url )
      {
        const url = new URL( result.url );
        const code = url.searchParams.get( "code" );

        if ( code )
        {
          await AuthService.redirectGoogleLogin( code );
          Alert.alert( "Thành công", "Đăng nhập Google thành công!", [
            { text: "OK", onPress: () => router.replace( "/(tabs)/home" ) },
          ] );
        }
      }
    } catch ( error )
    {
      Alert.alert(
        "Lỗi Google Sign In",
        error instanceof Error ? error.message : "Đã xảy ra lỗi"
      );
    } finally
    {
      setGoogleLoading( false );
    }
  };

  const handleForgotPassword = () =>
  {
    router.push( "/forgot-password" as Href );
  };

  const handleSignUp = () =>
  {
    router.replace( "/register" as Href );
  };

  return (
    <SafeAreaView style={ styles.container }>
      <KeyboardAvoidingView
        behavior={ Platform.OS === "ios" ? "padding" : "height" }
        style={ styles.container }
      >
        <ScrollView
          contentContainerStyle={ styles.scrollContent }
          showsVerticalScrollIndicator={ false }
        >
          {/* Logo
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo-text.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View> */}


          {/* Header */ }
          <View style={ styles.header }>
            <View style={ styles.headerIconContainer }>
              <TouchableOpacity
                onPress={ () => router.back() }
                style={ styles.backButton }
              >
                <Ionicons name="arrow-back" size={ 24 } color="#171B2E" />
              </TouchableOpacity>
            </View>
            <View style={ styles.headerTitleContainer }>
              <Text style={ styles.headerText }>Đăng nhập</Text>
            </View>
          </View>

          {/* Form */ }
          <View style={ styles.formContainer }>
            {/* Email Input */ }
            <View style={ styles.inputContainer }>
              <Text style={ styles.inputLabel }>Email</Text>
              <TextInput
                style={ styles.input }
                placeholder="Email đã đăng ký"
                value={ email }
                onChangeText={ setEmail }
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={ false }
                placeholderTextColor={ '#9496A5' }
              />
            </View>

            {/* Password Input */ }
            <View style={ styles.inputContainer }>
              <Text style={ styles.inputLabel }>Mật khẩu</Text>
              <View style={ styles.passwordContainer }>
                <TextInput
                  style={ styles.passwordInput }
                  placeholder="Mật khẩu của bạn"
                  value={ password }
                  onChangeText={ setPassword }
                  secureTextEntry={ !showPassword }
                  autoCapitalize="none"
                  autoCorrect={ false }
                />
                <TouchableOpacity
                  onPress={ () => setShowPassword( !showPassword ) }
                  style={ styles.eyeIcon }
                >
                  <Ionicons
                    name={ showPassword ? "eye-off-outline" : "eye-outline" }
                    size={ 24 }
                    color="#9496A5"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */ }
            <TouchableOpacity
              onPress={ handleForgotPassword }
              style={ styles.forgotPasswordContainer }
            >
              <Text style={ styles.forgotPasswordText }>Quên mật khẩu?</Text>
            </TouchableOpacity>

            {/* Login Button */ }
            <TouchableOpacity
              style={ [
                styles.loginButton,
                loading && styles.loginButtonDisabled,
              ] }
              onPress={ handleLogin }
              disabled={ loading }
            >
              { loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={ styles.loginButtonText }>Đăng Nhập</Text>
              ) }
            </TouchableOpacity>

            {/* Divider */ }
            {/* <View style={styles.dividerContainer}> */ }
            {/* <View style={styles.dividerLine} /> */ }
            {/* <Text style={styles.dividerText}>hoặc</Text> */ }
            {/* <View style={styles.dividerLine} /> */ }
            {/* </View> */ }

            {/* Google Login Button */ }
            {/* <TouchableOpacity
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

        {/* Sign Up Link - Moved to bottom */ }
        <View style={ styles.signUpContainer }>
          <Text style={ styles.signUpText }>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={ handleSignUp }>
            <Text style={ styles.signUpLink }>Đăng ký ngay!</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create( {
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    // paddingTop: 40,
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
  logoContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  logoImage: {
    width: 220,
    height: 120,
  },
  formContainer: {
    flex: 1,
    paddingVertical: 50,
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
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: "#616161",
    fontSize: 14,
    fontWeight: "400",
  },
  loginButton: {
    backgroundColor: "#1584F2",
    borderRadius: 28,
    padding: 16,
    alignItems: "center",
    marginBottom: 24,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
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
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
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
} );

