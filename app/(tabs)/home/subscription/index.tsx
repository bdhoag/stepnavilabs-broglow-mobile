// import { Ionicons } from '@expo/vector-icons'
// import { useRouter } from 'expo-router'
// import React from 'react'
// import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import FreeSubscription from './components/FreeSubscription'
// import ProSubscription from './components/ProSubscription'

// const Subscription = () => {
//   const router = useRouter();

//   const handleBack = () => {
//     router.back();
//   };


//   return (
//     <View className="flex-1 px-4">
//       <Text className="text-lg font-semibold text-[#222] mb-4">
//         Gói đăng ký của bạn
//       </Text>
//       <View className="bg-white rounded-2xl shadow p-0.5">
//         {!showPaid && (
//           <View className="bg-[#02AAEB] rounded-2xl py-4 items-center">
//             <Text className="text-xl font-bold text-white">
//               {showPaid ? "Trả phí" : "Miễn Phí"}
//             </Text>
//           </View>
//         )}

//         <View className="px-10 py-5 mx-auto">
//           {showPaid
//             ? paidFeatures.map((f, idx) => (
//                 <View
//                   key={f.label}
//                   className={`flex-row items-center ${
//                     idx !== paidFeatures.length - 1 ? "mb-5" : ""
//                   }`}
//                 >
//                   <Feather name="check" size={18} color="#3DC47E" />
//                   <Text className="ml-4 text-lg text-[#222]">{f.label}</Text>
//                 </View>
//               ))
//             : freeFeatures.map((f, idx) => (
//                 <View
//                   key={f.label}
//                   className={`flex-row items-center ${
//                     idx !== freeFeatures.length - 1 ? "mb-5" : ""
//                   }`}
//                 >
//                   {f.included ? (
//                     <Feather name="check" size={18} color="#3DC47E" />
//                   ) : (
//                     <Feather name="x" size={18} color="#F75555" />
//                   )}
//                   <Text
//                     className={`ml-4 text-lg ${
//                       f.included ? "text-[#222]" : "text-[#B0B0B0]"
//                     }`}
//                   >
//                     {f.label}
//                   </Text>
//                 </View>
//               ))}
//         </View>
//         {showPaid && (
//           <View className="px-5 pb-5">
//             {prices.map((p) => (
//               <TouchableOpacity
//                 key={p.value}
//                 onPress={() => setSelected(p.value)}
//                 className={`border rounded-xl py-2 mb-3 items-center ${
//                   selected === p.value
//                     ? "border-[#02AAEB] bg-[#EAF6FD]"
//                     : "border-[#B0D9F6] bg-white"
//                 }`}
//               >
//                 <Text
//                   className={`font-bold text-lg ${
//                     selected === p.value ? "text-[#02AAEB]" : "text-[#1584F2]"
//                   }`}
//                 >
//                   {p.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}
//       </View>
//       {showPaid ? (
//         <TouchableOpacity className="mt-6 bg-[#6EC1F6] rounded-xl py-3 items-center">
//           <Text className="text-lg font-bold text-white">Xác Nhận</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity
//           className="mt-6 bg-[#02AAEB] rounded-xl py-3 items-center"
//           onPress={() => setShowPaid(true)}
//         >
//           <Text className="text-lg font-bold text-white">Nâng Cấp</Text>
//     <SafeAreaView style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity onPress={handleBack} style={styles.backButton}>
//           <Ionicons name="arrow-back" size={20} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>
//           Xác định hồ sơ da
//         </Text>
//       </View>

//       {/* Content */}
//       <ScrollView style={styles.mainContentContainer}>
//         <FreeSubscription 
//           featureAvailable={[
//             'Scan da mặt',
//             'Phân tích da bằng AI',
//             'Lưu lại quá trình mỗi lần scan da',
//             'Xác định hồ sơ da',
//             'Tham gia cộng đồng chăm sóc da',
//             'Gợi ý sử dụng sản phẩm bằng AI',
//             'Gợi ý chu trình chăm sóc da'
//           ]}
//           featureUnavailable={[
//             'Tư vấn với chuyên gia',
//           ]}
//         />
//         <ProSubscription
//           featureAvailable={[
//             'Scan da mặt',
//             'Phân tích da bằng AI',
//             'Lưu lại quá trình mỗi lần scan da',
//             'Xác định hồ sơ da',
//             'Tham gia cộng đồng chăm sóc da',
//             'Gợi ý sử dụng sản phẩm bằng AI (không giới hạn)',
//             'Gợi ý chu trình chăm sóc da (không giới hạn)',
//             'Tư vấn với chuyên gia',
//           ]}
//           featureUnavailable={[]}
//         />
//       </ScrollView>

//     </SafeAreaView>
//   )
// }

// export default Subscription

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//   },
//   backButton: {
//     marginRight: 12,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#1f2937',
//   },
//   mainContentContainer: {
//     flex: 1,
//     paddingHorizontal: 16,
//     paddingTop: 16, 
//   },
// })

