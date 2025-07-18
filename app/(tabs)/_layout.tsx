import { ChatIcon, ChatOutlineIcon } from "@/src/components/svg/chat-icon";
// import HistoryIcon from "@/src/components/svg/history-icon";
import { HistoryIcon, HistoryOutlineIcon } from "@/src/components/svg/history-icon";
import { HomeIcon, HomeOutlineIcon } from "@/src/components/svg/home-icon";
import ScannerIcon from "@/src/components/svg/scanner-icon";
import { ShopIcon, ShopOutlineIcon } from "@/src/components/svg/shop-icon";
import { Feather } from "@expo/vector-icons";
import { Route, router, Tabs, usePathname } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AuthGuard from "../../src/components/auth-guard";
import { useAuth } from "../../src/contexts/auth-context";

// Import your custom icons


export default function TabsLayout ()
{
  const { user } = useAuth();
  const username = user?.firstName || "User";
  const pathname = usePathname();
  // const isChatScreen = pathname && pathname.includes( "/chat" );

  // Check if we're on scan screen
  const isOnScanScreen = pathname && pathname.includes( "/scan" );
  const isBlogScreen = pathname && pathname.includes( "/blog" );

  return (
    <AuthGuard>
      <SafeAreaProvider>
        <View
          style={ {
            flex: 1,
            backgroundColor: "#FFFFFF",
          } }
        >
          { !(
            pathname &&
            ( pathname.includes( "/chat" ) || pathname.includes( "/notification" ) || pathname.includes( "/scan" ) || pathname.includes( "/blog" ) )
          ) && (
              <SafeAreaView className="">
                <View className="flex-row items-center justify-between pt-6 mx-5">
                  <View className="flex-row items-center gap-2.5">
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/profile");
                    }}
                  >
                    <View className="w-12 h-12 overflow-hidden bg-gray-300 rounded-2xl">
                      <Image
                        source={{ uri: "https://via.placeholder.com/150" }}
                        className="w-full h-full"
                      />
                    </View>
                  </TouchableOpacity>
                    <View className="flex-col items-start" style={ { flex: 1, maxWidth: '50%' } }>
                      <Text className="text-lg font-quicksand" numberOfLines={ 1 } ellipsizeMode="tail">
                        Xin chào, <Text className="font-quicksand-bold">{ username }</Text>
                      </Text>
                      <Text className="text-sm font-quicksand-light">
                        Da bạn thế nào rồi?
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2.5">
                    <TouchableOpacity
                      className="bg-[#1E233A] rounded-full px-2 py-2.5"
                      onPress={ () => { 
                        router.push( "/(tabs)/home/subscription" as Route )
                      } }
                    >
                      <Text className="text-xs text-center text-white font-quicksand">
                        Nâng Cấp Gói
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-[#E3F2FD] rounded-full p-2.5"
                      onPress={ () =>
                      {
                        router.push( "/(tabs)/home/notification" as any ); // Navigate to notification screen
                      } }
                    >
                      <Feather name="bell" size={ 20 } color="#333" />
                    </TouchableOpacity>

                  </View>
                </View>
              </SafeAreaView>
            ) }

          <Tabs
            screenOptions={ ( { route } ) => ( {
              headerShown: false,
              tabBarShowLabel: false,
              // Hide tab bar when on scan screen
              tabBarStyle: ( isOnScanScreen || isBlogScreen )
                ? { display: "none" }
                : {
                  height: 90,
                  borderTopWidth: 0,
                  borderTopLeftRadius: 25,
                  borderTopRightRadius: 25,
                  backgroundColor: "#FFFFFF",
                  position: "relative",
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: -2,
                  },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 8,
                },
              tabBarItemStyle: {
                height: "100%",
                justifyContent: "center",
                paddingVertical: 10,
              },
              tabBarIconStyle: {
                margin: "auto",
              },
              tabBarPressColor: "#FFFFFF",
              pressColor: "#FFFFFF",
              tabBarIcon: ( { color, size, focused } ) =>
              {
                // Define the icon color based on focus state - using more subtle colors like in the reference
                // const iconColor = focused ? "#1584F2" : "#8E8E93";

                // Handle the special scan button with custom styling - positioned slightly higher
                if ( route.name === "scan" )
                {
                  return (
                    <View
                      style={ {
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: '#1584F2',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: -50, // Slight upward adjustment without absolute positioning
                        shadowColor: '#1584F2',
                        shadowOffset: {
                          width: 0,
                          height: 4,
                        },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 8,
                      } }
                    >
                      <ScannerIcon width={ 28 } height={ 28 } fill="#ffffff" />
                    </View>
                  );
                }

                // Define which custom icon to use for each route
                let IconComponent;
                switch ( route.name )
                {
                  case "home":
                    IconComponent = focused ? HomeIcon : HomeOutlineIcon;
                    break;
                  case "chat":
                    IconComponent = focused ? ChatIcon : ChatOutlineIcon;
                    break;
                  case "progress":
                    IconComponent = focused ? HistoryIcon : HistoryOutlineIcon;
                    break;
                  case "product":
                    IconComponent = focused ? ShopIcon : ShopOutlineIcon;
                    break;
                  default:
                    // Fallback to a Feather icon if route not recognized
                    return (
                      <View
                        style={ {
                          width: 46,
                          height: 46,
                          borderRadius: 23,
                          backgroundColor: focused ? '#E3F2FD' : 'transparent',
                          justifyContent: 'center',
                          alignItems: 'center',
                        } }
                      >
                        <Feather name="help-circle" size={ 24 } />
                      </View>
                    );
                }

                // Render the custom icon with proper styling that matches the reference design
                return (
                  <View
                    style={ {
                      width: 46,
                      height: 46,
                      borderRadius: 23,
                      backgroundColor: focused ? '#E3F2FD' : 'transparent', // Light blue background when active
                      justifyContent: 'center',
                      alignItems: 'center',
                    } }
                  >
                    <IconComponent
                      width={ 24 }
                      height={ 24 }
                    // color={ iconColor }
                    />
                  </View>
                );
              },
            } ) }
          >
            <Tabs.Screen
              name="home"
              options={ {
                title: "Home",
              } }
            />
            <Tabs.Screen
              name="chat"
              options={ {
                title: "Chat",
              } }
            />
            <Tabs.Screen
              name="scan"
              options={ {
                title: "Scan",
              } }
            />
            <Tabs.Screen
              name="progress"
              options={ {
                title: "Progress",
              } }
            />
            <Tabs.Screen
              name="product"
              options={ {
                title: "Product",
              } }
            />
          </Tabs>
        </View>
      </SafeAreaProvider>
    </AuthGuard >
  );
}