import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const brands = [
  { label: "LA ROCHE-POSAY" },
  { label: "CeraVe" },
  { label: "L'OREAL" },
  { label: "BIODERMA" },
];

const products = [
  {
    id: 1,
    name: "Sample CeraVe Sữa Rửa Mặt Kem Dưỡng Ẩm, Serum Dưỡng Ẩm CeraVe Loai 1 5ml 7ml",
    brand: "CeraVe",
    price: "10K - 20K",
    image: "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=CeraVe",
    favorite: true,
  },
  {
    id: 2,
    name: "Sample bioderma các dòng dưỡng ẩm, kem phục hồi da trắng, siêu trắng của hãng",
    brand: "Bioderma",
    price: "20K - 25K",
    image: "https://via.placeholder.com/150x150/FF9500/FFFFFF?text=Bioderma",
    favorite: false,
  },
  {
    id: 3,
    name: "Sample kem chống nắng Anessa 4ml",
    brand: "Anessa",
    price: "20K - 25K",
    image: "https://via.placeholder.com/150x150/34C759/FFFFFF?text=Anessa",
    favorite: true,
  },
  {
    id: 4,
    name: "Mặt nạ/ sample La Roche Posay",
    brand: "La Roche Posay",
    price: "24K - 45K",
    image: "https://via.placeholder.com/150x150/007AFF/FFFFFF?text=LRP",
    favorite: false,
  },
  {
    id: 5,
    name: "Kem Chống Nắng La Roche-Posay Phổ Rộng, Nhẹ Thoáng Kiềm Dầu 50ml",
    brand: "CeraVe",
    price: "15K - 30K",
    image: "https://via.placeholder.com/150x150/4A90E2/FFFFFF?text=CeraVe+2",
    favorite: false,
  },
  {
    id: 6,
    name: "Nước Tẩy Trang Bioderma Dành Cho Da Nhạy Cảm 500ml",
    brand: "Bioderma",
    price: "18K - 28K",
    image: "https://via.placeholder.com/150x150/FF9500/FFFFFF?text=Bio+2",
    favorite: true,
  },
];

export default function ProductScreen() {
  const [selectedBrand, setSelectedBrand] = useState("CeraVe");
  const [favorites, setFavorites] = useState<number[]>([1, 3, 6]);

  const filteredProducts = products.filter((p) => p.brand === selectedBrand);

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const renderProduct = ({ item }: { item: (typeof products)[0] }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>{item.price}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Ionicons
            name={favorites.includes(item.id) ? "heart" : "heart-outline"}
            size={20}
            color={favorites.includes(item.id) ? "#FF6B6B" : "#999"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.brandText}>{item.brand}</Text>
      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sản phẩm</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={22} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="options" size={22} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Brand Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.brandFilter}
        contentContainerStyle={styles.brandFilterContent}
      >
        {brands.map((brand) => (
          <TouchableOpacity
            key={brand.label}
            style={[
              styles.brandChip,
              selectedBrand === brand.label && styles.brandChipActive,
            ]}
            onPress={() => setSelectedBrand(brand.label)}
          >
            <Text
              style={[
                styles.brandChipText,
                selectedBrand === brand.label && styles.brandChipTextActive,
              ]}
            >
              {brand.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productGrid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  brandFilter: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
  },
  brandFilterContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F3F4",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  brandChipActive: {
    backgroundColor: "#E3F2FD",
    borderColor: "#2196F3",
  },
  brandChipText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
  },
  brandChipTextActive: {
    color: "#2196F3",
  },
  productGrid: {
    padding: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  productImage: {
    width: "100%",
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FF6B6B",
  },
  brandText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  productName: {
    fontSize: 12,
    color: "#333",
    lineHeight: 16,
  },
});