// // import { Feather } from "@expo/vector-icons";
// // import { useState } from "react";
// // import { Text, TouchableOpacity, View } from "react-native";

// // const freeFeatures = [
// //   { label: "Scan da mặt", included: true },
// //   { label: "Phân tích da bằng AI", included: true },
// //   { label: "Lưu lại quá trình mỗi lần scan da", included: true },
// //   { label: "Xác định hồ sơ da", included: true },
// //   { label: "Tham gia cộng đồng chăm sóc da", included: true },
// //   { label: "Gợi ý sử dụng sản phẩm bằng AI", included: false },
// //   { label: "Tư vấn với chuyên gia", included: false },
// //   { label: "Gợi ý chu trình chăm sóc da", included: false },
// // ];

// // const paidFeatures = [
// //   { label: "Scan da mặt" },
// //   { label: "Phân tích da bằng AI" },
// //   { label: "Lưu lại quá trình mỗi lần scan da" },
// //   { label: "Xác định hồ sơ da" },
// //   { label: "Tham gia cộng đồng chăm sóc da" },
// //   { label: "Gợi ý sử dụng sản phẩm bằng AI" },
// //   { label: "Tư vấn với chuyên gia" },
// //   { label: "Gợi ý chu trình chăm sóc da" },
// // ];

// // const prices = [
// //   { label: "127.000đ/tuần", value: "week" },
// //   { label: "255.000đ/tháng", value: "month" },
// //   { label: "1.276.000đ/năm", value: "year" },
// // ];

// // export default function Subscription() {
// //   const [showPaid, setShowPaid] = useState(false);
// //   const [selected, setSelected] = useState("week");

// //   return (
// //     <View className="flex-1 px-4">
// //       <Text className="text-lg font-semibold text-[#222] mb-4">
// //         Gói đăng ký của bạn
// //       </Text>
// //       <View className="bg-white rounded-2xl shadow p-0.5">
// //         {!showPaid && (
// //           <View className="bg-[#02AAEB] rounded-2xl py-4 items-center">
// //             <Text className="text-xl font-bold text-white">
// //               {showPaid ? "Trả phí" : "Miễn Phí"}
// //             </Text>
// //           </View>
// //         )}

// //         <View className="px-10 py-5 mx-auto">
// //           {showPaid
// //             ? paidFeatures.map((f, idx) => (
// //                 <View
// //                   key={f.label}
// //                   className={`flex-row items-center ${
// //                     idx !== paidFeatures.length - 1 ? "mb-5" : ""
// //                   }`}
// //                 >
// //                   <Feather name="check" size={18} color="#3DC47E" />
// //                   <Text className="ml-4 text-lg text-[#222]">{f.label}</Text>
// //                 </View>
// //               ))
// //             : freeFeatures.map((f, idx) => (
// //                 <View
// //                   key={f.label}
// //                   className={`flex-row items-center ${
// //                     idx !== freeFeatures.length - 1 ? "mb-5" : ""
// //                   }`}
// //                 >
// //                   {f.included ? (
// //                     <Feather name="check" size={18} color="#3DC47E" />
// //                   ) : (
// //                     <Feather name="x" size={18} color="#F75555" />
// //                   )}
// //                   <Text
// //                     className={`ml-4 text-lg ${
// //                       f.included ? "text-[#222]" : "text-[#B0B0B0]"
// //                     }`}
// //                   >
// //                     {f.label}
// //                   </Text>
// //                 </View>
// //               ))}
// //         </View>
// //         {showPaid && (
// //           <View className="px-5 pb-5">
// //             {prices.map((p) => (
// //               <TouchableOpacity
// //                 key={p.value}
// //                 onPress={() => setSelected(p.value)}
// //                 className={`border rounded-xl py-2 mb-3 items-center ${
// //                   selected === p.value
// //                     ? "border-[#02AAEB] bg-[#EAF6FD]"
// //                     : "border-[#B0D9F6] bg-white"
// //                 }`}
// //               >
// //                 <Text
// //                   className={`font-bold text-lg ${
// //                     selected === p.value ? "text-[#02AAEB]" : "text-[#1584F2]"
// //                   }`}
// //                 >
// //                   {p.label}
// //                 </Text>
// //               </TouchableOpacity>
// //             ))}
// //           </View>
// //         )}
// //       </View>
// //       {showPaid ? (
// //         <TouchableOpacity className="mt-6 bg-[#6EC1F6] rounded-xl py-3 items-center">
// //           <Text className="text-lg font-bold text-white">Xác Nhận</Text>
// //         </TouchableOpacity>
// //       ) : (
// //         <TouchableOpacity
// //           className="mt-6 bg-[#02AAEB] rounded-xl py-3 items-center"
// //           onPress={() => setShowPaid(true)}
// //         >
// //           <Text className="text-lg font-bold text-white">Nâng Cấp</Text>
// //         </TouchableOpacity>
// //       )}
// //     </View>
// //   );
// // }

