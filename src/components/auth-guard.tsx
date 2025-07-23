import { useRouter } from "expo-router";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../contexts/auth-context";
import LoadingScreen from "./loading-screen";

interface AuthGuardProps
{
  children: ReactNode;
}

export default function AuthGuard ( { children }: AuthGuardProps )
{
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Xử lý khi đang tải trạng thái xác thực
  if ( isLoading )
  {
    return <LoadingScreen />;
  }

  const handleLoginPress = () =>
  {
    // Điều hướng đến trang đăng nhập của bạn
    // Thay đổi '/login' thành đường dẫn chính xác của bạn
    console.log( "Redirecting to onboarding..." );
    router.navigate( "/onboarding" );
  };

  // Logic hiển thị chính
  return (
    <View style={ styles.container }>
      {/* Luôn render children ở phía dưới */ }
      { children }

      {/* Nếu chưa xác thực, hiển thị lớp overlay */ }
      { !isAuthenticated && (
        <View style={ styles.overlay }>
          <View style={ styles.modalContent }>
            <Text style={ styles.modalText }>
              Vui lòng đăng nhập để sử dụng tính năng này.
            </Text>
            <Pressable style={ styles.loginButton } onPress={ handleLoginPress }>
              <Text style={ styles.loginButtonText }>Đăng nhập</Text>
            </Pressable>
          </View>
        </View>
      ) }
    </View>
  );
}

// Styles cho component
const styles = StyleSheet.create( {
  container: {
    flex: 1,
  },
  overlay: {
    // Lớp phủ chiếm toàn bộ màn hình và nằm trên cùng
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // Nền mờ
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10, // Đảm bảo nó luôn ở trên
  },
  modalContent: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  loginButton: {
    backgroundColor: "#1584F2", // Màu xanh dương đặc trưng của iOS
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
} );

