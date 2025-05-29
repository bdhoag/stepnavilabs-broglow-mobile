import { useRouter } from "expo-router";
import React, { useState } from "react";
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

const QuizScreen = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const question = quizQuestions[current];
  const router = useRouter();

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => {
      let updated = [optionId];
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

  return (
    <SafeAreaView className="flex-1 items-center px-4 pb-5">
      <View className="w-full h-2 bg-white rounded mb-6">
        <View
          className="h-2 bg-[#82E9C5] rounded"
          style={{ width: `${(current / quizQuestions.length) * 100}%` }}
        />
      </View>
      <Text className="text-2xl font-bold text-[#02AAEB] mb-6 text-center">
        {question.question}
      </Text>
      <FlatList
        data={question.options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const selected = (answers[question.id] || []).includes(item.id);
          return (
            <TouchableOpacity
              className={`p-4 rounded-2xl border-2 mb-4 items-center ${
                selected
                  ? "bg-[#02AAEB] border-[#02AAEB]"
                  : "bg-white border-[#02AAEB]"
              }`}
              onPress={() => handleSelect(item.id)}
              activeOpacity={0.8}
            >
              <Text
                className={`text-lg font-semibold ${
                  selected ? "text-white" : "text-[#02AAEB]"
                }`}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          );
        }}
        style={{ width: "100%" }}
      />
      <View className="flex-row justify-between w-full mt-6">
        <TouchableOpacity
          onPress={handlePrev}
          disabled={current === 0}
          className={`flex-1 p-3 bg-[#1584F2] rounded-xl mx-2 items-center ${
            current === 0 ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white font-bold text-base">Quay lại</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={(answers[question.id] || []).length === 0}
          className={`flex-1 p-3 bg-[#1584F2] rounded-xl mx-2 items-center ${
            (answers[question.id] || []).length === 0 ? "opacity-50" : ""
          }`}
        >
          <Text className="text-white font-bold text-base">
            {current === quizQuestions.length - 1 ? "Hoàn thành" : "Tiếp tục"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default QuizScreen;
