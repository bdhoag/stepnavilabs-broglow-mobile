// ProductSection.tsx (Updated)
import { Product, productService } from '@/src/services/product.service';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import ProductSkeleton from './product-skeleton';


const ProductSection = () =>
{
    const [ loading, setLoading ] = useState( true );
    const [ error, setError ] = useState<string | null>( null );
    const [ products, setProducts ] = useState<Product[]>( [] );

    const formatPriceRange = useCallback( ( price?: number ) =>
    {
        if ( !price ) return "Liên hệ";
        const minPrice = Math.floor( ( price * 0.8 ) / 1000 ) * 1000;
        const maxPrice = Math.ceil( ( price * 1.2 ) / 1000 ) * 1000;
        return `${ minPrice / 1000 }K - ${ maxPrice / 1000 }K`;
    }, [] );

    const fetchProducts = useCallback( async () =>
    {
        try
        {
            setLoading( true );
            setError( null );
            // Simulate network delay to see the skeleton
            await new Promise( resolve => setTimeout( resolve, 2000 ) );
            const fetchedProducts = await productService.getAllProducts();
            setProducts( fetchedProducts );
        } catch ( err )
        {
            setError( "Không thể tải danh sách sản phẩm" );
            console.error( "Error fetching products:", err );
        } finally
        {
            setLoading( false );
        }
    }, [] );

    useEffect( () =>
    {
        fetchProducts();
    }, [ fetchProducts ] );

    const renderProduct = ( { item }: { item: Product } ) => (
        <TouchableOpacity
            className="w-48 mr-4 overflow-hidden"
            onPress={ () => { /* Handle navigation */ } }
            activeOpacity={ 0.8 }
        >
            <View className="relative rounded-3xl w-full border border-gray-200 aspect-square bg-white p-2 shadow-sm">
                <Image
                    source={ {
                        uri: item.imageUrl || "https://via.placeholder.com/150x150/F5F5F5/999999?text=No+Image",
                    } }
                    className="w-full h-full"
                    style={ { resizeMode: "contain" } }
                    defaultSource={ { uri: "https://via.placeholder.com/150x150/F5F5F5/999999?text=Loading" } }
                />
                { item.shopeeUrl && (
                    <View className="absolute top-2 right-2 bg-orange-500 px-2 py-1 rounded">
                        <Text className="text-white text-xs font-quicksand-bold uppercase">Shopee</Text>
                    </View>
                ) }
            </View>

            <View className="p-2">
                <Text className="text-xl font-quicksand-bold text-orange-500 mb-1.5">{ formatPriceRange( item.price ) }</Text>
                <Text className="text-base font-quicksand-bold text-blue-800 mb-1 uppercase">{ item.brand }</Text>
                <Text
                    className="text-base font-quicksand-medium text-gray-800 leading-snug mb-1.5 min-h-[50px]"
                    numberOfLines={ 2 }
                >{ item.name }</Text>
                { item.categories && item.categories.length > 0 && (
                    <View>
                        <Text className="text-sm text-gray-500 font-quicksand" numberOfLines={ 1 }>{ item.categories.join( ", " ) }</Text>
                    </View>
                ) }
            </View>
        </TouchableOpacity>
    );

    const renderContent = () =>
    {
        if ( loading )
        {
            // --- CHANGE: Render a list of skeletons instead of an ActivityIndicator ---
            return (
                <FlatList
                    data={ [ 1, 2, 3 ] } // A dummy array to render 3 skeleton items
                    renderItem={ () => <ProductSkeleton /> }
                    keyExtractor={ ( item ) => item.toString() }
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                    contentContainerStyle={ { paddingHorizontal: 20, paddingVertical: 4 } }
                />
            );
        }

        if ( error )
        {
            return <Text className="text-center text-red-500 mt-4 px-5">{ error }</Text>;
        }

        if ( !products || products.length === 0 )
        {
            return <Text className="text-center text-gray-500 mt-4 px-5">Không có sản phẩm nào.</Text>;
        }

        return (
            <FlatList
                data={ products }
                renderItem={ renderProduct }
                keyExtractor={ ( item ) => item._id }
                horizontal
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={ { paddingHorizontal: 20, paddingVertical: 4 } }
            />
        );
    };

    return (
        <View className="mb-6">
            <View className="px-5 mb-2 flex-row items-center justify-between">
                <Text className="text-xl font-quicksand-bold text-gray-800">
                    Sản phẩm dưỡng da
                </Text>
                <TouchableOpacity
                    onPress={ () =>
                    {
                        router.navigate( "/product" );
                    } }
                    activeOpacity={ 0.8 }
                >
                    <Text className="text-lg font-quicksand text-[#1584F2]">
                        Xem thêm
                    </Text>
                </TouchableOpacity>
            </View>
            { renderContent() }
        </View>
    );
};

export default ProductSection;