import AuthGuard from "@/src/components/auth-guard";
import { fetchRoutineProfileQuestions, RoutineProfileQuestion, submitRoutineProfileAnswers } from "@/src/services/routine-profile.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import
{
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get( "window" );

const RoutineQuizScreen = () =>
{
  const [ questions, setQuestions ] = useState<RoutineProfileQuestion[]>( [] );
  const [ current, setCurrent ] = useState( 0 );
  const [ answers, setAnswers ] = useState<{ [ key: string ]: string[] }>( {} );
  const [ loading, setLoading ] = useState( true );
  const [ showSuccessModal, setShowSuccessModal ] = useState( false );

  const router = useRouter();
  const navigation = useNavigation();

  const currentQuestion = questions[ current ];
  const selectedOptions = currentQuestion ? answers[ currentQuestion._id ] || [] : [];

  useFocusEffect(
    useCallback( () =>
    {
      const parent = navigation.getParent();
      parent?.setOptions( { tabBarStyle: { display: "none" } } );
      return () => parent?.setOptions( { tabBarStyle: { display: "flex" } } );
    }, [ navigation ] )
  );

  useEffect( () =>
  {
    const loadQuestions = async () =>
    {
      try
      {
        const data = await fetchRoutineProfileQuestions();
        setQuestions( data );
      } catch ( err )
      {
        console.error( "Lỗi tải câu hỏi:", err );
      } finally
      {
        setLoading( false );
      }
    };
    loadQuestions();
  }, [] );

  const handleSelect = ( optionId: string ) =>
  {
    setAnswers( ( prev ) => ( {
      ...prev,
      [ currentQuestion._id ]: [ optionId ],
    } ) );
  };

  const handleSubmitAnswers = () =>
  {
    setShowSuccessModal( true );  // Hiện modal ngay

    const formattedAnswers = questions.map( ( q ) => ( {
      questionId: q._id,
      answers: answers[ q._id ] || [],
    } ) );

    submitRoutineProfileAnswers( formattedAnswers ).catch( ( error ) =>
    {
      console.error( "Lỗi gửi câu trả lời routine:", error );
      alert( "Gửi câu trả lời thất bại, vui lòng thử lại." );
      setShowSuccessModal( false ); // ẩn modal nếu lỗi xảy ra
    } );
  };

  const handleNext = () =>
  {
    if ( current < questions.length - 1 )
    {
      setCurrent( current + 1 );
    } else
    {
      handleSubmitAnswers();
    }
  };

  const handlePrev = () =>
  {
    if ( current > 0 ) setCurrent( current - 1 );
  };

  const handleBack = () =>
  {
    if ( router.canGoBack() )
    {
      router.back();
    } else
    {
      router.push( "/(tabs)/home" );
    }
  };

  const handleModalOK = () =>
  {
    setShowSuccessModal( false );
    router.replace( "/(tabs)/home" );
  };

  if ( loading )
  {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#1e90ff" />
        <Text className="mt-2 text-gray-500">Đang tải câu hỏi...</Text>
      </SafeAreaView>
    );
  }

  if ( !currentQuestion )
  {
    return (
      <AuthGuard>
        <SafeAreaView className="items-center justify-center flex-1 bg-white">
          <Text className="text-gray-500">Không có câu hỏi nào để hiển thị.</Text>
        </SafeAreaView>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <SafeAreaView className="flex-1 px-4 pt-4 bg-white">
        {/* Header */ }
        <View className="flex-row items-center w-full pl-6 my-4">
          <TouchableOpacity onPress={ handleBack } className="mr-2">
            <Ionicons name="arrow-back" size={ 24 } color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Gợi ý chu trình chăm sóc da
          </Text>
        </View>

        {/* Progress Bar */ }
        <View className="flex-row justify-between w-full mt-5 mb-3 px-7">
          { questions.map( ( _, index ) => (
            <View
              key={ index }
              className="flex-1 h-2 mx-0.5 rounded-full"
              style={ {
                backgroundColor: index <= current ? "#4A90E2" : "#E5E7EB",
              } }
            />
          ) ) }
        </View>

        {/* Subtitle */ }
        <View className="items-center w-full my-4">
          <Text className="text-sm text-gray-500">Hãy trả lời những câu hỏi sau</Text>
        </View>

        {/* Question */ }
        <Text className="px-5 my-6 text-xl font-bold text-center text-black">
          { currentQuestion.question }
        </Text>

        {/* Options */ }
        <FlatList
          data={ currentQuestion.options }
          keyExtractor={ ( item ) => item._id }
          renderItem={ ( { item } ) =>
          {
            const selected = selectedOptions.includes( item._id );
            return (
              <View className="px-7">
                <TouchableOpacity
                  onPress={ () => handleSelect( item._id ) }
                  activeOpacity={ 0.8 }
                >
                  { selected ? (
                    <LinearGradient
                      colors={ [ "#3eaef4", "#1e90ff" ] }
                      className="items-start p-3 mb-4 rounded-3xl"
                      style={ { borderRadius: 15, padding: 12, marginBottom: 16 } }
                    >
                      <Text
                        className="text-lg font-semibold text-white"
                        style={ { marginLeft: 6 } }
                      >
                        { item.label }
                      </Text>
                    </LinearGradient>
                  ) : (
                    <View
                      className="p-3 mb-4 items-start bg-white border-2 border-[#E5E7EB]"
                      style={ { borderRadius: 15 } }
                    >
                      <Text
                        className="text-lg font-semibold text-gray-800"
                        style={ { marginLeft: 6 } }
                      >
                        { item.label }
                      </Text>
                    </View>
                  ) }
                </TouchableOpacity>
              </View>
            );
          } }
        />

        {/* Navigation Buttons */ }
        <View className="flex-row justify-between w-full px-7 bottom-4">
          <TouchableOpacity
            onPress={ handlePrev }
            disabled={ current === 0 }
            className={ `px-5 py-3 rounded-full border ${ current === 0
              ? "opacity-40 border-blue-100 bg-blue-100"
              : "border-blue-100 bg-blue-100"
              }` }
          >
            <Text className="text-lg font-medium text-blue-500">Quay lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={ handleNext }
            disabled={ selectedOptions.length === 0 }
            className={ `px-6 py-3 rounded-full ${ selectedOptions.length === 0 ? "bg-gray-300" : "bg-[#1e90ff]"
              }` }
          >
            <Text className="text-lg font-medium text-white">
              { current === questions.length - 1 ? "Hoàn thành" : "Tiếp tục" }
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal khi hoàn tất */ }
        <Modal
          visible={ showSuccessModal }
          transparent
          animationType="fade"
          onRequestClose={ () => { } }
        >
          <View className="items-center justify-center flex-1 bg-black/50">
            <View className="bg-white rounded-[50px] p-8 w-4/5 min-h-[300px] items-center shadow-lg">
              <View
                style={ {
                  width: 100,
                  height: 100,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 40,
                  marginTop: 20,
                  position: "relative",
                } }
              >
                {/* Các chấm nhỏ màu xanh */ }
                { [
                  { top: -20, left: 60, size: 8 },
                  { top: 96, left: -10, size: 6 },
                  { top: 90, left: 85, size: 4 },
                  { top: 110, left: 100, size: 15 },
                  { top: 8, left: -40, size: 25 },
                  { top: 8, left: 120, size: 12 },
                  { top: 125, left: 30, size: 7 },
                ].map( ( dot, index ) => (
                  <View
                    key={ index }
                    style={ {
                      position: "absolute",
                      width: dot.size,
                      height: dot.size,
                      borderRadius: dot.size / 2,
                      backgroundColor: "#4A90E2",
                      top: dot.top,
                      left: dot.left,
                    } }
                  />
                ) ) }
                {/* Vòng tròn lớn với icon check */ }
                <View
                  style={ {
                    width: 100,
                    height: 100,
                    borderRadius: 50,
                    backgroundColor: "#4A90E2",
                    justifyContent: "center",
                    alignItems: "center",
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
              </View>

              <Text className="text-lg font-bold text-[#4A90E2] mb-1 text-center">
                Hoàn Thành
              </Text>
              <Text className="mb-2 text-xs text-center text-gray-500">
                Bạn đã hoàn tất lựa chọn chu trình skincare
              </Text>
              <TouchableOpacity
                onPress={ handleModalOK }
                className="bg-[#4A90E2] px-12 py-3 rounded-2xl w-full mt-6"
              >
                <Text className="text-base font-semibold text-center text-white">
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </AuthGuard>
  );
};

export default RoutineQuizScreen;