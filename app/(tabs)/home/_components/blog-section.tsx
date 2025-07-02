import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { vi } from 'date-fns/locale/vi';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';


import { Blog, blogService } from '@/src/services/blog.service';
import BlogCardSkeleton from './blog-skeleton';


const createExcerpt = ( html: string, maxLength: number = 100 ): string =>
{
    // Xóa các tag HTML
    const text = html.replace( /<[^>]*>/g, '' );
    if ( text.length <= maxLength )
    {
        return text;
    }
    return text.substring( 0, text.lastIndexOf( ' ', maxLength ) ) + '...';
};


const BlogSection = () =>
{
    const [ blogs, setBlogs ] = useState<Blog[]>( [] );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ error, setError ] = useState<string | null>( null );
    useEffect( () =>
    {
        const fetchBlogs = async () =>
        {
            try
            {
                const response = await blogService.getBlogs( 1, 5 );
                setBlogs( response.data );
            } catch ( err )
            {
                console.error( "Failed to fetch blogs:", err );
                setError( "Không thể tải được bài viết. Vui lòng thử lại." );
            } finally
            {
                setIsLoading( false );
            }
        };

        fetchBlogs();
    }, [] );

    if ( isLoading )
    {
        return (
            <View className="mb-6">
                <View className="px-5 mb-4">
                    <View className="h-7 w-40 bg-gray-200 rounded-lg" />
                </View>

                <ScrollView
                    className='mx-6'
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                >
                    <BlogCardSkeleton />
                    <BlogCardSkeleton />
                </ScrollView>
            </View>
        );
    }

    if ( error )
    {
        return (
            <View className="h-96 justify-center items-center px-5">
                <Text className="text-red-500 text-center">{ error }</Text>
            </View>
        );
    }

    if ( blogs.length === 0 )
    {
        return (
            <View className="h-96 justify-center items-center px-5">
                <Text className="text-gray-600">Chưa có bài viết nào.</Text>
            </View>
        );
    }

    return (
        <View className="mb-6">
            <View className="px-5 mb-4 flex-row items-center justify-between">
                <Text className="text-xl font-quicksand-bold text-gray-900">
                    Bài viết mới
                </Text>
                <Text className="text-lg font-quicksand text-[#1584F2]">
                    Xem thêm
                </Text>
            </View>

            <ScrollView className='mx-6' horizontal showsHorizontalScrollIndicator={ false }>
                { blogs.map( ( blog ) => (
                    <View
                        key={ blog._id } // Dùng _id từ API làm key
                        className="mr-4 w-72 h-96 rounded-[40px] overflow-hidden bg-gray-200"
                    >
                        {/* Ảnh bìa của bài viết */ }
                        { blog.images && blog.images[ 0 ] && (
                            <Image
                                source={ { uri: blog.images[ 0 ].url } }
                                className="w-full h-full absolute"
                                resizeMode="cover"
                            />
                        ) }

                        <View className="absolute bottom-4 mx-4 px-3 py-6 bg-white/80 backdrop-blur-sm rounded-[40px] h-52">
                            <View className="flex-row justify-between items-center mb-2">
                                <View className="flex-row items-center">
                                    <Image
                                        source={ { uri: `https://ui-avatars.com/api/?name=${ blog.author.email.split( '@' )[ 0 ] }&background=random` } }
                                        className="w-8 h-8 rounded-full mr-2 bg-gray-200"
                                    />
                                    <Text className="text-xs text-gray-600 font-quicksand-medium">
                                        { blog.author.email.split( '@' )[ 0 ] }
                                    </Text>
                                </View>
                                <Text className="text-xs text-gray-500 font-quicksand-light">
                                    { formatDistanceToNow( new Date( blog.createdAt ), {
                                        addSuffix: true,
                                        locale: vi,
                                    } ) }
                                </Text>
                            </View>

                            <Text className="text-base font-quicksand-bold text-gray-900 leading-5 mb-2" numberOfLines={ 2 }>
                                { blog.title }
                            </Text>

                            <Text className="text-sm font-quicksand-light text-gray-700 leading-5" numberOfLines={ 3 }>
                                { createExcerpt( blog.content, 80 ) }
                            </Text>
                        </View>
                    </View>
                ) ) }
            </ScrollView>
        </View>
    );
};

export default BlogSection;