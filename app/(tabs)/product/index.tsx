/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { Product, productService } from "@/src/services/product.service";
import { Ionicons } from "@expo/vector-icons";
import
{
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import
{
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ProductGridSkeleton } from "./_components/product-skeleton";

const PAGE_LIMIT = 10; // Số lượng sản phẩm trên mỗi trang

const priceRanges = [
  "Dưới 200K",
  "200K - 500K",
  "500K - 1.000K",
  "1.000K - 2.000K",
  "Trên 2.000K",
];

// ++ New helper function to parse price strings
const parsePriceRange = ( range: string ): { min: number; max: number } =>
{
  if ( range.startsWith( "Dưới" ) )
  {
    const value = parseInt( range.replace( /\D/g, '' ) ) * 1000;
    return { min: 0, max: value };
  }
  if ( range.startsWith( "Trên" ) )
  {
    const value = parseInt( range.replace( /\D/g, '' ) ) * 1000;
    return { min: value, max: Infinity };
  }
  const parts = range.replace( /K/g, '000' ).split( ' - ' );
  return {
    min: parseInt( parts[ 0 ].replace( /\./g, '' ) ),
    max: parseInt( parts[ 1 ].replace( /\./g, '' ) )
  };
};


export default function ProductScreen ()
{
  // State management
  const [ products, setProducts ] = useState<Product[]>( [] );
  const [ brands, setBrands ] = useState<string[]>( [] );
  const [ selectedBrand, setSelectedBrand ] = useState<string>( "" );
  const [ favorites, setFavorites ] = useState<string[]>( [] );
  const [ searchQuery, setSearchQuery ] = useState( "" );

  // State cho tải dữ liệu và phân trang
  const [ initialLoading, setInitialLoading ] = useState( true );
  const [ listLoading, setListLoading ] = useState( false );
  const [ refreshing, setRefreshing ] = useState( false );
  const [ loadingMore, setLoadingMore ] = useState( false );
  const [ page, setPage ] = useState( 1 );
  const [ hasMore, setHasMore ] = useState( true );
  const [ error, setError ] = useState<string | null>( null );

  // ++ State cho bộ lọc (chỉ còn giá)
  const [ activeFilters, setActiveFilters ] = useState<{ priceRange: string | null }>( { priceRange: null } );
  const [ tempSelectedPrice, setTempSelectedPrice ] = useState<string | null>( null );

  // Bottom Sheet Ref
  const bottomSheetModalRef = useRef<BottomSheetModal>( null );
  const isInitialMount = useRef( true );

  const snapPoints = useMemo( () => [ '60%' ], [] ); // Adjusted snap point

  const handlePresentModalPress = useCallback( () =>
  {
    setTempSelectedPrice( activeFilters.priceRange );
    bottomSheetModalRef.current?.present();
  }, [ activeFilters ] );

  const handleApplyFilters = useCallback( () =>
  {
    setActiveFilters( {
      priceRange: tempSelectedPrice,
    } );
    bottomSheetModalRef.current?.dismiss();
  }, [ tempSelectedPrice ] );

  const handleResetFilters = () =>
  {
    setTempSelectedPrice( null );
  };

  const fetchBrands = useCallback( async () =>
  {
    try
    {
      const availableBrands = await productService.getAvailableBrands();
      setBrands( availableBrands );
    } catch ( err )
    {
      console.error( "Error fetching brands:", err );
    }
  }, [] );

  // ++ Cập nhật hàm loadProducts - không cần nhận filters nữa
  const loadProducts = useCallback( async (
    pageNum: number,
    brand: string,
    isRefreshOrFilter: boolean = false
  ) =>
  {
    if ( loadingMore || ( isRefreshOrFilter && listLoading ) ) return;

    if ( pageNum > 1 )
    {
      setLoadingMore( true );
    } else if ( isRefreshOrFilter )
    {
      setListLoading( true );
    }

    setError( null );
    try
    {
      const newProducts = brand
        ? await productService.getProductsByBrand( brand, pageNum, PAGE_LIMIT )
        : await productService.getAllProducts( pageNum, PAGE_LIMIT );

      if ( newProducts.length < PAGE_LIMIT )
      {
        setHasMore( false );
      }

      setProducts( ( prevProducts ) =>
        pageNum === 1 ? newProducts : [ ...prevProducts, ...newProducts ]
      );
      setPage( pageNum );

    } catch ( err )
    {
      setError( "Không thể tải danh sách sản phẩm" );
      console.error( "Error fetching products:", err );
    } finally
    {
      setInitialLoading( false );
      setListLoading( false );
      setLoadingMore( false );
      setRefreshing( false );
    }
  }, [ loadingMore, listLoading ] );

  useEffect( () =>
  {
    fetchBrands();
    loadProducts( 1, "" );
  }, [] );

  // ++ Cập nhật useEffect - không theo dõi activeFilters nữa
  useEffect( () =>
  {
    if ( isInitialMount.current )
    {
      isInitialMount.current = false;
      return;
    }
    setProducts( [] );
    setPage( 1 );
    setHasMore( true );
    loadProducts( 1, selectedBrand, true );

  }, [ selectedBrand ] );

  const handleBrandSelection = useCallback( ( brand: string ) =>
  {
    setSearchQuery( "" );
    setSelectedBrand( brand );
  }, [] );

  const onRefresh = useCallback( async () =>
  {
    setRefreshing( true );
    setPage( 1 );
    setHasMore( true );
    await loadProducts( 1, selectedBrand, true );
  }, [ selectedBrand ] );

  const handleLoadMore = useCallback( () =>
  {
    if ( !loadingMore && hasMore && !searchQuery && !activeFilters.priceRange )
    {
      // Don't load more if filters are active, as it might break the filtered view.
      // Alternatively, you could fetch and append, but this is simpler.
      loadProducts( page + 1, selectedBrand );
    }
  }, [ loadingMore, hasMore, page, selectedBrand, searchQuery, activeFilters.priceRange ] );


  // ++ Cập nhật getDisplayProducts để thực hiện filter phía client
  const getDisplayProducts = () =>
  {
    let filteredProducts = products;

    // 1. Filter by price range
    if ( activeFilters.priceRange )
    {
      const { min, max } = parsePriceRange( activeFilters.priceRange );
      filteredProducts = filteredProducts.filter( p => p.price && p.price >= min && p.price <= max );
    }

    // 2. Filter by search query
    if ( searchQuery )
    {
      const query = searchQuery.toLowerCase().trim();
      filteredProducts = filteredProducts.filter(
        ( product ) =>
          product.name.toLowerCase().includes( query ) ||
          product.brand.toLowerCase().includes( query ) ||
          product.description?.toLowerCase().includes( query )
      );
    }
    return filteredProducts;
  };
  const displayedProducts = getDisplayProducts();

  const toggleFavorite = useCallback( ( productId: string ) =>
  {
    setFavorites( ( prev ) =>
      prev.includes( productId )
        ? prev.filter( ( id ) => id !== productId )
        : [ ...prev, productId ]
    );
  }, [] );

  const formatPriceRange = useCallback( ( price?: number ) =>
  {
    if ( !price ) return "Liên hệ";
    const minPrice = Math.floor( ( price * 0.8 ) / 1000 ) * 1000;
    const maxPrice = Math.ceil( ( price * 1.2 ) / 1000 ) * 1000;
    return `${ minPrice / 1000 }K - ${ maxPrice / 1000 }K`;
  }, [] );

  const handleProductPress = useCallback( async ( product: Product ) =>
  {
    if ( !product.shopeeUrl )
    {
      Alert.alert( "Thông báo", "Link sản phẩm không có sẵn" );
      return;
    }
    try
    {
      await Linking.openURL( product.shopeeUrl );
    } catch ( error )
    {
      Alert.alert( "Lỗi", "Không thể mở link sản phẩm." );
    }
  }, [] );

  const renderProduct = ( { item }: { item: Product } ) => (
    <TouchableOpacity
      className="w-[48%] mb-4 overflow-hidden"
      onPress={ () => handleProductPress( item ) }
      activeOpacity={ 0.7 }
    >
      <View className="relative rounded-3xl w-full border-2 border-gray-100 aspect-square bg-white p-3">
        <Image
          source={ { uri: item.imageUrl || "https://via.placeholder.com/150" } }
          className="w-full h-full"
          resizeMode="contain"
        />
        { item.shopeeUrl && (
          <View className="absolute top-4 left-2 bg-orange-500 px-2 py-1 rounded">
            <Text className="text-white text-xs font-quicksand-bold uppercase">Shopee</Text>
          </View>
        ) }
        <TouchableOpacity
          onPress={ ( e ) => { e.stopPropagation(); toggleFavorite( item._id ); } }
          className="p-2 bg-white rounded-full absolute top-2 right-2 shadow-md"
        >
          <Ionicons
            name={ favorites.includes( item._id ) ? "heart" : "heart-outline" }
            size={ 18 }
            color={ favorites.includes( item._id ) ? "#FF6B6B" : "#CCC" }
          />
        </TouchableOpacity>
      </View>
      <View className="mt-2">
        <Text className="text-xl font-quicksand-bold text-orange-500 flex-1">
          { formatPriceRange( item.price ) }
        </Text>
        <Text className="text-sm font-quicksand-semibold text-blue-800 mb-1 uppercase">
          { item.brand }
        </Text>
        <Text
          className="text-base font-quicksand text-gray-800 leading-tight min-h-[42px]"
          numberOfLines={ 2 }
        >
          { item.name }
        </Text>
        { item.categories && item.categories.length > 0 && (
          <View>
            <Text className="text-sm text-gray-500 font-quicksand" numberOfLines={ 1 }>{ item.categories.join( ", " ) }</Text>
          </View>
        ) }
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () =>
  {
    if ( !loadingMore ) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  if ( initialLoading )
  {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const renderContent = () =>
  {
    if ( listLoading )
    {
      return <ProductGridSkeleton count={ 6 } />;
    }

    return (
      <FlatList
        data={ displayedProducts }
        renderItem={ renderProduct }
        keyExtractor={ ( item, index ) => `${ item._id }-${ index }` }
        numColumns={ 2 }
        columnWrapperStyle={ { justifyContent: "space-between", paddingHorizontal: 12 } }
        contentContainerStyle={ { paddingTop: 4, paddingBottom: 20 } }
        showsVerticalScrollIndicator={ false }
        refreshControl={
          <RefreshControl
            refreshing={ refreshing }
            onRefresh={ onRefresh }
            colors={ [ "#007AFF" ] }
          />
        }
        onEndReached={ handleLoadMore }
        onEndReachedThreshold={ 0.5 }
        ListFooterComponent={ renderFooter }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-20">
            <Text className="text-base text-gray-500">Không tìm thấy sản phẩm nào.</Text>
          </View>
        }
      />
    );
  };

  if ( error && !products.length )
  {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center p-8">
        <Ionicons name="alert-circle-outline" size={ 48 } color="#FF6B6B" />
        <Text className="mt-3 text-base text-red-400 text-center">{ error }</Text>
        <TouchableOpacity
          className="mt-4 px-6 py-3 bg-[#1584F2] rounded-lg"
          onPress={ () => loadProducts( 1, selectedBrand ) }
        >
          <Text className="text-white text-base font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <BottomSheetModalProvider>
      <View className="flex-1 bg-white pt-2">
        <View className="px-4 py-2">
          <View className="flex-row items-center bg-gray-100 rounded-2xl px-3">
            <Ionicons name="search" size={ 20 } color="#9CA3AF" style={ { marginRight: 8 } } />
            <TextInput
              className="flex-1 h-16 text-base text-gray-800"
              placeholder="Tìm kiếm"
              placeholderTextColor="#9CA3AF"
              value={ searchQuery }
              onChangeText={ setSearchQuery }
            />
            <TouchableOpacity className="p-1" onPress={ handlePresentModalPress }>
              <Ionicons name="options-outline" size={ 22 } color="#1584F2" />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-xl font-quicksand-bold text-gray-900 px-4 pt-3 pb-4">
          Sản phẩm
        </Text>

        <View className="pb-3">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={ false }
            contentContainerStyle={ { paddingHorizontal: 16, gap: 10 } }
          >
            <TouchableOpacity
              key="all"
              className={ `px-5 py-2 rounded-full border-2 ${ selectedBrand === "" ? "bg-[#1584F2] border-[#1584F2]" : "bg-white border-blue-400" }` }
              onPress={ () => handleBrandSelection( "" ) }
            >
              <Text className={ `text-base font-quicksand-semibold ${ selectedBrand === "" ? "text-white" : "text-[#1584F2]" }` }>
                Tất Cả
              </Text>
            </TouchableOpacity>
            { brands.map( ( brand ) => (
              <TouchableOpacity
                key={ brand }
                className={ `px-5 py-2 rounded-full border-2 ${ selectedBrand === brand ? "bg-[#1584F2] border-[#1584F2]" : "bg-white border-blue-400" }` }
                onPress={ () => handleBrandSelection( brand ) }
              >
                <Text className={ `text-base font-quicksand-semibold ${ selectedBrand === brand ? "text-white" : "text-[#1584F2]" }` }>
                  { brand }
                </Text>
              </TouchableOpacity>
            ) ) }
          </ScrollView>
        </View>

        { renderContent() }
      </View>

      <BottomSheetModal
        ref={ bottomSheetModalRef }
        index={ 0 }
        snapPoints={ snapPoints }
        handleIndicatorStyle={ { backgroundColor: "#E5E7EB", width: 40 } }
        backgroundStyle={ { backgroundColor: '#FFFFFF' } }
      >
        <BottomSheetView className="flex-1 p-6">
          <Text className="text-xl font-quicksand-bold text-center text-gray-900 mb-6">
            Lọc sản phẩm
          </Text>

          { priceRanges.map( ( range ) => (
            <TouchableOpacity
              key={ range }
              className="flex-row items-center justify-between py-3"
              onPress={ () => setTempSelectedPrice( range ) }
              activeOpacity={ 0.7 }
            >
              <Text className="text-base font-quicksand-medium text-gray-700">{ range }</Text>
              <Ionicons
                name={ tempSelectedPrice === range ? "radio-button-on" : "radio-button-off" }
                size={ 24 }
                color={ tempSelectedPrice === range ? "#1584F2" : "#D1D5DB" }
              />
            </TouchableOpacity>
          ) ) }

          <View className="flex-1" />

          <View className="flex-row justify-between items-center pt-4 gap-4">
            <TouchableOpacity
              className="flex-1 bg-gray-100 rounded-full py-4"
              onPress={ handleResetFilters }
            >
              <Text className="text-center text-base font-quicksand-bold text-gray-700">Đặt lại</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#1584F2] rounded-full py-4"
              onPress={ handleApplyFilters }
            >
              <Text className="text-center text-base font-quicksand-bold text-white">Áp dụng</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}