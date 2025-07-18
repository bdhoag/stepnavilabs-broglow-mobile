import { BlogRequest, blogService } from '@/src/services/blog.service';
import { fileService } from '@/src/services/file.service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import
{
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { SafeAreaView } from 'react-native-safe-area-context';

// Tái sử dụng FormInput từ AddBlogScreen (Không thay đổi)
const FormInput = ( { label, value, onChangeText, placeholder, ...props }: { label: string, value: string, onChangeText: ( text: string ) => void, placeholder: string, [ key: string ]: any } ) => (
    <View className="mb-6">
        <Text className="text-base font-semibold text-gray-800 mb-2">{ label }<Text className="text-red-500">*</Text></Text>
        <TextInput
            value={ value }
            onChangeText={ onChangeText }
            placeholder={ placeholder }
            placeholderTextColor="#9CA3AF"
            className="bg-white font-quicksand text-base text-gray-900 border border-gray-200 rounded-xl p-4"
            { ...props }
        />
    </View>
);


const EditBlogScreen = () =>
{
    const { id } = useLocalSearchParams<{ id: string }>();

    const [ title, setTitle ] = useState( '' );
    const [ tags, setTags ] = useState( '' );
    const [ initHtml, setInitHtml ] = useState( '<p>Đang tải nội dung...</p>' ); // Initial placeholder
    const [ newCoverImage, setNewCoverImage ] = useState<ImagePicker.ImagePickerAsset | null>( null );
    const [ existingCoverImageUrl, setExistingCoverImageUrl ] = useState<string | null>( null );

    const [ isFetching, setIsFetching ] = useState( true );
    const [ isUpdating, setIsUpdating ] = useState( false );
    const [ isUploading, setIsUploading ] = useState( false );
    const [ fetchError, setFetchError ] = useState<string | null>( null );
    const _editor = useRef<QuillEditor>( null ) as React.RefObject<QuillEditor>;


    // Tìm nạp dữ liệu bài viết khi component được mount
    useEffect( () =>
    {
        if ( !id )
        {
            setFetchError( "Không tìm thấy ID bài viết." );
            setIsFetching( false );
            return;
        };

        const fetchBlog = async () =>
        {
            try
            {
                setIsFetching( true );
                const data = await blogService.getBlogById( id );
                setTitle( data.title );
                setTags( data.tags.join( ', ' ) );
                if ( data.images && data.images.length > 0 )
                {
                    setExistingCoverImageUrl( data.images[ 0 ].url );
                }

                // ✅ SỬA LỖI TẠI ĐÂY: Cập nhật state HTML trực tiếp
                setInitHtml( data.content );

                setFetchError( null );
            } catch ( err )
            {
                console.error( "Failed to fetch blog details:", err );
                setFetchError( "Không thể tải chi tiết bài viết. Vui lòng thử lại." );
            } finally
            {
                setIsFetching( false );
            }
        };

        fetchBlog();
    }, [ id ] );

    // Xử lý chọn ảnh (giống AddBlogScreen)
    const handlePickImage = async () =>
    {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if ( status !== 'granted' )
        {
            Alert.alert( 'Yêu cầu quyền', 'Bạn cần cấp quyền truy cập thư viện ảnh để chọn ảnh.' );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync( {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [ 16, 9 ],
            quality: 0.8,
        } );

        if ( !result.canceled && result.assets && result.assets.length > 0 )
        {
            setNewCoverImage( result.assets[ 0 ] );
        }
    };

    // Xử lý submit form
    const handleSubmit = async () =>
    {
        const content = await _editor.current.getHtml();

        if ( !title.trim() || !content )
        {
            Alert.alert( 'Lỗi', 'Vui lòng điền đầy đủ tiêu đề và nội dung bài viết.' );
            return;
        }
        if ( !newCoverImage && !existingCoverImageUrl )
        {
            Alert.alert( 'Lỗi', 'Vui lòng chọn ảnh đại diện cho bài viết.' );
            return;
        }

        setIsUpdating( true );
        try
        {
            let coverImageUrl = existingCoverImageUrl;

            if ( newCoverImage )
            {
                console.log( 'Uploading new cover image...' );
                coverImageUrl = await fileService.uploadFromReactNative( newCoverImage );
                console.log( 'New cover image uploaded:', coverImageUrl );
            }

            const blogData: BlogRequest = {
                title: title.trim(),
                content: content,
                tags: tags.split( ',' ).map( tag => tag.trim() ).filter( tag => tag.length > 0 ),
                images: coverImageUrl ? [ { url: coverImageUrl, caption: title.trim() } ] : [],
            };
            console.log( 'Blog data for update:', blogData );

            await blogService.updateBlog( id!, blogData );
            console.log( 'Blog post updated successfully.' );

            Alert.alert( 'Thành công', 'Bài viết đã được cập nhật thành công!' );

            router.back();

        } catch ( error )
        {
            console.error( 'Failed to update blog post:', error );
            Alert.alert( 'Lỗi', 'Không thể cập nhật bài viết. Vui lòng thử lại sau.' );
        } finally
        {
            setIsUpdating( false );
        }
    };

    // Xử lý upload ảnh vào editor (giống AddBlogScreen)
    const handleImageUpload = async () =>
    {
        const result = await ImagePicker.launchImageLibraryAsync( {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        } );

        if ( result.canceled || !result.assets || result.assets.length === 0 ) return;

        const imageAsset = result.assets[ 0 ];
        setIsUploading( true );

        try
        {
            const imageUrl = await fileService.uploadFromReactNative( imageAsset );
            if ( imageUrl )
            {
                const selection = await _editor.current?.getSelection();
                _editor.current?.insertEmbed( selection?.index || 0, 'image', imageUrl );
            } else
            {
                throw new Error( 'URL not found in server response.' );
            }
        } catch ( error )
        {
            console.error( 'Failed to upload image:', error );
            Alert.alert( 'Lỗi', 'Không thể tải ảnh lên. Vui lòng thử lại.' );
        } finally
        {
            setIsUploading( false );
        }
    };
    const handleCustomToolbarAction = ( name: string ) =>
    {
        if ( name === 'image' )
        {
            handleImageUpload();
        }
    };

    // UI cho trạng thái đang tải hoặc lỗi
    if ( isFetching )
    {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text className="mt-4 text-gray-600">Đang tải dữ liệu bài viết...</Text>
            </SafeAreaView>
        );
    }
    if ( fetchError )
    {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-white p-4">
                <Ionicons name="alert-circle-outline" size={ 48 } color="red" />
                <Text className="mt-4 text-red-600 text-center">{ fetchError }</Text>
                <TouchableOpacity onPress={ () => router.back() } className="mt-6 bg-blue-500 rounded-xl py-3 px-6">
                    <Text className="text-white font-quicksand-bold">Quay lại</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
                style={ { flex: 1 } }
            >
                {/* Header */ }
                <View className="flex-row items-center p-4">
                    <TouchableOpacity onPress={ () => router.back() } className="p-1">
                        <Ionicons name="arrow-back" size={ 24 } color="#333" />
                    </TouchableOpacity>
                    <Text className="text-xl font-quicksand-bold text-gray-800 ml-4">Chỉnh sửa bài viết</Text>
                </View>

                <ScrollView contentContainerStyle={ { padding: 16 } } keyboardShouldPersistTaps="handled">
                    {/* Cover Image Picker */ }
                    <TouchableOpacity
                        onPress={ handlePickImage }
                        className="mb-8 h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center"
                    >
                        { newCoverImage ? (
                            <Image source={ { uri: newCoverImage.uri } } className="w-full h-full rounded-2xl" resizeMode="cover" />
                        ) : existingCoverImageUrl ? (
                            <Image source={ { uri: existingCoverImageUrl } } className="w-full h-full rounded-2xl" resizeMode="cover" />
                        ) : (
                            <View className="items-center">
                                <Ionicons name="add-circle-outline" size={ 32 } color="#6B7280" />
                                <Text className="mt-2 text-gray-500 font-quicksand-semibold">Chọn ảnh đại diện mới</Text>
                            </View>
                        ) }
                    </TouchableOpacity>

                    {/* Form Section */ }
                    <Text className="text-xl font-quicksand-bold text-gray-900 mb-4">Bài viết</Text>
                    <FormInput label="Tên bài viết" value={ title } onChangeText={ setTitle } placeholder="Nhập tên bài viết" />
                    <FormInput label="Danh mục" value={ tags } onChangeText={ setTags } placeholder="ví dụ: Chăm sóc da, Mẹo vặt" />

                    {/* Quill Editor */ }
                    <View className="mb-6">
                        <Text className="text-base font-quicksand-semibold text-gray-800 mb-2">
                            Nội dung <Text className="text-red-500">*</Text>
                        </Text>
                        <View style={ styles.editorContainer }>
                            { isUploading && (
                                <View style={ styles.uploadingOverlay }>
                                    <ActivityIndicator size="large" color="#3B82F6" />
                                    <Text style={ { marginTop: 10, color: '#333' } }>Đang tải ảnh lên...</Text>
                                </View>
                            ) }
                            <QuillToolbar
                                editor={ _editor }
                                theme="light"
                                options="full"
                                custom={ { handler: handleCustomToolbarAction, actions: [ 'image' ] } }
                            />
                            <QuillEditor
                                ref={ _editor }
                                style={ styles.editor }
                                initialHtml={ initHtml } // Prop này sẽ nhận đúng giá trị sau khi fetch
                            />
                        </View>
                    </View>

                    {/* Submit Button */ }
                    <TouchableOpacity
                        onPress={ handleSubmit }
                        disabled={ isUpdating }
                        className="bg-blue-500 rounded-xl p-4 items-center justify-center mt-4"
                    >
                        { isUpdating ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className="text-white font-quicksand-bold text-lg">Cập nhật bài viết</Text>
                        ) }
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create( {
    editorContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        overflow: 'hidden',
    },
    editor: {
        height: 300,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        color: '#111827',
    },
    uploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
} );

export default EditBlogScreen;