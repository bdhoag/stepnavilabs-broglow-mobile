import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface Props {
  text: string;
  images?: string[];
}

const UserMessage: React.FC<Props> = ({ text, images }) => {
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

export default UserMessage;

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
    backgroundColor: "#E5E7EB",
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
});
