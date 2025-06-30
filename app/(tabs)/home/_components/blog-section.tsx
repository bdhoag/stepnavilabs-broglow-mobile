import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const BlogSection = () =>
{
    const blogs = [
        {
            id: 1,
            author: "thanhntse",
            time: "10 phút trước",
            title: "Bí Quyết Chăm Sóc Da: Hiểu Đúng, Chăm Đúng, Da Đẹp",
            excerpt:
                "Chăm sóc da không chỉ đơn giản là bôi kem dưỡng hay đắp mặt nạ mà ...",
            // image: require( "@/assets/sample-blog-image.png" ),
        },
        {
            id: 2,
            author: "nguyenvanb",
            time: "20 phút trước",
            title: "Tẩy Tế Bào Chết Đúng Cách Cho Da Nhạy Cảm",
            excerpt:
                "Làm sạch tế bào chết giúp da mịn màng hơn, nhưng cần biết cách để...",
            // image: require( "@/assets/sample-blog-image.png" ),
        },
        {
            id: 3,
            author: "lethithu",
            time: "30 phút trước",
            title: "Dưỡng Ẩm Đúng Cách Trong Mùa Đông",
            excerpt:
                "Thời tiết lạnh dễ khiến da bị khô nẻ, hãy cùng tìm hiểu...",
            // image: require( "@/assets/sample-blog-image.png" ),
        },
    ];
    return (
        <View className="mb-6">
            <View className="px-5 mb-4">
                <Text className="text-xl font-quicksand-bold text-gray-900">
                    Bài viết mới
                </Text>
            </View>

            <ScrollView className='mx-6' horizontal showsHorizontalScrollIndicator={ false }>
                { blogs.map( ( blog ) => (
                    <View
                        key={ blog.id }
                        className="mr-4 w-72 h-96 rounded-[40px] overflow-hidden bg-gray-300"
                    >
                        <View className="absolute right-4 top-4 w-10 h-10 rounded-full bg-white items-center justify-center">
                            <Feather name="heart" size={ 16 } color="#F87171" />
                        </View>
                        <View className="absolute bottom-4 mx-4 px-3 py-6 bg-white rounded-[40px] h-52">
                            <View className="flex-row justify-between items-center mb-2 ">
                                <View className="flex-row items-center">
                                    <Image
                                        source={ { uri: "https://placekitten.com/40/40" } }
                                        className="w-8 h-8 rounded-full mr-2 bg-gray-200"
                                    />
                                    <Text className="text-xs text-gray-600 font-quicksand-medium">
                                        { blog.author }
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-500 font-quicksand-light">
                                    { blog.time }
                                </Text>

                            </View>

                            <Text className="text-base font-quicksand-bold text-gray-900 leading-5 mb-2">
                                { blog.title }
                            </Text>

                            <Text className="text-sm font-quicksand-light text-gray-700 leading-5">
                                { blog.excerpt }
                            </Text>
                        </View>
                    </View>
                ) ) }
            </ScrollView>
        </View>
    )
}

export default BlogSection