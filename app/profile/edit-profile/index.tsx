import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditProfileScreen() {
  return (
    <View className="flex-1 px-4 pt-10 bg-white">
      <Text className="mb-4 text-lg font-semibold">Thông tin tài khoản</Text>

      <View className="items-center mb-6">
        <Image source={{ uri: 'https://placekitten.com/200/200' }} className="w-24 h-24 rounded-full" />
        <TouchableOpacity className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full">
          <Text className="text-xs text-white">✎</Text>
        </TouchableOpacity>
      </View>

      <Text>Username</Text>
      <TextInput className="px-3 py-2 my-2 border rounded" value="bd_hoag" editable={false} />

      <Text>Họ tên</Text>
      <TextInput className="px-3 py-2 my-2 border rounded" value="Bui Duc Hoang" />

      <Text>Số điện thoại</Text>
      <TextInput className="px-3 py-2 my-2 border rounded" value="012 345 6789" keyboardType="phone-pad" />

      <Text>Ngày sinh</Text>
      <TextInput className="px-3 py-2 my-2 border rounded" value="27/03/2003" />

      <TouchableOpacity className="items-center py-3 mt-6 bg-blue-500 rounded-xl">
        <Text className="font-semibold text-white">Lưu</Text>
      </TouchableOpacity>
    </View>
  );
}
