import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import FreeSubscription from './components/FreeSubscription'
import ProSubscription from './components/ProSubscription'

const Subscription = () =>
{
  const router = useRouter();

  const handleBack = () =>
  {
    router.back();
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={ styles.headerTitle }>
          Xác định hồ sơ da
        </Text>
      </View>

      {/* Content */ }
      <ScrollView style={ styles.mainContentContainer }>
        <FreeSubscription
          featureAvailable={ [
            'Scan da mặt',
            'Phân tích da bằng AI',
            'Lưu lại quá trình mỗi lần scan da',
            'Xác định hồ sơ da',
            'Tham gia cộng đồng chăm sóc da',
            'Gợi ý sử dụng sản phẩm bằng AI',
            'Gợi ý chu trình chăm sóc da'
          ] }
          featureUnavailable={ [
            'Tư vấn với chuyên gia',
          ] }
        />
        <ProSubscription
          featureAvailable={ [
            'Scan da mặt',
            'Phân tích da bằng AI',
            'Lưu lại quá trình mỗi lần scan da',
            'Xác định hồ sơ da',
            'Tham gia cộng đồng chăm sóc da',
            'Gợi ý sử dụng sản phẩm bằng AI (không giới hạn)',
            'Gợi ý chu trình chăm sóc da (không giới hạn)',
            'Tư vấn với chuyên gia',
          ] }
          featureUnavailable={ [] }
        />
      </ScrollView>

    </SafeAreaView>
  )
}

export default Subscription

const styles = StyleSheet.create( {
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  mainContentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
} )
