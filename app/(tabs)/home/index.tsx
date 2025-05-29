import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

type Route =
  | "/home/skin-profile"
  | "/home/skincare-routine"
  | "/home/explore"
  | "/home/subscription";

export default function TabsIndex() {
  const options = [
    {
      title: "Xác định hồ sơ da",
      image: require("../../../assets/images/home/skin-profile.png"),
      bgColor: "#FFF7F6",
      route: "/home/skin-profile" as Route,
    },
    {
      title: "Gợi ý chu trình chăm sóc",
      image: require("../../../assets/images/home/skincare-routine-suggestion.png"),
      bgColor: "#FEF9C3",
      route: "/home/skincare-routine" as Route,
    },
    {
      title: "Khám phá",
      image: require("../../../assets/images/home/explore.png"),
      bgColor: "#D6FFF1",
      route: "/home/explore" as Route,
    },
    {
      title: "Gói đăng ký",
      image: require("../../../assets/images/home/subcription.png"),
      bgColor: "#FFFFFF",
      route: "/home/subscription" as Route,
    },
  ];

  // Group options into pairs
  const optionPairs = [];
  for (let i = 0; i < options.length; i += 2) {
    optionPairs.push(options.slice(i, i + 2));
  }

  return (
    <ScrollView className="flex-1">
      <View className="flex-1 px-3 pt-4 pb-6">
        {optionPairs.map((pair, pairIndex) => (
          <View key={pairIndex} className="flex-row gap-2 mb-4">
            {pair.map((option, index) => (
              <View key={index} className="flex-1">
                <Pressable
                  className="rounded-2xl overflow-hidden"
                  style={{ backgroundColor: option.bgColor }}
                  onPress={() => router.push(option.route)}
                >
                  <View className="p-4 items-center">
                    <Image
                      source={option.image}
                      className="w-28 h-20 mb-2"
                      resizeMode="contain"
                    />
                  </View>
                  <View className="bg-white p-4">
                    <Text className="text-center text-base font-semibold">
                      {option.title}
                    </Text>
                  </View>
                </Pressable>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
