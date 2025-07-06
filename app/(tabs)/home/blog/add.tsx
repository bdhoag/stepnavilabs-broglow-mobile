
import { BlogRequest, blogService } from '@/src/services/blog.service';
import { fileService } from '@/src/services/file.service';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
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
    View
} from 'react-native';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { SafeAreaView } from 'react-native-safe-area-context';


// Reusable Labeled Input Component (no changes)
const FormInput = ( { label, value, onChangeText, placeholder, ...props }: { label: string, value: string, onChangeText: ( text: string ) => void, placeholder: string, [ key: string ]: any } ) => (
    <View className="mb-6">
        <Text className="text-base font-semibold text-gray-800 mb-2">{ label }<Text className="text-red-500">*</Text></Text>
        <TextInput
            value={ value }
            onChangeText={ onChangeText }
            placeholder={ placeholder }
            placeholderTextColor="#9CA3AF"
            className="bg-white text-base text-gray-900 border border-gray-200 rounded-xl p-4"
            { ...props }
        />
    </View>
);


const AddBlogScreen = () =>
{
    const [ title, setTitle ] = useState( '' );
    const [ tags, setTags ] = useState( '' );
    const [ coverImage, setCoverImage ] = useState<ImagePicker.ImagePickerAsset | null>( null );
    const [ isLoading, setIsLoading ] = useState( false );
    const [ isUploading, setIsUploading ] = useState( false );
    const _editor = useRef<QuillEditor>( null ) as React.RefObject<QuillEditor>;

    // handlePickImage and handleSubmit logic remains the same
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
            setCoverImage( result.assets[ 0 ] );
        }
    };

    const handleSubmit = async () =>
    {
        // const content = editor?.getHTML() || '';
        console.log( 'Editor content:', await _editor.current.getHtml() );

        if ( !title.trim() )
        {
            Alert.alert( 'Lỗi', 'Vui lòng nhập tên bài viết.' );
            return;
        }
        if ( !coverImage )
        {
            Alert.alert( 'Lỗi', 'Vui lòng chọn ảnh đại diện cho bài viết.' );
            return;
        }
        if ( !await _editor.current.getHtml() )
        {
            Alert.alert( 'Lỗi', 'Vui lòng nhập nội dung bài viết.' );
            return;
        }

        setIsLoading( true );
        try
        {
            // 1. Upload cover image
            console.log( 'Uploading cover image...' );
            const coverImageUrl = await fileService.uploadFromReactNative( coverImage );
            console.log( 'Cover image uploaded:', coverImageUrl );

            // 2. Prepare blog data
            const blogData: BlogRequest = {
                title: title.trim(),
                content: await _editor.current.getHtml() || '',
                tags: tags.split( ',' ).map( tag => tag.trim() ).filter( tag => tag.length > 0 ),
                images: coverImageUrl ? [ { url: coverImageUrl, caption: '' } ] : [],
            }
            console.log( 'Blog data prepared:', blogData );
            // 3. Call your blog service to create the post
            await blogService.createBlog( blogData );
            console.log( 'Blog post created successfully.' );
            Alert.alert( 'Thành công', 'Bài viết đã được đăng thành công!' );
            // 4. Navigate back to the blog list
            router.back();
        } catch ( error )
        {
            console.error( 'Failed to create blog post:', error );
            Alert.alert( 'Lỗi', 'Không thể đăng bài viết. Vui lòng thử lại sau.' );
        } finally
        {
            setIsLoading( false );
        }

    };

    const handleImageUpload = async () =>
    {
        // 1. Pick an image
        const result = await ImagePicker.launchImageLibraryAsync( {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        } );

        if ( result.canceled || !result.assets || result.assets.length === 0 )
        {
            return; // User cancelled the picker
        }

        const imageAsset = result.assets[ 0 ];
        console.log( 'Selected image:', imageAsset.file! );
        setIsUploading( true );

        try
        {
            // 2. Upload using your service
            console.log( 'Uploading with FileService...' );
            const imageUrl = await fileService.uploadFromReactNative( imageAsset );
            console.log( 'Upload successful:', imageUrl );

            // 3. Insert the returned URL into the editor
            if ( imageUrl )
            {
                const selection = await _editor.current?.getSelection();
                const cursorIndex = selection?.index || 0;
                _editor.current?.insertEmbed( cursorIndex, 'image', imageUrl );
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

    // const ToolbarButton = ( { name, action, checkActive }: { name: keyof typeof Ionicons.glyphMap, action: () => void, checkActive: () => boolean | undefined } ) => (
    //     <TouchableOpacity onPress={ action } className="p-2">
    //         <Ionicons name={ name } size={ 22 } color={ checkActive() ? '#3B82F6' : '#333' } />
    //     </TouchableOpacity>
    // );
    const handleCustomToolbarAction = ( name: string ) =>
    {
        switch ( name )
        {
            case 'image':
                handleImageUpload();
                break;
            default:
                console.warn( `Unhandled custom toolbar action: ${ name }` );
        }
    };
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
                    <Text className="text-xl font-bold text-gray-800 ml-4">Viết bài viết mới</Text>
                </View>

                <ScrollView contentContainerStyle={ { padding: 16 } } keyboardShouldPersistTaps="handled">
                    {/* Cover Image Picker */ }
                    <TouchableOpacity
                        onPress={ handlePickImage }
                        className="mb-8 h-48 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 items-center justify-center"
                    >
                        { coverImage ? (
                            <Image source={ { uri: coverImage.uri } } className="w-full h-full rounded-2xl" resizeMode="cover" />
                        ) : (
                            <View className="items-center">
                                <Ionicons name="add-circle-outline" size={ 32 } color="#6B7280" />
                                <Text className="mt-2 text-gray-500 font-semibold">Thêm ảnh đại diện bài viết</Text>
                            </View>
                        ) }
                    </TouchableOpacity>

                    {/* Form Section */ }
                    <Text className="text-xl font-bold text-gray-900 mb-4">Bài viết</Text>

                    <FormInput
                        label="Tên bài viết"
                        value={ title }
                        onChangeText={ setTitle }
                        placeholder="Nhập tên bài viết"
                    />

                    <FormInput
                        label="Danh mục"
                        value={ tags }
                        onChangeText={ setTags }
                        placeholder="ví dụ: Chăm sóc da, Mẹo vặt"
                    />
                    {/* Quill Editor */ }

                    <View className="mb-6">
                        <Text className="text-base font-semibold text-gray-800 mb-2">
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
                                // --- THIS IS THE CORRECT STRUCTURE FOR THE `custom` PROP ---
                                custom={ {
                                    // 1. The single handler function
                                    handler: handleCustomToolbarAction,
                                    // 2. List of actions that trigger the handler
                                    actions: [ 'image' ],
                                } }
                            />
                            <QuillEditor
                                ref={ _editor }
                                style={ styles.editor }

                            // initialHtml="<p>Bắt đầu viết ở đây...</p>"
                            />
                        </View>
                    </View>


                    {/* Submit Button */ }
                    <TouchableOpacity
                        onPress={ handleSubmit }
                        disabled={ isLoading }
                        className="bg-blue-500 rounded-xl p-4 items-center justify-center mt-4"
                    >
                        { isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text className="text-white font-bold text-lg">Đăng bài viết</Text>
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
        borderColor: '#E5E7EB', // border-gray-200
        borderRadius: 12,       // rounded-xl
        overflow: 'hidden',
    },
    editor: {
        height: 300,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        color: '#111827', // text-gray-900
    },
    toolbarIcon: {
        // Adjust custom icon position to align with default icons
        marginLeft: 2,
        marginRight: 10,
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
        zIndex: 10, // Make sure it's on top of the editor but below the toolbar
    },
} );

export default AddBlogScreen;