import { AIService } from "@/src/services/AI.service";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useReducer, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AssistantMessage from "../../../src/components/chat/AssistantMessage";
import AttachmentMenu from "../../../src/components/chat/AttachmentMenu";
import TypingIndicator from "../../../src/components/chat/TypingIndicator";
import UserMessage from "../../../src/components/chat/UserMessage";

interface Thread {
  _id: string;
  name?: string;
  description?: string;
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  images?: string[];
  isTyping?: boolean;
}

// State interface
interface ChatState {
  selectedTab: "ai" | "expert";
  showDropdown: boolean;
  threads: Thread[];
  selectedThread: Thread | null;
  isNewConversation: boolean;
  loading: boolean;
  messages: Message[];
  input: string;
  sending: boolean;
  showAttachmentMenu: boolean;
  attachedImages: { uri: string }[];
}

// Action types
type ChatAction =
  | { type: "SET_SELECTED_TAB"; payload: "ai" | "expert" }
  | { type: "SET_SHOW_DROPDOWN"; payload: boolean }
  | { type: "SET_THREADS"; payload: Thread[] }
  | { type: "SET_SELECTED_THREAD"; payload: Thread | null }
  | { type: "SET_IS_NEW_CONVERSATION"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_MESSAGES"; payload: Message[] }
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "UPDATE_MESSAGE"; payload: { id: string; content: string } }
  | { type: "REMOVE_MESSAGE"; payload: string }
  | {
      type: "UPDATE_OR_ADD_ASSISTANT_MESSAGE";
      payload: { id: string; content: string };
    }
  | { type: "SET_INPUT"; payload: string }
  | { type: "SET_SENDING"; payload: boolean }
  | { type: "SET_SHOW_ATTACHMENT_MENU"; payload: boolean }
  | { type: "SET_ATTACHED_IMAGES"; payload: { uri: string }[] }
  | { type: "ADD_ATTACHED_IMAGE"; payload: { uri: string } }
  | { type: "REMOVE_ATTACHED_IMAGE"; payload: number }
  | { type: "TOGGLE_DROPDOWN" }
  | { type: "RESET_CONVERSATION" };

// Initial state
const initialState: ChatState = {
  selectedTab: "ai",
  showDropdown: false,
  threads: [],
  selectedThread: null,
  isNewConversation: false,
  loading: false,
  messages: [],
  input: "",
  sending: false,
  showAttachmentMenu: false,
  attachedImages: [],
};

// Reducer function
function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_SELECTED_TAB":
      return { ...state, selectedTab: action.payload };
    case "SET_SHOW_DROPDOWN":
      return { ...state, showDropdown: action.payload };
    case "SET_THREADS":
      return { ...state, threads: action.payload };
    case "SET_SELECTED_THREAD":
      return { ...state, selectedThread: action.payload };
    case "SET_IS_NEW_CONVERSATION":
      return { ...state, isNewConversation: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_MESSAGES":
      return { ...state, messages: action.payload };
    case "ADD_MESSAGE":
      return { ...state, messages: [action.payload, ...state.messages] };
    case "UPDATE_MESSAGE":
      return {
        ...state,
        messages: state.messages.map((msg) =>
          msg.id === action.payload.id
            ? { ...msg, content: action.payload.content }
            : msg
        ),
      };
    case "REMOVE_MESSAGE":
      return {
        ...state,
        messages: state.messages.filter((msg) => msg.id !== action.payload),
      };
    case "UPDATE_OR_ADD_ASSISTANT_MESSAGE":
      const filtered = state.messages.filter(
        (m) => m.id !== "typing-indicator"
      );
      const exists = filtered.find((m) => m.id === action.payload.id);
      if (exists) {
        return {
          ...state,
          messages: filtered.map((m) =>
            m.id === action.payload.id
              ? { ...m, content: action.payload.content }
              : m
          ),
        };
      } else {
        const newMsg: Message = {
          id: action.payload.id,
          content: action.payload.content,
          role: "assistant",
        };
        return {
          ...state,
          messages: [newMsg, ...filtered],
        };
      }
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "SET_SENDING":
      return { ...state, sending: action.payload };
    case "SET_SHOW_ATTACHMENT_MENU":
      return { ...state, showAttachmentMenu: action.payload };
    case "SET_ATTACHED_IMAGES":
      return { ...state, attachedImages: action.payload };
    case "ADD_ATTACHED_IMAGE":
      return {
        ...state,
        attachedImages: [...state.attachedImages, action.payload],
      };
    case "REMOVE_ATTACHED_IMAGE":
      return {
        ...state,
        attachedImages: state.attachedImages.filter(
          (_, i) => i !== action.payload
        ),
      };
    case "TOGGLE_DROPDOWN":
      return { ...state, showDropdown: !state.showDropdown };
    case "RESET_CONVERSATION":
      return {
        ...state,
        selectedThread: null,
        messages: [],
        isNewConversation: true,
        showDropdown: false,
      };
    default:
      return state;
  }
}

