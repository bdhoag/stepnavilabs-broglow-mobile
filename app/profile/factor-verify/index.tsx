import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TwoFactorVerifyScreen() {
  return (
    <View className="flex-1 px-4 pt-10 bg-white">
      <Text className="mb-6 text-lg font-semibold">Xác thực 2 yếu tố</Text>

      <Text>Email hoặc số điện thoại</Text>
      <TextInput className="px-3 py-2 my-2 border rounded" placeholder="Email/số điện thoại đã đăng ký" />

      <TouchableOpacity className="items-center py-3 mt-6 bg-blue-500 rounded-xl">
        <Text className="font-semibold text-white">Tiếp tục</Text>
      </TouchableOpacity>
    </View>
  );
}
