import { useState } from "react";
import { Text, View } from "react-native";

const brands = [
  { label: "LA ROCHE-POSAY" },
  { label: "CeraVe" },
  { label: "L'OREAL" },
  { label: "BIODERMA" },
];

const products = [
  {
    id: 1,
    name: "Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml",
    brand: "CeraVe",
    price: "350K - 500K",
    image: require("../../../assets/images/product-dummy.png"),
    desc: "Sữa Rửa Mặt CeraVe Sạch Sâu Cho Da Thường Đến Da Dầu 473ml",
    logo: require("../../../assets/images/product-dummy.png"),
    favorite: true,
  },
  {
    id: 2,
    name: "Nước Tẩy Trang Bioderma Dành Cho Da Nhạy Cảm 500ml",
    brand: "Bioderma",
    price: "300K - 550K",
    image: require("../../../assets/images/product-dummy.png"),
    desc: "Nước Tẩy Trang Bioderma Dành Cho Da Nhạy Cảm 500ml",
    logo: require("../../../assets/images/product-dummy.png"),
    favorite: false,
  },
  {
    id: 3,
    name: "Kem Chống Nắng La Roche-Posay Phổ Rộng, Nhẹ Thoáng Kiềm Dầu 50ml",
    brand: "La Roche-Posay",
    price: "450K - 600K",
    image: require("../../../assets/images/product-dummy.png"),
    desc: "Kem Chống Nắng La Roche-Posay Phổ Rộng, Nhẹ Thoáng Kiềm Dầu 50ml",
    logo: require("../../../assets/images/product-dummy.png"),
    favorite: false,
  },
  {
    id: 4,
    name: "Nước Tẩy Trang L'Oreal Tươi Mát Cho Da Dầu, Hỗn Hợp 400ml",
    brand: "L'OREAL",
    price: "150K - 250K",
    image: require("../../../assets/images/product-dummy.png"),
    desc: "Nước Tẩy Trang L'Oreal Tươi Mát Cho Da Dầu, Hỗn Hợp 400ml",
    logo: require("../../../assets/images/product-dummy.png"),
    favorite: false,
  },
];

export default function ProductScreen() {
  const [selectedBrand, setSelectedBrand] = useState("CeraVe");
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter(
    (p) =>
      p.brand === selectedBrand &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View>
      <Text>Coming Soon</Text>
    </View>
  );
  // return (
  //   <View className="flex-1 bg-[#F3F8FE] px-2 pt-2">
  //     <View className="flex-row items-center justify-between mb-2">
  //       <Text className="text-xl font-bold text-[#222]">Sản phẩm</Text>
  //       <View className="flex-row gap-2">
  //         <TouchableOpacity className="p-2">
  //           <Search size={22} color="#1584F2" />
  //         </TouchableOpacity>
  //         <TouchableOpacity className="p-2">
  //           <Filter size={22} color="#1584F2" />
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //     <ScrollView
  //       horizontal
  //       showsHorizontalScrollIndicator={false}
  //       className="mb-3"
  //     >
  //       {brands.map((b) => (
  //         <TouchableOpacity
  //           key={b.label}
  //           onPress={() => setSelectedBrand(b.label)}
  //           className={`px-5 py-2 rounded-xl mr-3 border ${
  //             selectedBrand === b.label
  //               ? "bg-[#EAF6FD] border-[#02AAEB]"
  //               : "bg-white border-[#E0E0E0]"
  //           }`}
  //         >
  //           <Text
  //             className={`font-semibold ${
  //               selectedBrand === b.label ? "text-[#02AAEB]" : "text-[#222]"
  //             }`}
  //           >
  //             {b.label}
  //           </Text>
  //         </TouchableOpacity>
  //       ))}
  //     </ScrollView>
  //     <FlatList
  //       data={filteredProducts}
  //       keyExtractor={(item) => item.id.toString()}
  //       numColumns={2}
  //       columnWrapperStyle={{ gap: 12 }}
  //       contentContainerStyle={{ paddingBottom: 16 }}
  //       renderItem={({ item }) => (
  //         <View className="flex-1 bg-white rounded-2xl mb-4 p-2 shadow-sm">
  //           <View className="flex-row items-center justify-between mb-1">
  //             <Image
  //               source={item.logo}
  //               className="w-16 h-6"
  //               resizeMode="contain"
  //             />
  //             <Text className="text-[10px] text-[#1584F2] font-bold">
  //               PHẨM ĐỘC CHÍNH HÃNG
  //             </Text>
  //           </View>
  //           <Image
  //             source={item.image}
  //             className="w-full h-32 mb-2"
  //             resizeMode="contain"
  //           />
  //           <Text className="text-[#F75555] font-bold text-base mb-1">
  //             {item.price}
  //           </Text>
  //           <Text className="text-[#1584F2] font-semibold text-sm mb-1">
  //             {item.brand}
  //           </Text>
  //           <Text className="text-xs text-[#222] mb-2" numberOfLines={2}>
  //             {item.desc}
  //           </Text>
  //           <TouchableOpacity className="absolute right-3 bottom-3">
  //             <Heart
  //               size={20}
  //               color={item.favorite ? "#F75555" : "#E0E0E0"}
  //               fill={item.favorite ? "#F75555" : "none"}
  //             />
  //           </TouchableOpacity>
  //         </View>
  //       )}
  //     />
  //   </View>
  // );
}
