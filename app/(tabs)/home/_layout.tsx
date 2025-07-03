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
        name="skin-profile/index"
        options={{
          title: "Xác định hồ sơ da",
          headerShown: false,
          presentation: 'fullScreenModal', // Ẩn tab bar
        }}
      />
      <Stack.Screen
        name="skincare-routine/index"
        options={{
          title: "Gợi ý chu trình chăm sóc da",
        }}
      />
      <Stack.Screen
        name="notification/index"
        options={{

          title: "Thông báo",
        }}
      />
      <Stack.Screen
        name="explore/index"
        options={{
          title: "Khám phá",
        }}
      />
      <Stack.Screen
        name="subscription/index"
        options={{
          title: "Gói đăng ký",
        }}
      />
    </Stack>
  );
}
