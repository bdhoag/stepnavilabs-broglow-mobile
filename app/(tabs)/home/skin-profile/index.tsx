import AuthGuard from "@/src/components/auth-guard";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import
{
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get( "window" );

export interface QuizQuestion
{
  id: number;
  question: string;
  subtitle?: string;
  options: { id: string; text: string }[];
  multiSelect: boolean;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Loại da của bạn là gì?",
    subtitle: "Hãy trả lời những câu hỏi sau",
    options: [
      { id: "oily", text: "Da dầu" },
      { id: "dry", text: "Da khô" },
      { id: "combination", text: "Da hỗn hợp" },
      { id: "sensitive", text: "Da nhạy cảm" },
    ],
    multiSelect: false,
  },
  {
    id: 2,
    question: "Bạn có gặp vấn đề nào sau đây không?",
    subtitle: "Có thể chọn nhiều đáp án",
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
    subtitle: "Có thể chọn nhiều đáp án",
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
    subtitle: "Có thể chọn nhiều đáp án",
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
    subtitle: "Có thể chọn nhiều đáp án",
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
    subtitle: "Có thể chọn nhiều đáp án",
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

const QuizScreen = () =>
{
  const [ current, setCurrent ] = useState( 0 );
  const [ answers, setAnswers ] = useState<{ [ key: number ]: string[] }>( {} );
  const [ showSuccessModal, setShowSuccessModal ] = useState( false );
  const question = quizQuestions[ current ];
  const router = useRouter();
  const [ skipped, setSkipped ] = useState<Set<number>>( new Set() );
  const [ skippedQuestions, setSkippedQuestions ] = useState<number[]>( [] );
  const navigation = useNavigation();

  // Hide tab bar when this screen is focused
  useFocusEffect(
    React.useCallback( () =>
    {
      // Hide tab bar
      const parent = navigation.getParent();
      if ( parent )
      {
        parent.setOptions( {
          tabBarStyle: { display: "none" },
        } );
      }

      return () =>
      {
        // Show tab bar again when leaving this screen
        if ( parent )
        {
          parent.setOptions( {
            tabBarStyle: { display: "flex" },
          } );
        }
      };
    }, [ navigation ] )
  );

  const handleSelect = ( optionId: string ) =>
  {
    setAnswers( ( prev ) =>
    {
      const prevSelected = prev[ question.id ] || [];
      let updated;
      if ( question.multiSelect )
      {
        updated = prevSelected.includes( optionId )
          ? prevSelected.filter( ( id ) => id !== optionId )
          : [ ...prevSelected, optionId ];
      } else
      {
        updated = [ optionId ];
      }
      return { ...prev, [ question.id ]: updated };
    } );
  };

  const handleNext = () =>
  {
    if ( current < quizQuestions.length - 1 )
    {
      setCurrent( current + 1 );
    } else
    {
      // Show success modal when completing the quiz
      setShowSuccessModal( true );
    }
  };

  const handlePrev = () =>
  {
    if ( current > 0 ) setCurrent( current - 1 );
  };

  const handleBack = () =>
  {
    router.back();
  };

  const handleModalOK = () =>
  {
    setShowSuccessModal( false );
    router.replace( "/(tabs)/home" );
  };

  const selectedOptions = answers[ question.id ] || [];

  const ProgressBar = () =>
  {
    return (
      <View className="flex-row items-center justify-center px-4 mb-8">
        { quizQuestions.map( ( _, index ) => (
          <React.Fragment key={ index }>
            <View
              className={ `h-1 flex-1 rounded-full ${ index < current && !skipped.has( quizQuestions[ index ].id )
                ? "bg-[#4A90E2]"
                : "bg-gray-200"
                }` }
            />
            { index < quizQuestions.length - 1 && <View className="w-2" /> }
          </React.Fragment>
        ) ) }
      </View>
    );
  };

  const OptionItem = ( { item }: { item: { id: string; text: string } } ) =>
  {
    const isSelected = selectedOptions.includes( item.id );

    const content = (
      <View
        className={ `flex-row items-center justify-between py-3 px-4 rounded-2xl ${ isSelected ? "" : "bg-white border border-gray-200"
          }` }
      >
        <Text
          className={ `flex-1 text-base leading-5 ${ isSelected ? "text-white" : "text-gray-800"
            }` }
        >
          { item.text }
        </Text>
        { isSelected && (
          <View className="ml-3">
            <Ionicons name="checkmark" size={ 20 } color="#fff" />
          </View>
        ) }
      </View>
    );

    return (
      <TouchableOpacity
        className="self-center w-11/12 mb-3 overflow-hidden rounded-2xl"
        onPress={ () => handleSelect( item.id ) }
        activeOpacity={ 0.7 }
      >
        { isSelected ? (
          <LinearGradient
            colors={ [ "#3eaef4", "#1e90ff" ] }
            start={ { x: 0, y: 0 } }
            end={ { x: 1, y: 1 } }
            style={ { borderRadius: 16 } }
          >
            { content }
          </LinearGradient>
        ) : (
          content
        ) }
      </TouchableOpacity>
    );
  };

  const handleSkip = () =>
  {
    setSkipped( ( prev ) => new Set( prev ).add( question.id ) );
    handleNext();
  };

  const SuccessModal = () => (
    <Modal
      visible={ showSuccessModal }
      transparent={ true }
      animationType="fade"
      onRequestClose={ () => { } }
    >
      <View
        style={ {
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        } }
      >
        <View
          style={ {
            backgroundColor: "white",
            borderRadius: 50,
            paddingHorizontal: 32,
            paddingTop: 32,
            paddingBottom: 16,
            width: width * 0.8,
            minHeight: 300,
            alignItems: "center",
            justifyContent: "space-between",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          } }
        >
          {/* Decorative dots */ }
          <View style={ { position: "absolute", top: 40, left: 80 } }>
            <View
              style={ {
                width: 20,
                height: 20,
                borderRadius: 20,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>
          <View style={ { position: "absolute", top: 30, right: 80 } }>
            <View
              style={ {
                width: 10,
                height: 10,
                borderRadius: 10,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>
          <View style={ { position: "absolute", top: 20, left: 150 } }>
            <View
              style={ {
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>
          <View style={ { position: "absolute", top: 90, right: 100 } }>
            <View
              style={ {
                width: 7,
                height: 7,
                borderRadius: 3,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>
          <View style={ { position: "absolute", bottom: 80, left: 60 } }>
            <View
              style={ {
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>
          <View style={ { position: "absolute", bottom: 130, right: 50 } }>
            <View
              style={ {
                width: 7,
                height: 7,
                borderRadius: 3.5,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>
          <View style={ { position: "absolute", bottom: 150, left: 120 } }>
            <View
              style={ {
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>
          <View style={ { position: "absolute", top: 150, right: 140 } }>
            <View
              style={ {
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: "#4A90E2",
              } }
            />
          </View>

          {/* Checkmark Circle */ }
          <View
            style={ {
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#4A90E2",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 40,
              marginTop: 20,
            } }
          >
            <View
              style={ {
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
              } }
            >
              <Ionicons name="checkmark" size={ 30 } color="#4A90E2" />
            </View>
          </View>

          {/* Text */ }
          <Text
            style={ {
              fontSize: 18,
              fontWeight: "bold",
              color: "#4A90E2",
              textAlign: "center",
              marginBottom: 6,
            } }
          >
            Hoàn Thành
          </Text>

          <Text
            style={ {
              fontSize: 12,
              color: "#666",
              textAlign: "center",
              marginBottom: 7,
            } }
          >
            Bạn đã xác định hồ sơ da thành công
          </Text>

          {/* OK Button */ }
          <TouchableOpacity
            onPress={ handleModalOK }
            style={ {
              backgroundColor: "#4A90E2",
              paddingHorizontal: 48,
              paddingVertical: 14,
              borderRadius: 24,
              width: "100%",
              marginTop: 24,
            } }
          >
            <Text
              style={ {
                color: "white",
                fontSize: 16,
                fontWeight: "600",
                textAlign: "center",
              } }
            >
              OK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <AuthGuard>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        {/* Header */ }
        <View className="flex-row items-center px-4 pt-5">
          <TouchableOpacity onPress={ handleBack } className="pl-3 mr-3">
            <Ionicons name="arrow-back" size={ 20 } color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Xác định hồ sơ da
          </Text>
        </View>

        <View className="flex-1 px-4 pt-6">
          {/* Progress Bar */ }
          <ProgressBar />

          {/* Question */ }
          <View className="mb-6">
            <Text className="px-3 mb-2 text-xl font-bold text-center text-gray-900">
              { question.question }
            </Text>
            { question.subtitle && (
              <Text className="text-xs italic text-center text-gray-500">
                { question.subtitle }
              </Text>
            ) }
          </View>

          {/* Options */ }
          <FlatList
            data={ question.options }
            keyExtractor={ ( item ) => item.id }
            renderItem={ ( { item } ) => <OptionItem item={ item } /> }
            showsVerticalScrollIndicator={ false }
            contentContainerStyle={ { flexGrow: 1 } }
          />

          {/* Navigation Buttons */ }
          <View className="flex-row items-center self-center justify-between w-11/12 py-4 bg-gray-50">
            {/* Nút Câu trước */ }
            <TouchableOpacity
              onPress={ handlePrev }
              disabled={ current === 0 }
              className={ `px-5 py-3 rounded-full border ${ current === 0
                ? "opacity-40 border-blue-100 bg-blue-100"
                : "border-blue-100 bg-blue-100"
                }` }
            >
              <Text className="font-medium text-blue-500">Câu trước</Text>
            </TouchableOpacity>

            {/* Cụm Tiếp tục + Bỏ qua */ }
            <View className="flex-row items-center gap-3">
              {/* Nút Bỏ qua dạng link */ }
              <TouchableOpacity onPress={ handleSkip }>
                <Text className="mb-1 text-sm text-blue-500 underline">
                  Bỏ qua
                </Text>
              </TouchableOpacity>

              {/* Nút Tiếp tục */ }
              <TouchableOpacity
                onPress={ handleNext }
                disabled={ selectedOptions.length === 0 }
                className={ `px-6 py-3 rounded-full ${ selectedOptions.length === 0 ? "bg-gray-300" : "bg-[#1e90ff]"
                  }` }
              >
                <Text className="font-medium text-white">
                  { current === quizQuestions.length - 1
                    ? "Hoàn thành"
                    : "Tiếp tục" }
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <SuccessModal />
      </SafeAreaView>
    </AuthGuard>
  );
};

export default QuizScreen;
