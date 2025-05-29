import { Feather } from "@expo/vector-icons";
import { Tabs, usePathname } from "expo-router";
import { Image, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
  // This would typically come from your auth or user context
  const username = "Joe"; // Replace with actual username logic
  const pathname = usePathname();

  return (
    <SafeAreaProvider>
      {!(pathname && pathname.includes("/chat")) && (
        <SafeAreaView className="">
          {/* Custom Header - Ẩn khi ở tab chat */}
          <View className="flex-row justify-between items-center px-4 py-3">
            <Text className="text-lg font-bold">Hello {username}</Text>
            <View className="flex-row items-center gap-2.5">
              <Feather name="bell" size={20} color="#333" />
              <View className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  className="w-full h-full"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      )}

      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false, // Hide the default header
          tabBarActiveTintColor: "#2DC0FF",
          tabBarShowLabel: false,
          tabBarStyle: {
            height: 110,
            borderTopWidth: 0,
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarItemStyle: {
            height: "100%",
            justifyContent: "center",
          },
          tabBarIconStyle: {
            margin: "auto",
          },
          tabBarPressColor: "#D9F1FC",
          pressColor: "#D9F1FC",
          tabBarIcon: ({ color, size, focused }) => {
            let iconName: React.ComponentProps<typeof Feather>["name"] =
              "help-circle";

            if (route.name === "home") {
              iconName = "home";
            } else if (route.name === "chat") {
              iconName = "message-circle";
            } else if (route.name === "scan") {
              return (
                <View className="absolute w-20 h-20 rounded-full bg-[#02AAEB] flex items-center justify-center">
                  <Feather name="camera" size={44} color="#ffffff" />
                </View>
              );
            } else if (route.name === "progress") {
              iconName = "bar-chart";
            } else if (route.name === "product") {
              iconName = "shopping-cart";
            }

            if (route.name !== "scan") {
              return (
                <View
                  className={
                    focused
                      ? "bg-[#D9F1FC] p-3 flex items-center justify-center h-14 w-14 rounded-xl"
                      : ""
                  }
                >
                  <Feather name={iconName} size={25} color={color} />
                </View>
              );
            }

            return null;
          },
        })}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: "Chat",
          }}
        />
        <Tabs.Screen
          name="scan"
          options={{
            title: "Scan",
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
          }}
        />
        <Tabs.Screen
          name="product"
          options={{
            title: "Product",
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
