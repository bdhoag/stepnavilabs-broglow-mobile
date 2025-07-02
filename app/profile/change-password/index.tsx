import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChangePasswordScreen() {
  return (
    <View className="flex-1 px-4 pt-10 bg-white">
      <Text className="mb-6 text-lg font-semibold">Đổi mật khẩu</Text>

      <Text>Mật khẩu</Text>
      <TextInput secureTextEntry className="px-3 py-2 my-2 border rounded" />

      <Text>Nhập lại mật khẩu</Text>
      <TextInput secureTextEntry className="px-3 py-2 my-2 border rounded" />

      <TouchableOpacity className="items-center py-3 mt-6 bg-blue-500 rounded-xl">
        <Text className="font-semibold text-white">Thay đổi</Text>
      </TouchableOpacity>
    </View>
  );
}
