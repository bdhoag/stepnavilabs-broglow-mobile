import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const [selectedTab, setSelectedTab] = useState<"ai" | "expert">("ai");

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header - Tab Switch */}
      <View className="flex-row">
        <View className="flex-row bg-[#02AAEB] pt-1 w-full h-12">
          {/* Tab BroGlow AI */}
          <Pressable
            className={`flex-1 flex-row items-center justify-center h-full py-2 ${
              selectedTab === "ai" ? "bg-white rounded-t-xl " : "bg-[#02AAEB]"
            } `}
            style={{ zIndex: selectedTab === "ai" ? 2 : 1 }}
            onPress={() => setSelectedTab("ai")}
          >
            <Text
              className={`text-base font-semibold ${
                selectedTab === "ai" ? "text-[#02AAEB]" : "text-white"
              }`}
            >
              BroGlow AI
            </Text>
            {selectedTab === "ai" && (
              <Feather
                name="chevron-down"
                size={18}
                color="#02AAEB"
                style={{ marginLeft: 4 }}
              />
            )}
          </Pressable>
          {/* Tab Chuyên gia */}
          <Pressable
            className={`flex-1 items-center justify-center h-full py-2 ${
              selectedTab === "expert"
                ? "bg-white rounded-t-xl"
                : "bg-[#02AAEB]"
            } flex-row`}
            style={{ zIndex: selectedTab === "expert" ? 2 : 1 }}
            onPress={() => setSelectedTab("expert")}
          >
            <Text
              className={`text-base font-semibold ${
                selectedTab === "expert" ? "text-[#02AAEB]" : "text-white"
              }`}
            >
              Chuyên gia
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Body - Logo center */}
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("../../../assets/images/logo-text.png")}
          className="h-36"
          resizeMode="contain"
        />
      </View>

      {/* Footer - Chat input */}
      <View className="flex-row items-center px-2 pb-4 pt-2 bg-white">
        <Pressable className="p-2">
          <Feather name="plus" size={24} color="#02AAEB" />
        </Pressable>
        <View className="flex-1 mx-2 rounded-full bg-[#F5F5F5] flex-row items-center px-4">
          <TextInput
            className="flex-1 py-2 text-base"
            placeholder="Gửi tin nhắn..."
            placeholderTextColor="#B0B0B0"
          />
        </View>
        <Pressable className="p-2">
          <Feather name="send" size={24} color="#02AAEB" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