export default function ChatScreen() {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const flatListRef = useRef<FlatList>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const {
    selectedTab,
    showDropdown,
    threads,
    selectedThread,
    isNewConversation,
    loading,
    messages,
    input,
    sending,
    showAttachmentMenu,
    attachedImages,
  } = state;

  // Get params from navigation (e.g., when coming from Scan screen)
  const params = useLocalSearchParams<{ imageUri?: string }>();

  useEffect(() => {
    const uriParam = params?.imageUri;
    if (uriParam && typeof uriParam === "string") {
      // Decode in case the URI is percent-encoded
      const decodedUri = decodeURIComponent(uriParam);

      // Attach the captured image (do NOT auto-send)
      dispatch({ type: "SET_ATTACHED_IMAGES", payload: [{ uri: decodedUri }] });

      // Set up new conversation state if no thread is selected
      if (!selectedThread) {
        dispatch({ type: "SET_IS_NEW_CONVERSATION", payload: true });
      }
    }
  }, [params?.imageUri]);

  useEffect(() => {
    const loadThreads = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const res = await AIService.listThreadsByUser();
        if (res?.data && Array.isArray(res.data)) {
          dispatch({ type: "SET_THREADS", payload: res.data });
        }
      } catch (error) {
        console.error("Failed to load threads:", error);
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    loadThreads();
  }, []);

  // Auto scroll (to bottom, which is offset 0 on inverted list) only if the
  // user is already viewing the latest messages. This prevents the list from
  // hijacking the scroll position while the user is browsing older content.
  useEffect(() => {
    if (isAtBottom && messages.length > 0 && flatListRef.current) {
      // Small delay to ensure the message is rendered before scrolling
      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  }, [messages.length, isAtBottom]);

  // Track whether the user is currently at the bottom (offset 0 in inverted list)
  const handleScroll = (e: any) => {
    const offsetY = e.nativeEvent.contentOffset.y;
    // When inverted, offset 0 means bottom; apply small threshold (<=10)
    setIsAtBottom(offsetY <= 10);
  };

  const formatAPIMessages = async (apiMessages: any[]): Promise<Message[]> => {
    const formatted: Message[] = [];
    for (const msg of apiMessages) {
      let text = "";
      let images: string[] | undefined = undefined;
      if (Array.isArray(msg.content)) {
        const imageIds: string[] = [];
        msg.content.forEach((item: any) => {
          if (item.type === "text") {
            if (typeof item.text === "object") text += item.text.value || "";
            else text += item.text || "";
          } else if (item.type === "image_file" && item.image_file?.file_id) {
            imageIds.push(item.image_file.file_id);
          }
        });

        if (imageIds.length > 0) {
          const urlPromises = imageIds.map((id) =>
            AIService.getFile(id).catch(() => null)
          );
          const urls = (await Promise.all(urlPromises)).filter(
            (u): u is string => !!u
          );
          if (urls.length > 0) images = urls;
        }
      } else if (typeof msg.content === "string") {
        text = msg.content;
      }
      formatted.push({
        id: msg.id || msg._id || Date.now().toString(),
        content: text,
        role: msg.role,
        images,
      });
    }
    return formatted.reverse();
  };

  const fetchMessagesForThread = async (threadId: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const res = await AIService.listMessagesByThread(threadId);
      const data = res?.data?.data || [];
      const formatted = await formatAPIMessages(data);
      dispatch({ type: "SET_MESSAGES", payload: formatted });
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const handleThreadSelect = (thread: Thread) => {
    dispatch({ type: "SET_SELECTED_THREAD", payload: thread });
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: false });
    fetchMessagesForThread(thread._id);
  };

  const createNewThread = async () => {
    // Do NOT call API yet, just reset UI
    dispatch({ type: "SET_SELECTED_THREAD", payload: null });
    dispatch({ type: "SET_MESSAGES", payload: [] });
    dispatch({ type: "SET_IS_NEW_CONVERSATION", payload: true });
    dispatch({ type: "SET_SHOW_DROPDOWN", payload: false });
  };

  const toggleDropdown = () => {
    if (selectedTab === "ai") {
      dispatch({ type: "SET_SHOW_DROPDOWN", payload: !showDropdown });
    }
  };

  const formatMarkdown = (text: string) => {
    let formatted = text.replace(/\\n/g, "\n"); // convert escaped \n
    // Ensure list items preceded by blank line
    formatted = formatted.replace(/([^\n])\n(\s*(?:\d+\.|[-*]))/g, "$1\n\n$2");
    return formatted;
  };

  const handleSend = async () => {
    if (sending || (!input.trim() && attachedImages.length === 0)) return;

    dispatch({ type: "SET_SENDING", payload: true });

    let currentThread = selectedThread;
    if (!currentThread) {
      // actually create thread on server now
      try {
        const res = await AIService.createThread();
        currentThread = {
          _id: res._id,
          name: res.name || "Cuộc trò chuyện mới",
          description: res.description,
          createdAt: res.createdAt || new Date().toISOString(),
        };
        dispatch({
          type: "SET_THREADS",
          payload: [currentThread!, ...threads],
        });
        dispatch({ type: "SET_SELECTED_THREAD", payload: currentThread });
        dispatch({ type: "SET_IS_NEW_CONVERSATION", payload: false });
      } catch (err) {
        console.error("Error creating thread:", err);
        dispatch({ type: "SET_SENDING", payload: false });
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      images: attachedImages.map((i) => i.uri),
    };
    const originalInput = input;
    dispatch({ type: "SET_INPUT", payload: "" });

    const typingMessage: Message = {
      id: "typing-indicator",
      content: "",
      role: "assistant",
      isTyping: true,
    };
    dispatch({
      type: "SET_MESSAGES",
      payload: [typingMessage, userMessage, ...messages],
    });

    try {
      let contentPayload: any[] = [];

      if (originalInput.trim() !== "") {
        contentPayload.push({ type: "text", text: originalInput });
      }

      // Upload images if any
      if (attachedImages.length > 0) {
        const uploadPromises = attachedImages.map(async (img) => {
          try {
            const fileId = await uploadFileFromUri(img.uri);
            return {
              type: "image_file",
              image_file: { file_id: fileId, detail: "auto" },
            };
          } catch (err) {
            console.error("Upload image error", err);
            return null;
          }
        });

        const uploaded = (await Promise.all(uploadPromises)).filter(
          (i) => i !== null
        );
        contentPayload = [...contentPayload, ...uploaded];
      }

      if (contentPayload.length === 0) {
        throw new Error("Empty message");
      }

      const response = await AIService.sendMessage(
        currentThread._id,
        contentPayload
      );

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      let assistantText = "";
      const assistantMsgId = `assistant-${Date.now()}`;

      const updateAssistant = (text: string) => {
        dispatch({
          type: "UPDATE_OR_ADD_ASSISTANT_MESSAGE",
          payload: { id: assistantMsgId, content: formatMarkdown(text) },
        });
      };

      if (response.body && (response.body as any).getReader) {
        const reader = (response.body as any).getReader();
        const decoder = new TextDecoder("utf-8");
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split("\n\n");
          buffer = events.pop() || "";
          for (const event of events) {
            const lines = event.split("\n");
            const dataLines = lines.filter((l) => l.startsWith("data: "));
            const dataStr = dataLines
              .map((l) => l.replace("data: ", "").trim())
              .join("");
            if (!dataStr || dataStr === "[DONE]") continue;
            try {
              const json = JSON.parse(dataStr);
              const delta =
                json?.delta ||
                json?.data?.delta ||
                json?.choices?.[0]?.delta ||
                undefined;
              if (delta.value) {
                const piece: string = delta.value;
                if (!assistantText.endsWith(piece)) {
                  assistantText += piece;
                  updateAssistant(assistantText);
                }
              } else if (Array.isArray(delta.content)) {
                delta.content.forEach((item: any) => {
                  if (item.type === "text" && item.text?.value) {
                    const piece = item.text.value as string;
                    if (!assistantText.endsWith(piece)) {
                      assistantText += piece;
                    }
                  }
                });
                updateAssistant(assistantText);
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
            }
          }
        }
      } else {
        const txt = await response.text();
        const matches = txt.match(/"value":"([^"]+)"/g) || [];
        matches.forEach((m) => {
          const val = m.replace(/"value":"|"/g, "");
          assistantText += val;
        });
        updateAssistant(assistantText);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch({
        type: "REMOVE_MESSAGE",
        payload: "typing-indicator",
      });
    } finally {
      dispatch({ type: "SET_SENDING", payload: false });
      dispatch({ type: "SET_ATTACHED_IMAGES", payload: [] });
    }
  };

  const handleAttachmentSelect = async (type: "image" | "voice") => {
    if (type === "image") {
      try {
        // Ask for permission
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Permission to access media library is required!");
          return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.8,
        });

        if (!result.canceled) {
          const selected = result.assets.map((a) => ({ uri: a.uri }));
          dispatch({
            type: "SET_ATTACHED_IMAGES",
            payload: [...attachedImages, ...selected],
          });
        }
      } catch (error) {
        console.error("Image picker error:", error);
      }
    } else if (type === "voice") {
      // TODO: implement voice message
    }
  };

  const renderMessage = ({ item: msg }: { item: Message }) => {
    if (msg.isTyping) {
      return <TypingIndicator />;
    }
    return msg.role === "user" ? (
      <UserMessage text={msg.content} images={msg.images} />
    ) : (
      <AssistantMessage text={msg.content} images={msg.images} />
    );
  };

  const uploadFileFromUri = async (uri: string): Promise<string> => {
    try {
      const formData = new FormData();
      const fileName = uri.split("/").pop() || `image_${Date.now()}.jpg`;
      formData.append("file", {
        uri,
        name: fileName,
        type: "image/jpeg",
      } as any);
      formData.append("purpose", "vision");

      const response = await AIService.uploadFile(formData as any);
      if (!response.id) {
        throw new Error("Upload file failed");
      }
      return response.id;
    } catch (error) {
      console.error("Error upload file:", error);
      throw error;
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        accessible={false}
        style={{ flex: 1 }}
      >
        <SafeAreaView className="flex-1 bg-white">
          <View className="flex-row relative">
            <View className="flex-row bg-[#02AAEB] pt-1 w-full h-12">
              <Pressable
                className={`flex-1 flex-row items-center justify-center h-full py-2 ${
                  selectedTab === "ai"
                    ? "bg-white rounded-t-xl "
                    : "bg-[#02AAEB]"
                } `}
                style={{ zIndex: selectedTab === "ai" ? 2 : 1 }}
                onPress={() =>
                  dispatch({ type: "SET_SELECTED_TAB", payload: "ai" })
                }
              >
                <Text
                  className={`text-base font-semibold max-w-[150px] ${
                    selectedTab === "ai" ? "text-[#02AAEB]" : "text-white"
                  }`}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedThread?.name ||
                    (isNewConversation ? "Cuộc trò chuyện mới" : "BroGlow AI")}
                </Text>
                {selectedTab === "ai" && (
                  <Pressable onPress={toggleDropdown}>
                    <Feather
                      name={showDropdown ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#02AAEB"
                      style={{ marginLeft: 4 }}
                    />
                  </Pressable>
                )}
              </Pressable>
              <Pressable
                className={`flex-1 items-center justify-center h-full py-2 ${
                  selectedTab === "expert"
                    ? "bg-white rounded-t-xl"
                    : "bg-[#02AAEB]"
                } flex-row`}
                style={{ zIndex: selectedTab === "expert" ? 2 : 1 }}
                onPress={() =>
                  dispatch({ type: "SET_SELECTED_TAB", payload: "expert" })
                }
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

            {showDropdown && selectedTab === "ai" && (
              <View className="absolute top-12 left-2 w-64 bg-white shadow-lg rounded-b-xl border-t border-gray-200 z-10">
                <ScrollView className="max-h-64">
                  <Pressable
                    className="flex-row items-center px-4 py-3 border-b border-gray-100"
                    onPress={createNewThread}
                  >
                    <Feather name="plus" size={16} color="#02AAEB" />
                    <Text className="ml-3 text-base font-medium text-[#02AAEB]">
                      Tạo cuộc trò chuyện mới
                    </Text>
                  </Pressable>

                  {loading && (
                    <View className="flex-row items-center justify-center py-4">
                      <ActivityIndicator size="small" color="#02AAEB" />
                      <Text className="ml-2 text-gray-500">Đang tải...</Text>
                    </View>
                  )}

                  {threads.map((thread) => (
                    <Pressable
                      key={thread._id}
                      className={`px-4 py-3 border-b border-gray-100 ${
                        selectedThread?._id === thread._id ? "bg-blue-50" : ""
                      }`}
                      onPress={() => handleThreadSelect(thread)}
                    >
                      <Text
                        className="text-base font-medium text-gray-800"
                        numberOfLines={1}
                      >
                        {thread.name ||
                          `Cuộc trò chuyện ${new Date(
                            thread.createdAt
                          ).toLocaleDateString()}`}
                      </Text>
                      {thread.description && (
                        <Text
                          className="text-sm text-gray-500 mt-1"
                          numberOfLines={2}
                        >
                          {thread.description}
                        </Text>
                      )}
                      <Text className="text-xs text-gray-400 mt-1">
                        {new Date(thread.createdAt).toLocaleString()}
                      </Text>
                    </Pressable>
                  ))}

                  {!loading && threads.length === 0 && (
                    <View className="px-4 py-6 items-center">
                      <Text className="text-gray-500 text-center">
                        Chưa có cuộc trò chuyện nào
                      </Text>
                      <Text className="text-gray-400 text-sm text-center mt-1">
                        Tạo cuộc trò chuyện mới để bắt đầu
                      </Text>
                    </View>
                  )}
                </ScrollView>
              </View>
            )}
          </View>

          {selectedTab === "ai" && selectedThread ? (
            <FlatList
              data={messages}
              keyExtractor={(msg, idx) => msg.id || idx.toString()}
              renderItem={renderMessage}
              style={{ flex: 1 }}
              contentContainerStyle={{
                padding: 16,
                flexGrow: messages.length === 0 ? 1 : 0,
              }}
              keyboardShouldPersistTaps="handled"
              scrollEventThrottle={16}
              inverted
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={false}
              maintainVisibleContentPosition={{
                minIndexForVisible: 0,
                autoscrollToTopThreshold: 10,
              }}
              onScroll={handleScroll}
            />
          ) : (
            <View className="flex-1 items-center justify-center">
              <Image
                source={require("../../../assets/images/logo-text.png")}
                className="h-36"
                resizeMode="contain"
              />
            </View>
          )}

          {/* Footer */}
          {attachedImages.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                maxHeight: 80,
                paddingVertical: 6,
                paddingHorizontal: 8,
                backgroundColor: "#ffffff",
              }}
            >
              {attachedImages.map((img, idx) => (
                <View key={idx} style={{ marginRight: 8 }}>
                  <Image
                    source={{ uri: img.uri }}
                    style={{ width: 60, height: 60, borderRadius: 8 }}
                  />
                  <Pressable
                    onPress={() =>
                      dispatch({ type: "REMOVE_ATTACHED_IMAGE", payload: idx })
                    }
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      backgroundColor: "#FF4D4F",
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        fontWeight: "bold",
                      }}
                    >
                      ×
                    </Text>
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Chat input row */}
          <View className="flex-row items-center px-2 bg-white pb-2">
            <Pressable
              className="p-2"
              onPress={() =>
                dispatch({ type: "SET_SHOW_ATTACHMENT_MENU", payload: true })
              }
            >
              <Feather name="plus" size={24} color="#02AAEB" />
            </Pressable>
            <View className="flex-1 mx-2 rounded-full bg-[#F5F5F5] flex-row items-center px-4">
              <TextInput
                className="flex-1 py-2 text-base"
                placeholder="Gửi tin nhắn..."
                placeholderTextColor="#B0B0B0"
                value={input}
                onChangeText={(text) =>
                  dispatch({ type: "SET_INPUT", payload: text })
                }
                editable={!sending}
              />
            </View>
            <Pressable
              className="p-2"
              onPress={handleSend}
              disabled={sending || !input.trim()}
            >
              {sending ? (
                <ActivityIndicator size={20} color="#02AAEB" />
              ) : (
                <Feather name="send" size={24} color="#02AAEB" />
              )}
            </Pressable>

            <AttachmentMenu
              visible={showAttachmentMenu}
              onClose={() =>
                dispatch({ type: "SET_SHOW_ATTACHMENT_MENU", payload: false })
              }
              onSelect={handleAttachmentSelect}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
