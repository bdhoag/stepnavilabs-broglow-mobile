import { Href, useRouter } from "expo-router";
import React, { useEffect } from "react";
import LoadingScreen from "../src/components/loading-screen";
import { useAuth } from "../src/contexts/auth-context";

export default function IndexScreen ()
{
  console.log( "🔥 IndexScreen is rendering!" );

  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Debug logs
  console.log( "Index Screen - Auth State:", { isAuthenticated, isLoading } );

  useEffect( () =>
  {
    console.log( "Index useEffect triggered:", { isAuthenticated, isLoading } );
    if ( !isLoading )
    {
      // if (isAuthenticated) {
      //   console.log("Redirecting to home...");
      //   router.replace("/(tabs)/home" as Href);
      // } else {
      //   console.log("Redirecting to onboarding...");
      //   router.replace("/onboarding" as Href);
      // }
      console.log( "Redirecting to home..." );
      router.replace( "/(tabs)/home" as Href );
    }
  }, [ isAuthenticated, isLoading, router ] );

  return <LoadingScreen />;
}
