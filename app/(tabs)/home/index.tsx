import { ScrollView, } from "react-native";
import BlogSection from "./_components/blog-section";
import GeneralFunction from "./_components/general-function";
import ProductSection from "./_components/product-section";


export default function TabsIndex() {
  return (
    <ScrollView className="flex-1 bg-white">
      {/* General Function Section*/}
      <GeneralFunction />
      {/* Blog Section */}
      <BlogSection />
      {/* Product Section */}
      <ProductSection />
    </ScrollView>
  );
}