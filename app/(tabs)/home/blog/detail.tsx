import { useAuth } from '@/src/contexts/auth-context';
import { Blog, blogService, Comment } from '@/src/services/blog.service';
import { Ionicons } from '@expo/vector-icons';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { vi } from 'date-fns/locale/vi';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import
{
    ActivityIndicator,
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { SafeAreaView } from 'react-native-safe-area-context';

const CommentItem = ( {
    comment,
    blogId,
    user,
    onLikeToggle,
    isLiking,
}: {
    comment: Comment;
    blogId: string;
    user: { _id: string; email: string } | null; // Assuming user type
    onLikeToggle: ( commentId: string ) => void;
    isLiking: boolean;
} ) =>
{
    const isLikedByUser = user ? comment.likedBy.some( liker => String( liker._id ) === String( user._id ) ) : false;

    return (
        <View className="flex-row items-start mb-6">
            <Image
                source={ { uri: `https://ui-avatars.com/api/?name=${ comment.author.email.split( '@' )[ 0 ] }&background=random` } }
                className="w-10 h-10 rounded-full mr-3 bg-gray-100"
            />
            <View className="flex-1 bg-gray-50 rounded-2xl p-3">
                <View className="flex-row justify-between items-start mb-1">
                    <View className="flex-1">
                        <Text className="font-bold text-sm text-gray-800">{ comment.author.email.split( '@' )[ 0 ] }</Text>
                        <Text className="text-xs text-gray-500 mb-2">
                            { formatDistanceToNow( new Date( comment.createdAt ), { addSuffix: true, locale: vi } ) }
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={ () => onLikeToggle( comment._id ) }
                        disabled={ isLiking }
                        className="flex-row items-center gap-1 p-1"
                    >
                        { isLiking ? (
                            <ActivityIndicator size="small" color="#ef4444" />
                        ) : (
                            <Ionicons
                                name={ isLikedByUser ? "heart" : "heart-outline" }
                                size={ 20 }
                                color={ isLikedByUser ? "#ef4444" : "#6B7280" }
                            />
                        ) }
                        <Text className="text-sm text-gray-600">{ comment.likes }</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-800 leading-5">{ comment.content }</Text>
            </View>
        </View>
    );
};

const CommentSection = ( {
    blogId,
    comments,
    onInputFocus,
    onCommentLikeToggle,
    likingCommentId,
    onAddComment,
    isPostingComment,
}: {
    blogId: string;
    comments: Comment[];
    onInputFocus: () => void,
    onCommentLikeToggle: ( commentId: string ) => void;
    likingCommentId: string | null;
    onAddComment: ( content: string ) => Promise<void>;
    isPostingComment: boolean;
} ) =>
{
    const { user } = useAuth();
    const [ newComment, setNewComment ] = useState( "" );

    const handlePostComment = async () =>
    {
        if ( !newComment.trim() ) return; // Don't post empty comments

        await onAddComment( newComment );
        setNewComment( "" ); // Clear input after successful post
        Keyboard.dismiss(); // Hide the keyboard
    };

    return (
        <View className="px-4 py-6 border-t border-gray-200">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-900">
                    Bình luận <Text className="text-blue-500">{ comments.length }</Text>
                </Text>
                <TouchableOpacity>
                    <Ionicons name="swap-vertical" size={ 22 } color="#3B82F6" />
                </TouchableOpacity>
            </View>

            { user && (
                <View className="flex-row items-center mb-6">
                    <Image
                        source={ { uri: `https://ui-avatars.com/api/?name=${ user.email.split( '@' )[ 0 ] }&background=random` } }
                        className="w-10 h-10 rounded-full mr-3"
                    />
                    <View className="flex-1 flex-row items-center bg-white rounded-full border border-gray-300 px-4">
                        <TextInput
                            placeholder="Viết bình luận..."
                            value={ newComment }
                            onFocus={ onInputFocus }
                            placeholderTextColor={ "#9CA3AF" }
                            onChangeText={ setNewComment }
                            editable={ !isPostingComment } // Disable input while posting
                            className="flex-1 h-12 text-gray-900"
                        />
                        <TouchableOpacity onPress={ handlePostComment } disabled={ isPostingComment || !newComment.trim() }>
                            { isPostingComment ? (
                                <ActivityIndicator size="small" />
                            ) : (
                                <Ionicons name="send" size={ 24 } color="#3B82F6" />
                            ) }
                        </TouchableOpacity>
                    </View>
                </View>
            ) }

            { comments.map( comment => (
                <CommentItem
                    key={ comment._id }
                    comment={ comment }
                    blogId={ blogId }
                    user={ user }
                    onLikeToggle={ onCommentLikeToggle }
                    isLiking={ likingCommentId === comment._id }
                />
            ) ) }
        </View>
    );
};

const BlogDetailScreen = () =>
{
    const router = useRouter();
    const { user } = useAuth();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { width } = useWindowDimensions();

    const [ blog, setBlog ] = useState<Blog | null>( null );
    const [ isLoading, setIsLoading ] = useState( true );
    const [ error, setError ] = useState<string | null>( null );
    const [ isLiking, setIsLiking ] = useState( false );
    const [ likingCommentId, setLikingCommentId ] = useState<string | null>( null );
    const [ isPostingComment, setIsPostingComment ] = useState( false ); // New state for adding comments

    const scrollRef = useRef<ScrollView>( null );

    useEffect( () =>
    {
        if ( !id ) return;

        const fetchBlog = async () =>
        {
            try
            {
                setIsLoading( true );
                const data = await blogService.getBlogById( id );
                setBlog( data );
            } catch ( err )
            {
                console.error( err );
                setError( "Không thể tải chi tiết bài viết." );
            } finally
            {
                setIsLoading( false );
            }
        };

        fetchBlog();
    }, [ id ] );
    const handleLikeToggle = async () =>
    {
        if ( !user )
        {
            Alert.alert( "Yêu cầu đăng nhập", "Bạn cần đăng nhập để thích bài viết này." );
            return;
        }
        if ( !blog || isLiking ) return;

        setIsLiking( true );
        const originalBlog = { ...blog }; // Keep a copy for rollback on error

        // Optimistic Update: Update the UI immediately
        const isCurrentlyLiked = blog.likedBy.some( liker => String( liker._id ) === String( user._id ) );

        const updatedBlog = {
            ...blog,
            likedBy: isCurrentlyLiked
                ? blog.likedBy.filter( liker => String( liker._id ) !== String( user._id ) )
                : [ ...blog.likedBy, { _id: user._id, email: user.email } ],
            likesCount: isCurrentlyLiked ? blog.likesCount - 1 : blog.likesCount + 1,
        };
        setBlog( updatedBlog );

        try
        {
            await blogService.likeBlog( blog._id );
        } catch ( err )
        {
            console.error( "Failed to toggle like on blog:", err );
            Alert.alert( "Lỗi", "Không thể thay đổi trạng thái thích. Vui lòng thử lại." );
            setBlog( originalBlog ); // Rollback UI on error
        } finally
        {
            setIsLiking( false );
        }
    };

    const handleCommentLikeToggle = async ( commentId: string ) =>
    {
        if ( !user )
        {
            Alert.alert( "Yêu cầu đăng nhập", "Bạn cần đăng nhập để thích bình luận này." );
            return;
        }
        if ( !blog || likingCommentId ) return;

        setLikingCommentId( commentId );
        const originalBlog = { ...blog };

        // Optimistic Update
        const updatedComments = blog.comments.map( c =>
        {
            if ( c._id === commentId )
            {
                const isLiked = c.likedBy.some( l => String( l._id ) === String( user._id ) );
                return {
                    ...c,
                    likes: isLiked ? c.likes - 1 : c.likes + 1,
                    likedBy: isLiked
                        ? c.likedBy.filter( l => String( l._id ) !== String( user._id ) )
                        : [ ...c.likedBy, { _id: user._id, email: user.email } ]
                };
            }
            return c;
        } );

        setBlog( { ...blog, comments: updatedComments } );

        try
        {
            await blogService.likeComment( blog._id, commentId );
        } catch ( err )
        {
            console.error( "Failed to like comment:", err );
            Alert.alert( "Lỗi", "Không thể thích bình luận. Vui lòng thử lại." );
            setBlog( originalBlog ); // Rollback on error
        } finally
        {
            setLikingCommentId( null );
        }
    };
    const handleAddComment = async ( content: string ) =>
    {
        if ( !user || !blog )
        {
            Alert.alert( "Lỗi", "Không thể đăng bình luận. Vui lòng thử lại." );
            return;
        }

        setIsPostingComment( true );

        const tempId = `temp_${ Date.now() }`;
        const optimisticComment: Comment = {
            _id: tempId,
            author: { _id: user._id, email: user.email },
            content,
            likes: 0,
            likedBy: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Step 1 FIX: Ensure `...prevBlog` is present to preserve the entire blog state
        setBlog( prevBlog => prevBlog ? {
            ...prevBlog, // THIS IS THE CRITICAL FIX FOR THE STATE CORRUPTION
            comments: [ optimisticComment, ...prevBlog.comments ]
        } : null );

        try
        {
            await blogService.addComment( blog._id, content );
        } catch ( err )
        {
            console.error( "Failed to add comment:", err );
            Alert.alert( "Lỗi", "Không thể đăng bình luận. Vui lòng thử lại." );
            setBlog( prevBlog => prevBlog ? {
                ...prevBlog, // And here for the rollback
                comments: prevBlog.comments.filter( c => c._id !== tempId )
            } : null );
        } finally
        {
            setIsPostingComment( false );
        }
    };
    const handleInputFocus = () =>
    {
        // Use a timeout to ensure the keyboard is fully visible before scrolling
        setTimeout( () =>
        {
            scrollRef.current?.scrollToEnd( { animated: true } );
        }, 300 );
    };
    // ✅ CORRECTED: This is a plain object, not a StyleSheet.create() call.
    // This satisfies the type `Readonly<Record<string, MixedStyleDeclaration>>`
    const tagsStyles = useMemo( () => ( {
        body: {
            color: '#374151',
            fontSize: 16,
            lineHeight: 26,
        },
        h1: {
            color: '#111827',
            fontSize: 20,
            // --- THIS IS THE FIX ---
            fontWeight: 'bold' as const,
            marginTop: 16,
            marginBottom: 8,
        },
        p: {
            marginBottom: 16,
        },
        ul: {
            paddingLeft: 20,
        },
        li: {
            marginBottom: 10,
        }
    } ), [] );


    if ( isLoading )
    {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
            </View>
        );
    }

    if ( error || !blog )
    {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <Stack.Screen options={ { headerTitle: 'Lỗi', headerTitleAlign: 'center' } } />
                <View className="flex-1 justify-center items-center p-4">
                    <Text className="text-red-500 text-center mb-4">{ error || "Không tìm thấy bài viết." }</Text>
                    <TouchableOpacity onPress={ () => router.back() } className="mt-4 bg-blue-500 px-4 py-2 rounded-lg">
                        <Text className="text-white">Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
    const isLikedByUser = user ? blog.likedBy.some( liker => String( liker._id ) === String( user._id ) ) : false;
    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar barStyle="dark-content" />
            <View className="flex-row items-center justify-between bg-white px-4 py-3">
                <TouchableOpacity onPress={ () => router.back() } className="bg-white/80 rounded-full w-9 h-9 items-center justify-center ml-2">
                    <Ionicons name="arrow-back" size={ 24 } color="#111827" />
                </TouchableOpacity>

                <View className="flex-row gap-x-2 mr-2">
                    <TouchableOpacity className="bg-[#02a9eb22] rounded-xl w-12 h-12 items-center justify-center">
                        <Ionicons name="share-social-outline" size={ 22 } color="#1584F2" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={ handleLikeToggle }
                        disabled={ isLiking }
                        className="bg-[#ef444427] rounded-xl w-12 h-12 items-center justify-center"
                    >
                        { isLiking ? (
                            <ActivityIndicator size="small" color="#ef4444" />
                        ) : (
                            <Ionicons
                                name={ isLikedByUser ? "heart" : "heart-outline" }
                                size={ 24 }
                                color={ isLikedByUser ? "#ef4444" : "#ef4444" }
                            />
                        ) }
                    </TouchableOpacity>
                </View>

            </View>


            <KeyboardAvoidingView
                behavior={ Platform.OS === "ios" ? "padding" : "height" }
                style={ { flex: 1 } }
            // IMPORTANT: Adjust this value to match your header's height
            // keyboardVerticalOffset={ Platform.OS === 'ios' ? 60 : 0 }
            >
                <ScrollView showsVerticalScrollIndicator={ false }>
                    <Image
                        source={ { uri: blog.images?.[ 0 ]?.url ?? 'https://via.placeholder.com/400x300' } }
                        className="h-80 mx-4 rounded-2xl my-4"
                        resizeMode="cover"
                    />

                    <View className="p-4">
                        <Text className="text-xs text-gray-500 mb-2">
                            { formatDistanceToNow( new Date( blog.createdAt ), {
                                addSuffix: true,
                                locale: vi,
                            } ) }
                        </Text>

                        <Text className="text-2xl font-bold text-gray-900 leading-tight mb-4">
                            { blog.title }
                        </Text>

                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center gap-x-4">
                                { blog.tags?.[ 0 ] && (
                                    <View className="border border-blue-500 bg-blue-50 rounded-full px-3 py-1">
                                        <Text className="text-blue-600 text-xs font-semibold capitalize">{ blog.tags[ 0 ] }</Text>
                                    </View>
                                ) }
                                <View className="flex-row items-center gap-x-1">
                                    <Ionicons name="chatbubble-outline" size={ 16 } color="#6B7280" />
                                    <Text className="text-sm text-gray-500">{ blog.comments.length }</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <Image
                                    source={ { uri: `https://ui-avatars.com/api/?name=${ blog.author.email.split( '@' )[ 0 ] }&background=random` } }
                                    className="w-7 h-7 rounded-full mr-2"
                                />
                                <Text className="text-sm font-medium text-gray-800">{ blog.author.email.split( '@' )[ 0 ] }</Text>
                            </View>
                        </View>

                        <RenderHTML
                            contentWidth={ width - 32 }
                            source={ { html: blog.content } }
                            tagsStyles={ tagsStyles }
                        />
                    </View>

                    <CommentSection
                        blogId={ blog._id }
                        comments={ blog.comments }
                        onInputFocus={ handleInputFocus }
                        onCommentLikeToggle={ handleCommentLikeToggle }
                        likingCommentId={ likingCommentId }
                        onAddComment={ handleAddComment }
                        isPostingComment={ isPostingComment }
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default BlogDetailScreen;