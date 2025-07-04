import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const quizQuestions = [
  {
    id: 1,
    question: "Chu trình skincare mong muốn của bạn gồm bao nhiêu bước?",
    options: [
      { id: "3", text: "3" },
      { id: "4", text: "4" },
      { id: "5", text: "5" },
      { id: "6", text: "6" },
    ],
    multiSelect: false,
  },
  {
    id: 2,
    question: "Chi phí bạn dùng cho chu trình này là bao nhiêu?",
    options: [
      { id: "lt1m", text: "< 1.000.000" },
      { id: "1m-2m", text: "1.000.000 - 2.000.000" },
      { id: "gt2m", text: "> 2.000.000" },
    ],
    multiSelect: false,
  },
];

const QuizRoutineScreen = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const question = quizQuestions[current];
  const router = useRouter();
  const navigation = useNavigation();

  // Ẩn tab bar khi vào màn hình này
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({ tabBarStyle: { display: "none" } });
      }
      return () => {
        if (parent) {
          parent.setOptions({ tabBarStyle: { display: "flex" } });
        }
      };
    }, [navigation])
  );

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => {
      const updated = [optionId]; // chỉ chọn 1 đáp án
      return { ...prev, [question.id]: updated };
    });
  };

  const handleNext = () => {
    if (current < quizQuestions.length - 1) setCurrent(current + 1);
    else router.replace("/(tabs)/chat");
  };

  const handlePrev = () => {
    if (current > 0) setCurrent(current - 1);
  };

  const handleBack = () => {
    router.back();
  };

  const selectedOptions = answers[question.id] || [];

  return (
    <SafeAreaView className="flex-1 px-4 pt-4 bg-white">
      {/* Header */}
      <View className="flex-row items-center w-full my-4">
        <TouchableOpacity onPress={handleBack} className="mr-2">
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-gray-900">
          Gợi ý chu trình chăm sóc da
        </Text>
      </View>
      {/* Progress Bar */}
      <View className="flex-row justify-between w-full mt-5 mb-3 px-7">
        {quizQuestions.map((_, index) => (
          <View
            key={index}
            className="flex-1 h-2 mx-0.5 rounded-full"
            style={{
              backgroundColor: index <= current ? "#4A90E2" : "#E5E7EB",
            }}
          />
        ))}
      </View>
      {/* Subtitle */}
      <View className="items-center w-full my-4">
        <Text className="text-sm text-gray-500">
          Hãy trả lời những câu hỏi sau
        </Text>
      </View>
      {/* Question */}
      <Text className="px-5 my-6 text-xl font-bold text-center text-black">
        {question.question}
      </Text>
      {/* Options List */}
      <FlatList
        data={question.options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = selectedOptions.includes(item.id);
          const content = (
            <Text
              className={`text-lg font-semibold ${
                selected ? "text-white" : "text-gray-800"
              }`}
            >
              {item.text}
            </Text>
          );

          return (
            <View className="px-7">
              <TouchableOpacity
                onPress={() => handleSelect(item.id)}
                activeOpacity={0.8}
              >
                {selected ? (
                  <LinearGradient
                    colors={["#3eaef4", "#1e90ff"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="items-start p-3 mb-4 rounded-3xl"
                    style={{ borderRadius: 15 }}
                  >
                    <Text style={{marginLeft: 6}}>{content}</Text>
                  </LinearGradient>
                ) : (
                  <View
                    className="p-3 mb-4 items-start bg-white border-2 border-[#E5E7EB]"
                    style={{ borderRadius: 15 }}
                  >
                    <Text style={{marginLeft: 6}}>{content}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        style={{ width: "100%" }}
      />

      {/* Navigation Buttons */}
      <View className="flex-row justify-between w-full px-7 bottom-4">
        <TouchableOpacity
          onPress={handlePrev}
          disabled={current === 0}
          className={`px-5 py-3 rounded-full border ${
            current === 0
              ? "opacity-40 border-blue-100 bg-blue-100"
              : "border-blue-100 bg-blue-100"
          }`}
        >
          <Text className="text-lg font-medium text-blue-500">Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={selectedOptions.length === 0}
          className={`px-6 py-3 rounded-full ${
            selectedOptions.length === 0 ? "bg-gray-300" : "bg-[#1e90ff]"
          }`}
        >
          <Text className="text-lg font-medium text-white">
            {current === quizQuestions.length - 1 ? "Hoàn thành" : "Tiếp tục"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QuizRoutineScreen;
