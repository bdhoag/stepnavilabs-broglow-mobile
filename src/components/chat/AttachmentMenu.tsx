import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: "image" | "voice") => void;
}

const AttachmentMenu: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
          <Pressable
            style={styles.option}
            onPress={() => {
              onSelect("image");
              onClose();
            }}
          >
            <MaterialIcons name="image" size={24} color="#374151" />
            <Text style={styles.optionText}>Chọn hình ảnh</Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => {
              onSelect("voice");
              onClose();
            }}
          >
            <MaterialIcons name="mic" size={24} color="#374151" />
            <Text style={styles.optionText}>Tin nhắn thoại</Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

export default AttachmentMenu;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  menu: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  optionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#374151",
  },
});
