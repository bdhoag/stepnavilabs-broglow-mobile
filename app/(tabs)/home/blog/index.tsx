import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { vi } from 'date-fns/locale/vi';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import
{
    ActivityIndicator,
    Alert,
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/src/contexts/auth-context';
import { Blog, blogService } from '@/src/services/blog.service';

// Skeleton Component remains the same
const BlogListItemSkeleton = () => (
    <View className="mb-4 bg-white rounded-2xl shadow-sm overflow-hidden flex-row h-40" style={ { elevation: 2 } }>
        <View className="w-32 h-full bg-gray-200" />
        <View className="flex-1 p-3 justify-between">
            <View className="flex-row justify-between items-start">
                <View className="h-3 w-20 bg-gray-200 rounded" />
                <View className="w-6 h-6 bg-gray-200 rounded" />
            </View>
            <View className="my-1 space-y-2 flex-1 justify-center">
                <View className="h-4 bg-gray-200 rounded w-full" />
                <View className="h-4 bg-gray-200 rounded w-5/6" />
                <View className="h-4 bg-gray-200 rounded w-3/4" />
            </View>
            <View className="flex-row items-center">
                <View className="w-7 h-7 rounded-full mr-2 bg-gray-200" />
                <View className="h-4 w-24 bg-gray-200 rounded" />
            </View>
        </View>
    </View>
);

const BlogScreen = () =>
{
    const { user } = useAuth();
    console.log( "Current User:", user );
    const [ blogs, setBlogs ] = useState<Blog[]>( [] );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ error, setError ] = useState<string | null>( null );
    const [ likingBlogId, setLikingBlogId ] = useState<string | null>( null );
    const [ isRefreshing, setIsRefreshing ] = useState( false );

    const fetchBlogs = async ( isInitialLoad = false ) =>
    {
        // Only show the full-screen skeleton on the very first load
        if ( isInitialLoad )
        {
            setIsLoading( true );
        }
        try
        {
            const response = await blogService.getBlogs( 1, 10 );
            setBlogs( response.data );
            setError( null );
        } catch ( err )
        {
            console.error( "Failed to fetch blogs:", err );
            setError( "Không thể tải được bài viết. Vui lòng thử lại sau." );
        } finally
        {
            if ( isInitialLoad )
            {
                setIsLoading( false );
            }
        }
    };
    useFocusEffect(
        // By wrapping the function in useCallback, we ensure it's not recreated on every render.
        // This is a crucial performance optimization for useFocusEffect.
        useCallback( () =>
        {
            console.log( 'Screen is focused, fetching blogs...' );
            // Use 'true' for the initial load check.
            // If blogs are already loaded, this won't show the skeleton,
            // but it will still refresh the data.
            fetchBlogs(
                blogs.length === 0
            );

            // You can also return a cleanup function if needed,
            // which runs when the screen goes out of focus.
            return () =>
            {
                console.log( 'Screen is unfocused.' );
            };
        }, [ blogs.length ] )
    );

    const onRefresh = useCallback( async () =>
    {
        setIsRefreshing( true ); // Show the refresh indicator
        await fetchBlogs();     // Re-fetch the data
        setIsRefreshing( false ); // Hide the refresh indicator
    }, [] );
    const handleLikeToggle = async ( blogId: string ) =>
    {
        if ( !user )
        {
            Alert.alert( "Yêu cầu đăng nhập", "Bạn cần đăng nhập để thực hiện hành động này." );
            // Optionally navigate to login screen: router.push('/login');
            return;
        }

        if ( likingBlogId ) return; // Prevent multiple clicks while one is processing

        setLikingBlogId( blogId );

        const originalBlogs = [ ...blogs ]; // Keep a copy for rollback on error

        // --- Optimistic Update ---
        setBlogs( prevBlogs =>
            prevBlogs.map( b =>
            {
                if ( b._id === blogId )
                {
                    const isLiked = b.likedBy.some( liker => liker._id === user._id );
                    if ( isLiked )
                    {
                        // Optimistically Unlike
                        return {
                            ...b,
                            likedBy: b.likedBy.filter( liker => liker._id !== user._id ),
                            likesCount: b.likesCount - 1,
                        };
                    } else
                    {
                        // Optimistically Like
                        return {
                            ...b,
                            likedBy: [ ...b.likedBy, { _id: user._id, email: user.email } ],
                            likesCount: b.likesCount + 1,
                        };
                    }
                }
                return b;
            } )
        );

        try
        {
            await blogService.likeBlog( blogId );
            // API call was successful, the optimistic update is now confirmed.
        } catch ( err )
        {
            console.error( "Failed to toggle like on blog:", err );
            Alert.alert( "Lỗi", "Không thể thay đổi trạng thái thích. Vui lòng thử lại." );
            // --- Rollback on Error ---
            setBlogs( originalBlogs );
        } finally
        {
            setLikingBlogId( null ); // Re-enable the button
        }
    };

    const renderHeader = () => (
        <View className="flex-row items-center justify-start pt-5 pb-4 px-4">
            <TouchableOpacity onPress={ () => router.back() } className="mr-3">
                <Ionicons name="arrow-back" size={ 24 } color="#333" />
            </TouchableOpacity>
            <Text className="text-2xl font-quicksand-bold text-gray-900">
                Bài viết
            </Text>
        </View>
    );

    const renderFloatingButton = () => (
        <TouchableOpacity
            className="absolute bottom-28 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
            style={ { elevation: 5 } }
            onPress={ () =>
            {
                router.push( '/(tabs)/home/blog/add' ); // Navigate to the add blog screen
            } } // Example action
        >
            <Ionicons name="add" size={ 32 } color="white" />
        </TouchableOpacity>
    );

    if ( isLoading )
    {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <StatusBar barStyle="dark-content" />
                { renderHeader() }
                <ScrollView contentContainerStyle={ { paddingHorizontal: 16 } } showsVerticalScrollIndicator={ false }>
                    <BlogListItemSkeleton />
                    <BlogListItemSkeleton />
                    <BlogListItemSkeleton />
                    <BlogListItemSkeleton />
                </ScrollView>
                { renderFloatingButton() }
            </SafeAreaView>
        );
    }

    if ( error )
    {
        return (
            <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-4">
                <Text className="text-red-500 text-center font-quicksand">{ error }</Text>
            </SafeAreaView>
        );
    }

    if ( blogs.length === 0 && !isLoading )
    {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                { renderHeader() }
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-600 font-quicksand">Chưa có bài viết nào.</Text>
                </View>
                { renderFloatingButton() }
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" />
            <View className="flex-1">
                { renderHeader() }
                <ScrollView
                    contentContainerStyle={ { paddingHorizontal: 16, paddingBottom: 100 } }
                    showsVerticalScrollIndicator={ false }
                    refreshControl={
                        <RefreshControl
                            refreshing={ isRefreshing } // Controls when the spinner is visible
                            onRefresh={ onRefresh }      // Function to call when user pulls down
                            tintColor="#3B82F6"          // (Optional) Spinner color on iOS
                            colors={ [ "#3B82F6" ] }     // (Optional) Spinner color on Android
                        />
                    }
                >
                    { blogs.map( blog =>
                    {
                        const isLiked = user ? blog.likedBy.some( liker => String( liker._id ) === String( user._id ) ) : false;
                        const isCurrentlyLiking = likingBlogId === blog._id;

                        return (
                            <TouchableOpacity
                                key={ blog._id }
                                className="mb-4 bg-white rounded-2xl shadow-sm overflow-hidden flex-row"
                                style={ { elevation: 2 } }
                                activeOpacity={ 0.8 }
                                onPress={ () =>
                                {
                                    console.log( "Navigating to blog:", blog._id );
                                    router.push( {
                                        pathname: "/(tabs)/home/blog/detail", // The canonical file path
                                        params: { id: blog._id },        // The dynamic parameters
                                    } );
                                } } // Example navigation
                            >
                                <Image
                                    source={ { uri: blog.images?.[ 0 ]?.url || 'https://via.placeholder.com/150' } }
                                    className="w-32 h-full"
                                    resizeMode="cover"
                                />

                                <View className="flex-1 p-3 justify-between">
                                    <View className="flex-row justify-between items-start">
                                        <Text className="text-xs font-quicksand text-gray-400">
                                            { formatDistanceToNow( new Date( blog.createdAt ), {
                                                addSuffix: true,
                                                locale: vi,
                                            } ) }
                                        </Text>

                                        {/* Like Button and Count */ }
                                        <View className="flex-row items-center gap-1">
                                            <TouchableOpacity
                                                onPress={ () => handleLikeToggle( blog._id ) }
                                                disabled={ isCurrentlyLiking }
                                                className="p-1 -mt-1 -mr-1"
                                            >
                                                { isCurrentlyLiking ? (
                                                    <ActivityIndicator size="small" color="#ef4444" />
                                                ) : (
                                                    <Ionicons
                                                        name={ isLiked ? "heart" : "heart-outline" }
                                                        size={ 22 }
                                                        color={ isLiked ? "#ef4444" : "#6b7280" }
                                                    />
                                                ) }
                                            </TouchableOpacity>
                                            <Text className="text-sm font-quicksand-medium text-gray-600">{ blog.likesCount }</Text>
                                        </View>
                                    </View>

                                    <View className="flex-1 justify-center my-1">
                                        <Text className="text-base font-quicksand-bold text-gray-800 leading-5" numberOfLines={ 3 }>
                                            { blog.title }
                                        </Text>
                                    </View>

                                    <View className="flex-row items-center">
                                        <Image
                                            source={ { uri: `https://ui-avatars.com/api/?name=${ blog.author.email.split( '@' )[ 0 ] }&background=random` } }
                                            className="w-7 h-7 rounded-full mr-2 bg-gray-100"
                                        />
                                        <Text className="text-sm font-medium text-gray-700">{ blog.author.email.split( '@' )[ 0 ] }</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    } ) }
                </ScrollView>
            </View>
            { user && renderFloatingButton() }
        </SafeAreaView>
    );
};

export default BlogScreen;