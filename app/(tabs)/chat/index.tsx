import AuthGuard from "@/src/components/auth-guard";
import { AIService } from "@/src/services/AI.service";
import { Feather } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import
{
  Alert,
  Dimensions,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

const { width } = Dimensions.get( "window" );

// Định nghĩa kiểu cho thread
interface Thread
{
  _id: string;
  name: string;
  createdAt: string;
}

const ChatHistoryScreen = () =>
{
  const isFocused = useIsFocused();
  const [ threads, setThreads ] = useState<Thread[]>( [] );
  const [ loading, setLoading ] = useState<boolean>( true );
  const [ error, setError ] = useState<string | null>( null );
  const [ activeTab, setActiveTab ] = useState<"ai" | "expert">( "ai" );
  const [ selectedThread, setSelectedThread ] = useState<string | null>( null );
  const router = useRouter();

  useEffect( () =>
  {
    const fetchThreads = async () =>
    {
      console.log( "Fetching threads..." );
      try
      {
        setLoading( true );
        const response = await AIService.listThreadsByUser();
        setError( null );
        setThreads( response.data );
      } catch ( err: any )
      {
        setError( "Không thể tải danh sách đoạn chat." );
        console.error( err );
      } finally
      {
        setLoading( false );
      }
    };
    if ( isFocused )
    {
      fetchThreads();
    }

  }, [ isFocused ] );

  const handleNewChat = () =>
  {
    router.push( "/chat/new-chat" );
  };

  const handleThreadSelect = ( thread: Thread ) =>
  {
    setSelectedThread( thread._id );
    router.push( {
      pathname: "/chat/continue-chat",
      params: { threadId: thread._id },
    } );
  };

  const handleDeleteThread = ( threadId: string ) =>
  {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc muốn xóa đoạn chat này?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: async () =>
          {
            try
            {
              await AIService.deleteThread( threadId );
              setThreads( ( prev ) => prev.filter( ( t ) => t._id !== threadId ) );
            } catch ( error )
            {
              console.error( "Lỗi khi xóa đoạn chat:", error );
              setError( "Không thể xóa đoạn chat. Vui lòng thử lại." );
            }
          },
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const handleTabPress = ( tab: "ai" | "expert" ) =>
  {
    if ( tab === "expert" )
    {
      router.push( "/chat/expert" );
    } else
    {
      setActiveTab( tab );
    }
  };

  const renderThread = ( { item }: { item: Thread } ) =>
  {
    const renderRightActions = () => (
      <View style={ { justifyContent: "center", alignItems: "center" } }>
        <Pressable
          style={ {
            backgroundColor: "#EF4444",
            justifyContent: "center",
            alignItems: "center",
            width: 70,
            height: 70,
            borderTopRightRadius: 12,
            borderBottomRightRadius: 12,
            marginBottom: 10,
          } }
          onPress={ () => handleDeleteThread( item._id ) }
        >
          <Feather name="trash-2" size={ 20 } color="#fff" />
        </Pressable>
      </View>
    );

    return (
      <Swipeable renderRightActions={ renderRightActions }>
        <Pressable
          style={ [
            styles.threadContainer,
            selectedThread === item._id && styles.selectedThread,
          ] }
          onPress={ () => handleThreadSelect( item ) }
        >
          <View style={ styles.threadContent }>
            <Text style={ styles.threadTitle }>{ item.name }</Text>
            <Text style={ styles.threadDate }>{ item.createdAt }</Text>
          </View>

          <View style={ styles.threadActions }>
            <Feather name="chevron-right" size={ 20 } color="#000" />
          </View>
        </Pressable>
      </Swipeable>
    );
  };

  return (
    <AuthGuard>
      <SafeAreaView style={ styles.container }>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Tab Navigation */ }
        <View style={ styles.tabContainer }>
          <Pressable
            style={ [ styles.tab, activeTab === "ai" && styles.activeTab ] }
            onPress={ () => handleTabPress( "ai" ) }
          >
            <Text
              style={ [ styles.tabText, activeTab === "ai" && styles.activeTabText ] }
            >
              BroGlow AI
            </Text>
          </Pressable>
          <Pressable
            style={ [ styles.tab, activeTab === "expert" && styles.activeTab ] }
            onPress={ () => handleTabPress( "expert" ) }
          >
            <Text
              style={ [
                styles.tabText,
                activeTab === "expert" && styles.activeTabText,
              ] }
            >
              Chuyên Gia
            </Text>
          </Pressable>
        </View>

        {/* New Chat Button */ }
        <View style={ styles.newChatContainer }>
          <Pressable style={ styles.newChatButton } onPress={ handleNewChat }>
            <Feather name="plus" size={ 18 } color="#1584f9" />
            <Text style={ styles.newChatText }>Đoạn chat mới</Text>
          </Pressable>
        </View>

        {/* Chat History List */ }
        { loading ? (
          <Text style={ { textAlign: "center", marginTop: 20 } }>Đang tải...</Text>
        ) : error ? (
          <Text style={ { textAlign: "center", marginTop: 20, color: "red" } }>{ error }</Text>
        ) : (
          <FlatList
            data={ threads }
            renderItem={ renderThread }
            keyExtractor={ ( item ) => item._id }
            contentContainerStyle={ styles.listContainer }
            showsVerticalScrollIndicator={ false }
          />
        ) }
      </SafeAreaView>
    </AuthGuard>
  );
};

const styles = StyleSheet.create( {
  container: {
    paddingVertical: 10,
    paddingHorizontal: 5,
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#F3F4F6",
    borderRadius: 25,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#3B82F6",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  newChatContainer: {
    marginTop: 30,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  newChatButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#cceaff",
    borderRadius: 12,
  },
  newChatText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#1584f9",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  threadContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedThread: {
    backgroundColor: "#EFF6FF",
  },
  threadContent: {
    flex: 1,
  },
  threadTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 4,
  },
  threadDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  threadActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  avatarContainer: {
    position: "absolute",
    bottom: 80,
    left: width / 2 - 24,
  },
  avatar: {
    width: 48,
    height: 48,
    backgroundColor: "#3B82F6",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEmoji: {
    fontSize: 20,
  },
  bottomNavigation: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  navItem: {
    padding: 8,
  },
} );

export default ChatHistoryScreen;
