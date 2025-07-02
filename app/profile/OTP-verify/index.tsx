import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OTPVerifyScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-10">
      <Text className="text-lg font-semibold mb-6">Thông tin tài khoản</Text>
      <Text className="mb-4">Mã xác nhận đã được gửi qua email</Text>

      <View className="flex-row justify-between mb-6">
        <TextInput className="border w-14 h-14 text-center rounded text-xl" maxLength={1} keyboardType="number-pad" />
        <TextInput className="border w-14 h-14 text-center rounded text-xl" maxLength={1} keyboardType="number-pad" />
        <TextInput className="border w-14 h-14 text-center rounded text-xl" maxLength={1} keyboardType="number-pad" />
        <TextInput className="border w-14 h-14 text-center rounded text-xl" maxLength={1} keyboardType="number-pad" />
      </View>

      <TouchableOpacity className="bg-blue-500 py-3 rounded-xl items-center">
        <Text className="text-white font-semibold">Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
}
