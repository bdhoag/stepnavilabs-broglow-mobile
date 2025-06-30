import { Product, productService } from "@/src/services/product.service";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
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

export default function ProductScreen ()
{
  // State management
  const [ products, setProducts ] = useState<Product[]>( [] );
  const [ filteredProducts, setFilteredProducts ] = useState<Product[]>( [] );
  const [ brands, setBrands ] = useState<string[]>( [] );
  const [ selectedBrand, setSelectedBrand ] = useState<string>( "" );
  const [ favorites, setFavorites ] = useState<string[]>( [] );
  const [ searchQuery, setSearchQuery ] = useState( "" );
  const [ showSearch, setShowSearch ] = useState( false );
  const [ loading, setLoading ] = useState( true );
  const [ refreshing, setRefreshing ] = useState( false );
  const [ error, setError ] = useState<string | null>( null );

  // Fetch products from API
  const fetchProducts = useCallback( async () =>
  {
    try
    {
      setError( null );
      const fetchedProducts = await productService.getAllProducts();
      setProducts( fetchedProducts );

      // Auto-select first brand if no brand is selected
      if ( !selectedBrand && fetchedProducts.length > 0 )
      {
        const firstBrand = fetchedProducts[ 0 ].brand;
        setSelectedBrand( firstBrand );
      }
    } catch ( err )
    {
      setError( "Không thể tải danh sách sản phẩm" );
      console.error( "Error fetching products:", err );
    } finally
    {
      setLoading( false );
    }
  }, [ selectedBrand ] );

  // Fetch available brands
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

  // Filter products based on selected brand and search query
  const filterProducts = useCallback( () =>
  {
    let filtered = products;

    // Filter by brand
    if ( selectedBrand )
    {
      filtered = filtered.filter( ( product ) => product.brand === selectedBrand );
    }

    // Filter by search query
    if ( searchQuery.trim() )
    {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        ( product ) =>
          product.name.toLowerCase().includes( query ) ||
          product.brand.toLowerCase().includes( query ) ||
          product.description?.toLowerCase().includes( query )
      );
    }

    // Only show active products
    filtered = filtered.filter( ( product ) => product.isActive !== false );

    setFilteredProducts( filtered );
  }, [ products, selectedBrand, searchQuery ] );

  // Handle refresh
  const onRefresh = useCallback( async () =>
  {
    setRefreshing( true );
    await Promise.all( [ fetchProducts(), fetchBrands() ] );
    setRefreshing( false );
  }, [ fetchProducts, fetchBrands ] );

  // Handle search
  const handleSearch = useCallback(
    async ( query: string ) =>
    {
      setSearchQuery( query );
      if ( query.trim() )
      {
        try
        {
          const searchResults = await productService.searchProducts( query );
          setFilteredProducts(
            searchResults.filter( ( product ) => product.isActive !== false )
          );
        } catch ( err )
        {
          console.error( "Error searching products:", err );
          // Fallback to local search
          filterProducts();
        }
      } else
      {
        filterProducts();
      }
    },
    [ filterProducts ]
  );

  // Handle brand selection
  const handleBrandSelection = useCallback(
    async ( brand: string ) =>
    {
      setSelectedBrand( brand );
      setSearchQuery( "" ); // Clear search when changing brand

      try
      {
        const brandProducts = await productService.getProductsByBrand( brand );
        setFilteredProducts(
          brandProducts.filter( ( product ) => product.isActive !== false )
        );
      } catch ( err )
      {
        console.error( "Error fetching products by brand:", err );
        // Fallback to local filtering
        filterProducts();
      }
    },
    [ filterProducts ]
  );

  // Toggle favorite
  const toggleFavorite = useCallback( ( productId: string ) =>
  {
    setFavorites( ( prev ) =>
      prev.includes( productId )
        ? prev.filter( ( id ) => id !== productId )
        : [ ...prev, productId ]
    );
  }, [] );

  // Format price
  const formatPrice = useCallback( ( price?: number ) =>
  {
    if ( !price ) return "Liên hệ";
    return new Intl.NumberFormat( "vi-VN", {
      style: "currency",
      currency: "VND",
    } ).format( price );
  }, [] );

  // Effects
  useEffect( () =>
  {
    fetchProducts();
    fetchBrands();
  }, [] );

  useEffect( () =>
  {
    filterProducts();
  }, [ filterProducts ] );

  // Format price range (simplified for display)
  const formatPriceRange = useCallback( ( price?: number ) =>
  {
    if ( !price ) return "Liên hệ";
    // Create a price range for display (similar to the image)
    const minPrice = Math.floor( ( price * 0.8 ) / 1000 ) * 1000;
    const maxPrice = Math.ceil( ( price * 1.2 ) / 1000 ) * 1000;
    return `${ minPrice / 1000 }K - ${ maxPrice / 1000 }K`;
  }, [] );

  // Handle product press to open Shopee link
  const handleProductPress = useCallback( async ( product: Product ) =>
  {
    if ( !product.shopeeUrl )
    {
      Alert.alert( "Thông báo", "Link sản phẩm không có sẵn", [ { text: "OK" } ] );
      return;
    }

    try
    {
      const supported = await Linking.canOpenURL( product.shopeeUrl );
      if ( supported )
      {
        await Linking.openURL( product.shopeeUrl );
      } else
      {
        Alert.alert(
          "Lỗi",
          "Không thể mở link sản phẩm. Vui lòng thử lại sau.",
          [ { text: "OK" } ]
        );
      }
    } catch ( error )
    {
      console.error( "Error opening Shopee URL:", error );
      Alert.alert( "Lỗi", "Có lỗi xảy ra khi mở link. Vui lòng thử lại.", [
        { text: "OK" },
      ] );
    }
  }, [] );

  // Render product item
  const renderProduct = ( { item }: { item: Product } ) => (
    <TouchableOpacity
      className="w-[48%] mb-4 overflow-hidden"
      onPress={ () => handleProductPress( item ) }
      activeOpacity={ 0.7 }
    >
      <View className="relative rounded-3xl w-full border-2 border-gray-100 aspect-square bg-white p-3">
        <Image
          source={ {
            uri:
              item.imageUrl ||
              "https://via.placeholder.com/150x150/F5F5F5/999999?text=No+Image",
          } }
          className="w-full h-full"
          style={ { resizeMode: "cover" } }
          defaultSource={ {
            uri: "https://via.placeholder.com/150x150/F5F5F5/999999?text=Loading",
          } }
        />
        <TouchableOpacity
          onPress={ ( e ) =>
          {
            e.stopPropagation(); // Prevent opening product link
            toggleFavorite( item._id );
          } }
          className="p-2 bg-white rounded-full absolute top-2 left-2"
        >
          <Ionicons
            name={ favorites.includes( item._id ) ? "heart" : "heart-outline" }
            size={ 18 }
            color={ favorites.includes( item._id ) ? "#FF6B6B" : "#CCC" }
          />
        </TouchableOpacity>
        {/* Shopee indicator */ }
        { item.shopeeUrl && (
          <View className="absolute top-2 right-2 bg-orange-600 px-1.5 py-0.5 rounded">
            <Text className="text-white text-xs font-quicksand-semibold uppercase">
              Shopee
            </Text>
          </View>
        ) }
      </View>

      <View className="">
        <View className="flex-row justify-between items-center mb-1.5">
          <Text className="text-xl font-quicksand-bold text-orange-500 flex-1">
            { formatPriceRange( item.price ) }
          </Text>

        </View>

        <Text className="text-sm font-quicksand-semibold text-blue-500 mb-1 uppercase">
          { item.brand }
        </Text>

        <Text
          className="text-sm font-quicksand text-gray-900 leading-3.5 mb-1.5 min-h-[42px]"
          numberOfLines={ 3 }
        >
          { item.name }
        </Text>

        { item.categories && item.categories.length > 0 && (
          <View className="mt-0.5">
            <Text className="text-xs text-gray-400 italic" numberOfLines={ 1 }>
              { item.categories.join( ", " ) }
            </Text>
          </View>
        ) }
      </View>
    </TouchableOpacity>
  );

  // Render loading state
  if ( loading )
  {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#007AFF" />
        <Text className="mt-3 text-base text-gray-600">
          Đang tải sản phẩm...
        </Text>
      </View>
    );
  }

  // Render error state
  if ( error )
  {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Ionicons name="alert-circle-outline" size={ 48 } color="#FF6B6B" />
        <Text className="mt-3 text-base text-red-400 text-center mx-8">
          { error }
        </Text>
        <TouchableOpacity
          className="mt-4 px-6 py-3 bg-blue-500 rounded-lg"
          onPress={ () =>
          {
            setLoading( true );
            fetchProducts();
            fetchBrands();
          } }
        >
          <Text className="text-white text-base font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */ }
      <View className="flex-row justify-between items-center px-4 py-3 bg-white">
        <Text className="text-xl font-quicksand-bold text-gray-800">Sản phẩm</Text>
        <View className="flex-row gap-2">
          <TouchableOpacity
            className="p-2"
            onPress={ () => setShowSearch( !showSearch ) }
          >
            <Ionicons name="search" size={ 22 } color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Ionicons name="options" size={ 22 } color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */ }
      { showSearch && (
        <View className="flex-row items-center bg-white px-4 py-2 border-b border-gray-200">
          <TextInput
            className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-base"
            placeholder="Tìm kiếm sản phẩm..."
            value={ searchQuery }
            onChangeText={ handleSearch }
            autoFocus
          />
          <TouchableOpacity
            className="ml-2 p-2"
            onPress={ () =>
            {
              setShowSearch( false );
              setSearchQuery( "" );
              filterProducts();
            } }
          >
            <Ionicons name="close" size={ 20 } color="#666" />
          </TouchableOpacity>
        </View>
      ) }

      {/* Brand Filter */ }
      { !searchQuery && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={ false }
          className="bg-white"
          contentContainerStyle={ { paddingHorizontal: 16, gap: 12 } }
        >
          { brands.map( ( brand ) => (
            <TouchableOpacity
              key={ brand }
              className={ `px-4 py-2 rounded-full border h-fit ${ selectedBrand === brand
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-blue-500"
                }` }
              onPress={ () => handleBrandSelection( brand ) }
            >
              <Text
                className={ `text-sm font-quicksand-semibold h-7 ${ selectedBrand === brand ? "text-white" : "text-blue-500"
                  }` }
              >
                { brand }
              </Text>
            </TouchableOpacity>
          ) ) }
        </ScrollView>
      ) }

      {/* Product Grid */ }
      <FlatList
        data={ filteredProducts }
        renderItem={ renderProduct }
        keyExtractor={ ( item ) => item._id }
        numColumns={ 2 }
        columnWrapperStyle={ {
          justifyContent: "space-between",
          paddingHorizontal: 4,
        } }
        contentContainerStyle={ { padding: 12, paddingBottom: 20 } }
        showsVerticalScrollIndicator={ false }
        refreshControl={
          <RefreshControl
            refreshing={ refreshing }
            onRefresh={ onRefresh }
            colors={ [ "#007AFF" ] }
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-12">
            <Ionicons name="storefront-outline" size={ 48 } color="#CCC" />
            <Text className="mt-3 text-base text-gray-500 text-center">
              { searchQuery
                ? "Không tìm thấy sản phẩm phù hợp"
                : "Chưa có sản phẩm nào" }
            </Text>
          </View>
        }
      />
    </View>
  );
}
