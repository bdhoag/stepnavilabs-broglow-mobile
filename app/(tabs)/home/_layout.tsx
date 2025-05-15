import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTintColor: "#000",
        headerShadowVisible: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="skin-profile"
        options={{
          title: "Xác định hồ sơ da",
        }}
      />
      <Stack.Screen
        name="skin-care-routine"
        options={{
          title: "Gợi ý chu trình chăm sóc da",
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: "Khám phá",
        }}
      />
      <Stack.Screen
        name="subscription"
        options={{
          title: "Gói đăng ký",
        }}
      />
    </Stack>
  );
}
