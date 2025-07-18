import { useAuth } from "@/src/contexts/auth-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EditProfileScreen: React.FC = () => {
  const { logout } = useAuth();

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
        <Text style={styles.headerTitle}>Thông tin tài khoản</Text>
      </View>

      {/* Nội dung có thể cuộn */}
      <View style={styles.contentWrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 100 }} // chừa khoảng trống bên dưới
          showsVerticalScrollIndicator={false}
        >
          {/* Nội dung */}
          <View style={styles.content}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&crop=face",
                  }}
                  style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editButton}>
                  <Ionicons name="pencil" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.dividerLine} />
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              {/* Username */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>bd_hoag</Text>
                </View>
              </View>

              {/* Name */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Họ tên</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>Bui Duc Hoang</Text>
                </View>
              </View>

              {/* Phone */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputText}>012 345 6789</Text>
                </View>
              </View>

              {/* Date of Birth */}
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Ngày sinh</Text>
                <View style={styles.inputContainerWithIcon}>
                  <Text style={styles.inputText}>27/03/2003</Text>
                  <Ionicons name="calendar-outline" size={20} color="#3B82F6" />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Nút lưu cố định bên dưới */}
      <View style={styles.fixedSaveButton}>
        <LinearGradient
          colors={["#00bfff", "#1e90ff", "#1e90ff"]}
          locations={[0, 0.5, 1]}
          style={styles.saveButton}
        >
          <TouchableOpacity style={styles.saveButtonInner}>
            <Text style={styles.saveButtonText}>Lưu</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

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
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 24,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 56,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  dividerLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 8,
  },
  formContainer: {
    marginBottom: 32,
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
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderRadius: 30,
  },
  inputContainerWithIcon: {
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputText: {
    fontSize: 15,
    color: "#6B7280",
  },
  saveButton: {
    borderRadius: 50,
    marginHorizontal: 8,
    marginBottom: 24,
  },
  saveButtonInner: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  contentWrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  fixedSaveButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: "#ffffff",
  },
});

export default EditProfileScreen;
