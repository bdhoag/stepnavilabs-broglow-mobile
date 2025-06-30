import { Quicksand_300Light, Quicksand_400Regular, Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold, useFonts } from "@expo-google-fonts/quicksand";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { AuthProvider } from "../src/contexts/auth-context";

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout ()
{
  const [ fontsLoaded ] = useFonts( {
    Quicksand_400Regular,
    Quicksand_700Bold,
    Quicksand_600SemiBold,
    Quicksand_500Medium,
    Quicksand_300Light,
  } );

  useEffect( () =>
  {
    if ( fontsLoaded )
    {
      SplashScreen.hideAsync();
    }
  }, [ fontsLoaded ] );

  if ( !fontsLoaded )
  {
    return null;
  }
  console.log( "Fonts loaded successfully", fontsLoaded );
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgot-password"
            options={ { headerShown: false } }
          />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
