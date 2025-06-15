import { AIService } from "@/src/services/AI.service";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

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

const UserMessage = ({ text, images }: { text: string; images?: string[] }) => {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.senderText}>Bạn</Text>
      {text.length > 0 && (
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{text}</Text>
        </View>
      )}
      {images && images.length > 0 && (
        <View style={[styles.imageGrid, { marginTop: 8 }]}>
          {images.map((url, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image
                source={{ uri: url }}
                style={styles.image}
                resizeMode="cover"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const AssistantMessage = ({
  text,
  images,
}: {
  text: string;
  images?: string[];
}) => {
  return (
    <View style={styles.assistantContainer}>
      <View style={styles.assistantBubble}>
        <Markdown style={markdownStyles}>{text}</Markdown>
        {images && images.length > 0 && (
          <View style={styles.imageGrid}>
            {images.map((url, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image
                  source={{ uri: url }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const TypingIndicator = () => {
  const [dot1] = useState(new Animated.Value(0));
  const [dot2] = useState(new Animated.Value(0));
  const [dot3] = useState(new Animated.Value(0));

  useEffect(() => {
    const animate = (value: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 500,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.typingHeader}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/images/icon.png")}
            style={styles.logoIcon}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.aiText}>BroGlow AI</Text>
      </View>
      <View style={styles.typingBubble}>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, { opacity: dot1 }]} />
          <Animated.View style={[styles.dot, { opacity: dot2 }]} />
          <Animated.View style={[styles.dot, { opacity: dot3 }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    marginBottom: 24,
    alignItems: "flex-end",
  },
  senderText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  messageBubble: {
    backgroundColor: "#E5E7EB", // bg-orange-light
    padding: 12,
    borderRadius: 16,
    borderTopRightRadius: 16,
    maxWidth: "90%",
  },
  messageText: {
    fontSize: 14,
    color: "#000000",
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
    width: "auto",
  },
  imageContainer: {
    width: 80,
    height: 80,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  assistantContainer: {
    marginBottom: 24,
    width: "100%",
  },
  assistantBubble: {
    padding: 16,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  attachmentMenu: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  attachmentOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  attachmentText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#374151",
  },
  typingContainer: {
    marginBottom: 24,
  },
  typingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoContainer: {
    width: 24,
    height: 24,
    padding: 6,
    borderRadius: 12,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  logoIcon: {
    width: "100%",
    height: "100%",
  },
  aiText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  typingBubble: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignSelf: "flex-start",
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#374151",
    marginHorizontal: 2,
  },
});

type MarkdownStyle = {
  [key: string]: TextStyle | ViewStyle;
};

const markdownStyles: MarkdownStyle = {
  body: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
  },
  paragraph: {
    marginVertical: 8,
  },
  link: {
    color: "#02AAEB",
  },
  code_inline: {
    backgroundColor: "#F3F4F6",
    padding: 4,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  code_block: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 8,
    fontFamily: "monospace",
    marginVertical: 8,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  bullet_list_icon: {
    marginRight: 8,
  },
  ordered_list_icon: {
    marginRight: 8,
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700",
    marginVertical: 12,
    color: "#111827",
  },
  heading2: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10,
    color: "#111827",
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
    color: "#111827",
  },
  strong: {
    fontWeight: "700",
  },
  em: {
    fontStyle: "italic",
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 16,
    marginVertical: 8,
    fontStyle: "italic",
  },
};

const AttachmentMenu = ({
  visible,
  onClose,
  onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: "image" | "voice") => void;
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.attachmentMenu}>
          <Pressable
            style={styles.attachmentOption}
            onPress={() => {
              onSelect("image");
              onClose();
            }}
          >
            <MaterialIcons name="image" size={24} color="#374151" />
            <Text style={styles.attachmentText}>Chọn hình ảnh</Text>
          </Pressable>
          <Pressable
            style={styles.attachmentOption}
            onPress={() => {
              onSelect("voice");
              onClose();
            }}
          >
            <MaterialIcons name="mic" size={24} color="#374151" />
            <Text style={styles.attachmentText}>Tin nhắn thoại</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default function ChatScreen() {
  const [selectedTab, setSelectedTab] = useState<"ai" | "expert">("ai");
  const [showDropdown, setShowDropdown] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [isNewConversation, setIsNewConversation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachedImages, setAttachedImages] = useState<{ uri: string }[]>([]);

  // Get params from navigation (e.g., when coming from Scan screen)
  const params = useLocalSearchParams<{ imageUri?: string }>();

  useEffect(() => {
    const uriParam = params?.imageUri;
    if (uriParam && typeof uriParam === "string") {
      // If an image URI is provided via navigation, attach it and send immediately
      setAttachedImages([{ uri: uriParam }]);

      // Delay send to ensure state is updated
      setTimeout(() => {
        handleSend();
      }, 0);
    }
  }, [params?.imageUri]);

  useEffect(() => {
    const loadThreads = async () => {
      setLoading(true);
      try {
        const res = await AIService.listThreadsByUser();
        if (res?.data && Array.isArray(res.data)) {
          setThreads(res.data);
        }
      } catch (error) {
        console.error("Failed to load threads:", error);
      } finally {
        setLoading(false);
      }
    };
    loadThreads();
  }, []);

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
    setLoading(true);
    try {
      const res = await AIService.listMessagesByThread(threadId);
      const data = res?.data?.data || [];
      const formatted = await formatAPIMessages(data);
      setMessages(formatted);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleThreadSelect = (thread: Thread) => {
    setSelectedThread(thread);
    setShowDropdown(false);
    fetchMessagesForThread(thread._id);
  };

  const createNewThread = async () => {
    // Do NOT call API yet, just reset UI
    setSelectedThread(null);
    setMessages([]);
    setIsNewConversation(true);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    if (selectedTab === "ai") {
      setShowDropdown(!showDropdown);
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

    setSending(true);

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
        setThreads((prev) => [currentThread!, ...prev]);
        setSelectedThread(currentThread);
        setIsNewConversation(false);
      } catch (err) {
        console.error("Error creating thread:", err);
        setSending(false);
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
    setInput("");

    const typingMessage: Message = {
      id: "typing-indicator",
      content: "",
      role: "assistant",
      isTyping: true,
    };
    setMessages((prev) => [typingMessage, userMessage, ...prev]);

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
        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== "typing-indicator");
          const exists = filtered.find((m) => m.id === assistantMsgId);
          if (exists) {
            return filtered.map((m) =>
              m.id === assistantMsgId
                ? { ...m, content: formatMarkdown(text) }
                : m
            );
          } else {
            const newMsg: Message = {
              id: assistantMsgId,
              content: formatMarkdown(text),
              role: "assistant",
            };
            return [newMsg, ...filtered];
          }
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
            } catch (e) {}
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
      setMessages((prev) => prev.filter((m) => m.id !== "typing-indicator"));
    } finally {
      setSending(false);
      setAttachedImages([]);
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
          setAttachedImages((prev) => [...prev, ...selected]);
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
                onPress={() => setSelectedTab("ai")}
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
                onPress={() => setSelectedTab("expert")}
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
            <View className="flex-1">
              <FlatList
                data={messages}
                keyExtractor={(msg, idx) => msg.id || idx.toString()}
                renderItem={renderMessage}
                contentContainerStyle={{
                  padding: 16,
                  flexGrow: 1,
                  justifyContent: "flex-end",
                }}
                inverted
              />
            </View>
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
                      setAttachedImages((prev) =>
                        prev.filter((_, i) => i !== idx)
                      )
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
              onPress={() => setShowAttachmentMenu(true)}
            >
              <Feather name="plus" size={24} color="#02AAEB" />
            </Pressable>
            <View className="flex-1 mx-2 rounded-full bg-[#F5F5F5] flex-row items-center px-4">
              <TextInput
                className="flex-1 py-2 text-base"
                placeholder="Gửi tin nhắn..."
                placeholderTextColor="#B0B0B0"
                value={input}
                onChangeText={setInput}
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
              onClose={() => setShowAttachmentMenu(false)}
              onSelect={handleAttachmentSelect}
            />
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
