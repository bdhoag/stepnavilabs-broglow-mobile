import React from "react";
import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center flex-1 px-6">
        {/* Logo */}
        <View className="items-center mb-10">
          <Image
            source={require("../../assets/images/logo-text.png")}
            className="mb-5 h-36"
            resizeMode="contain"
          />
        </View>

        {/* Loading Indicator */}
        <ActivityIndicator size="large" color="#3B82F6" className="mt-5" />
      </View>
    </SafeAreaView>
  );
}
