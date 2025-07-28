import React from "react";
import { Image, StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";

interface Props {
  text: string;
  images?: string[];
}

const AssistantMessage: React.FC<Props> = ({ text, images }) => {
  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
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

export default AssistantMessage;

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    width: "100%",
  },
  bubble: {
    padding: 16,
    width: "80%",
    backgroundColor: "#F3F4F6",
    borderTopEndRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomStartRadius: 10
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

const markdownStyles = {
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
} as const;
