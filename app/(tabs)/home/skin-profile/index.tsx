import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface QuizQuestion {
  id: number;
  question: string;
  options: { id: string; text: string }[];
  multiSelect: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Loại da của bạn là gì?",
    options: [
      { id: "oily", text: "Da dầu" },
      { id: "dry", text: "Da khô" },
      { id: "sensitive", text: "Da nhạy cảm" },
    ],
    multiSelect: false,
  },
  {
    id: 2,
    question: "Bạn có gặp vấn đề nào sau đây không?",
    options: [
      {
        id: "irritation",
        text: "Da dễ kích ứng (đỏ, ngứa, rát, châm chích khi dùng mỹ phẩm mới)",
      },
      {
        id: "acne",
        text: "Da dễ nổi mụn khi ăn đồ cay nóng, sữa, hoặc căng thẳng",
      },
      { id: "flaking", text: "Da bị bong tróc hoặc căng khô vào mùa lạnh" },
      {
        id: "oily_tzone",
        text: "Da tiết nhiều dầu vào giữa ngày, đặc biệt ở vùng chữ T",
      },
      { id: "aging", text: "Da xuất hiện nếp nhăn hoặc chảy xệ sớm" },
    ],
    multiSelect: true,
  },
  {
    id: 3,
    question: "Bạn có bị dị ứng với thành phần mỹ phẩm nào không?",
    options: [
      { id: "alcohol", text: "Cồn (Alcohol)" },
      { id: "fragrance", text: "Hương liệu (Fragrance, Parfum)" },
      { id: "sulfate", text: "Sulfate (SLS, SLES)" },
      { id: "silicone", text: "Silicone" },
      { id: "none", text: "Không dị ứng hoặc không chắc chắn" },
    ],
    multiSelect: true,
  },
  {
    id: 4,
    question: "Bạn có đang sử dụng các sản phẩm nào sau đây không?",
    options: [
      { id: "cleanser", text: "Sữa rửa mặt" },
      { id: "toner", text: "Toner/Nước cân bằng" },
      {
        id: "serum",
        text: "Serum đặc trị (Vitamin C, Retinol, Niacinamide, v.v.)",
      },
      { id: "moisturizer", text: "Kem dưỡng ẩm" },
      { id: "sunscreen", text: "Kem chống nắng" },
      { id: "none", text: "Không dùng gì cả" },
    ],
    multiSelect: true,
  },
  {
    id: 5,
    question: "Bạn có thói quen nào có thể ảnh hưởng đến làn da không?",
    options: [
      { id: "smoking", text: "Hút thuốc lá" },
      { id: "alcohol", text: "Uống rượu bia thường xuyên" },
      {
        id: "sleep",
        text: "Ngủ không đủ giấc (<6 tiếng/ngày)",
      },
      { id: "hot_food", text: "Ăn nhiều đồ chiên rán, cay nóng" },
      { id: "water", text: "Không uống đủ nước" },
    ],
    multiSelect: true,
  },
  {
    id: 6,
    question: "Bạn có đang gặp tình trạng da nào sau đây không?",
    options: [
      { id: "dark_spots", text: "Da có nhiều vết thâm do mụn cũ" },
      { id: "brown_spots", text: "Da xuất hiện đốm nâu/tàn nhang" },
      {
        id: "large_pores",
        text: "Lỗ chân lông to",
      },
      { id: "no_problem", text: "Không có vấn đề gì đặc biệt" },
    ],
    multiSelect: true,
  },
];

const QuizScreen = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const question = quizQuestions[current];
  const router = useRouter();

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => {
      const prevSelected = prev[question.id] || [];
      let updated;
      if (question.multiSelect) {
        updated = prevSelected.includes(optionId)
          ? prevSelected.filter((id) => id !== optionId)
          : [...prevSelected, optionId];
      } else {
        updated = [optionId];
      }
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

  const selectedOptions = answers[question.id] || [];

  return (
    <SafeAreaView className="flex-1 items-center px-4 pb-5">
      <View className="w-full h-2 bg-white rounded mb-6">
        <View
          className="h-2 bg-[#82E9C5] rounded"
          style={{
            width: `${(current / quizQuestions.length) * 100}%`,
          }}
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
          disabled={selectedOptions.length === 0}
          className={`flex-1 p-3 bg-[#1584F2] rounded-xl mx-2 items-center ${
            selectedOptions.length === 0 ? "opacity-50" : ""
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
