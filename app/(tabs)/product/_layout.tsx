import { Stack } from "expo-router";

export default function ProductLayout() {
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
    </Stack>
  );
}
