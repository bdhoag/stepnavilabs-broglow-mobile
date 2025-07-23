import AuthGuard from "@/src/components/auth-guard";
import { fetchSkinProfileQuestions, SkinProfileQuestion, submitSkinProfileAnswers } from "@/src/services/skin-profile.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import
{
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get( "window" );

type Option = {
  _id: string;
  label: string;
};

const QuizScreen = () =>
{
  const [ questions, setQuestions ] = useState<SkinProfileQuestion[]>( [] );
  const [ current, setCurrent ] = useState( 0 );
  const [ answers, setAnswers ] = useState<{ [ key: string ]: string[] }>( {} );
  const [ loading, setLoading ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );
  const [ showSuccessModal, setShowSuccessModal ] = useState( false );
  const router = useRouter();
  const navigation = useNavigation();

  // Hide tab bar while this screen is focused
  useFocusEffect(
    React.useCallback( () =>
    {
      const parent = navigation.getParent();
      if ( parent )
      {
        parent.setOptions( { tabBarStyle: { display: "none" } } );
      }
      return () =>
      {
        if ( parent ) parent.setOptions( { tabBarStyle: { display: "flex" } } );
      };
    }, [ navigation ] )
  );

  useEffect( () =>
  {
    async function loadQuestions ()
    {
      setLoading( true );
      setError( null );
      try
      {
        const fetchedQuestions = await fetchSkinProfileQuestions();
        // Sort questions by order if needed
        fetchedQuestions.sort( ( a, b ) => a.order - b.order );
        setQuestions( fetchedQuestions );
      } catch ( err )
      {
        setError( "Không thể tải câu hỏi. Vui lòng thử lại sau." );
        console.error( err );
      } finally
      {
        setLoading( false );
      }
    }
    loadQuestions();
  }, [] );

  if ( loading )
  {
    return (
      <SafeAreaView className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#1e90ff" />
      </SafeAreaView>
    );
  }

  if ( error )
  {
    return (
      <SafeAreaView className="items-center justify-center flex-1 px-6">
        <Text className="mb-4 text-center text-red-600">{ error }</Text>
        <TouchableOpacity
          onPress={ () =>
          {
            setError( null );
            setLoading( true );
            setQuestions( [] );
            setCurrent( 0 );
            setAnswers( {} );
            // Reload questions
            fetchSkinProfileQuestions()
              .then( ( res ) =>
              {
                res.sort( ( a, b ) => a.order - b.order );
                setQuestions( res );
              } )
              .catch( () =>
                setError( "Không thể tải câu hỏi. Vui lòng thử lại sau." )
              )
              .finally( () => setLoading( false ) );
          } }
          className="px-8 py-3 bg-blue-500 rounded-full"
        >
          <Text className="font-semibold text-white">Thử lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if ( questions.length === 0 )
  {
    return (
      <SafeAreaView className="items-center justify-center flex-1 px-6">
        <Text>Không có câu hỏi nào.</Text>
      </SafeAreaView>
    );
  }

  const question = questions[ current ];
  const selectedOptions = answers[ question._id ] || [];

  const handleSelect = ( optionId: string ) =>
  {
    setAnswers( ( prev ) =>
    {
      const prevSelected = prev[ question._id ] || [];
      let updated: string[];
      if ( question.type === "MULTIPLE_CHOICE" )
      {
        updated = prevSelected.includes( optionId )
          ? prevSelected.filter( ( id ) => id !== optionId )
          : [ ...prevSelected, optionId ];
      } else
      {
        updated = [ optionId ];
      }
      return { ...prev, [ question._id ]: updated };
    } );
  };

  const handleSubmitAnswers = async () =>
  {
    // Kiểm tra các câu hỏi bắt buộc mà chưa được trả lời
    const missingRequired = questions.filter(
      ( q ) => q.isRequired && ( !answers[ q._id ] || answers[ q._id ].length === 0 )
    );

    if ( missingRequired.length > 0 )
    {
      const firstMissing = missingRequired[ 0 ];
      setCurrent( questions.findIndex( ( q ) => q._id === firstMissing._id ) );
      return;
    }
    const formattedAnswers = questions
      .map( ( q ) =>
      {
        const selected = answers[ q._id ] || [];
        if ( !selected.length ) return null;

        return {
          questionId: q._id,
          answer: q.type === "MULTIPLE_CHOICE" ? selected : selected[ 0 ],
        };
      } )
      .filter( ( a ) => a !== null );

    // Kiểm tra ObjectId hợp lệ
    const invalidIds = formattedAnswers.filter(
      ( item ) => !item || !/^[0-9a-fA-F]{24}$/.test( item!.questionId )
    );

    if ( invalidIds.length > 0 )
    {
      console.error( "Invalid MongoDB ObjectIDs found:", invalidIds );
      setError( "Lỗi dữ liệu câu hỏi. Vui lòng thử lại sau." );
      return;
    }

    try
    {
      await submitSkinProfileAnswers( formattedAnswers as any );
      setShowSuccessModal( true );
    } catch ( error )
    {
      console.error( "Lỗi gửi câu trả lời:", error );
      setError( "Không thể gửi câu trả lời. Vui lòng thử lại sau." );
    }
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
    router.back();
  };

  const handleModalOK = () =>
  {
    setShowSuccessModal( false );
    router.replace( "/(tabs)/home" );
  };

  const ProgressBar = () => (
    <View className="flex-row items-center justify-center px-4 mb-8">
      { questions.map( ( q, index ) =>
      {
        const answered = answers[ q._id ] && answers[ q._id ].length > 0;
        return (
          <React.Fragment key={ q._id }>
            <View
              className={ `h-1 flex-1 rounded-full ${ answered ? "bg-[#4A90E2]" : "bg-gray-200" }` }
            />
            { index < questions.length - 1 && <View className="w-2" /> }
          </React.Fragment>
        );
      } ) }
    </View>
  );

  const OptionItem = ( { item }: { item: Option } ) =>
  {
    const isSelected = selectedOptions.includes( item._id );
    const content = (
      <View
        className={ `flex-row items-center justify-between py-3 px-4 rounded-2xl ${ isSelected ? "" : "bg-white border border-gray-200"
          }` }
      >
        <Text
          className={ `flex-1 text-base leading-5 ${ isSelected ? "text-white" : "text-gray-800"
            }` }
        >
          { item.label }
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
        onPress={ () => handleSelect( item._id ) }
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
          <ProgressBar />
          {/* Question */ }
          <View className="mb-6">
            <Text className="px-3 mb-2 text-xl font-bold text-center text-gray-900">
              { question.question }
            </Text>

            { question.description && (
              <Text className="text-xs italic text-center text-gray-500">
                { question.description }
              </Text>
            ) }

            { question.isRequired && (
              <Text className="mt-5 text-xs italic text-center text-red-500">
                * Câu hỏi bắt buộc
              </Text>
            ) }
          </View>

          {/* Options */ }
          <FlatList
            data={ question.options }
            keyExtractor={ ( item ) => item._id }
            renderItem={ ( { item } ) => <OptionItem item={ item } /> }
            showsVerticalScrollIndicator={ false }
            contentContainerStyle={ { flexGrow: 1 } }
          />

          {/* Navigation Buttons */ }
          <View className="self-center w-11/12 py-4 bg-gray-50">
            <View className="flex-row items-center justify-between">
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

              {/* Nhóm Bỏ qua + Tiếp tục */ }
              <View className="flex-row items-center space-x-4">
                {/* Nút Bỏ qua (dạng link) */ }
                { !question.isRequired && (
                  <TouchableOpacity onPress={ handleNext }>
                    <Text className="mr-4 text-base text-blue-500 underline">Bỏ qua</Text>
                  </TouchableOpacity>
                ) }
                {/* Nút Tiếp tục / Hoàn thành */ }
                <TouchableOpacity
                  onPress={ handleNext }
                  disabled={ selectedOptions.length === 0 }
                  className={ `px-6 py-3 rounded-full ${ selectedOptions.length === 0 ? "bg-gray-300" : "bg-[#1e90ff]"
                    }` }
                >
                  <Text className="font-medium text-white">
                    { current === questions.length - 1 ? "Hoàn thành" : "Tiếp tục" }
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Modal Hoàn Thành */ }
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

              <Text className="text-lg font-bold text-[#4A90E2] mb-3 text-center">
                Hoàn Thành
              </Text>
              <Text className="mb-2 text-xs text-center text-gray-500">
                Bạn đã xác định hồ sơ da thành công. Chúng tôi sẽ sử dụng thông tin này để cung cấp các lựa chọn phù hợp nhất với bạn.
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

export default QuizScreen;