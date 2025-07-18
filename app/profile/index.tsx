import { useAuth } from "@/src/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  hasArrow?: boolean;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  rightText?: string;
  onPress?: () => void;
}

const ProfileScreen: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [isNotify, setIsNotify] = useState(true);
  const router = useRouter();
  const { logout } = useAuth();

  const mainMenuItems: MenuItem[] = [
    {
      icon: "person-outline",
      title: "Thông tin tài khoản",
      hasArrow: true,
      onPress: () => router.push("/profile/edit-profile"),
    },
    {
      icon: "lock-closed-outline",
      title: "Đổi mật khẩu",
      hasArrow: true,
      onPress: () => router.push("/profile/change-password"),
    },
    {
      icon: "shield-checkmark-outline",
      title: "Xác thực 2 yếu tố",
      hasArrow: true,
      onPress: () => router.push("/profile/factor-verify"),
    },
    {
      icon: "card-outline",
      title: "Phương thức thanh toán",
      hasArrow: true,
      // onPress: () => router.push("/profile/payment"),
    },
  ];

  const settingsItems: MenuItem[] = [
    {
      icon: "language-outline",
      title: "Ngôn ngữ",
      rightText: "Tiếng Việt",
      hasArrow: true,
    },
    {
      icon: "moon-outline",
      title: "Chế độ tối",
      hasSwitch: true,
      switchValue: isDark,
      onSwitchChange: setIsDark,
    },
    {
      icon: "notifications-outline",
      title: "Thông báo",
      hasSwitch: true,
      switchValue: isNotify,
      onSwitchChange: setIsNotify,
    },
  ];

  const handleBackPress = () => {
    router.back();
  };

  const handleLogout = () => {
    logout();
  };

  const renderMenuItem = (item: MenuItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.menuItem}
      activeOpacity={0.7}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Ionicons name={item.icon} size={20} color="#666" />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {item.rightText && (
          <Text style={styles.rightText}>{item.rightText}</Text>
        )}
        {item.hasSwitch && item.onSwitchChange && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: "#E5E5E5", true: "#007AFF" }}
            thumbColor="#FFFFFF"
          />
        )}
        {item.hasArrow && (
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tài khoản</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=face",
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.profileName}>Bui Duc Hoang</Text>
          <Text style={styles.profileUsername}>@bd_hoag</Text>
        </View>

        {/* Main Menu Items */}
        <View style={styles.menuSection}>
          {mainMenuItems.map((item, index) => (
            <View key={index}>
              {/* Add divider before "Phương thức thanh toán" (index 3) */}
              {index === 3 && <View style={styles.divider} />}
              {renderMenuItem(item, index)}
              {/* Add divider after "Phương thức thanh toán" (index 3) */}
              {index === 3 && <View style={styles.dividerBottom} />}
            </View>
          ))}
        </View>

        {/* Settings Items */}
        <View style={styles.menuSection}>
          {settingsItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.removeButton} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.removeText}>Xoá tài khoản</Text>
        </TouchableOpacity>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomColor: "#E5E5E5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    marginRight: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
    textAlign: "auto",
  },
  headerSpacer: {
    width: 32,
  },
  headerTime: {
    fontSize: 14,
    color: "#8E8E93",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#000000",
    marginBottom: 16,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 14,
    color: "#8E8E93",
  },
  menuSection: {
    marginBottom: 15,
  },
  menuItem: {
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightText: {
    fontSize: 14,
    color: "#8E8E93",
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 20,
    marginHorizontal: 8,
  },
  dividerBottom: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginVertical: 11,
    marginHorizontal: 8,
  },
  logoutButton: {
    backgroundColor: "#ffcccc",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  removeButton: {
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff6666",
  },
  removeText: {
    textDecorationLine: "underline",
  },
  bottomSpacing: {
    height: 32,
  },
});

export default ProfileScreen;
