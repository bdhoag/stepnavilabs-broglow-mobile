import { Image, ScrollView, Text, View } from "react-native";
import { Circle, G, Svg, Text as SvgText } from "react-native-svg";

const pieData = [
  { value: 2, color: "#4F8CFF", label: "Không có vấn đề" },
  { value: 3, color: "#FF5A5F", label: "Chuẩn đoán vấn đề" },
];
const total = 5;
const size = 100;
const strokeWidth = 16;
const radius = (size - strokeWidth) / 2;
const center = size / 2;

function PieChart() {
  let startAngle = 0;
  return (
    <Svg width={size} height={size}>
      <G rotation={-90} origin={`${center},${center}`}>
        {pieData.map((slice, i) => {
          const angle = (slice.value / total) * 360;
          // const endAngle = startAngle + angle;
          // const largeArc = angle > 180 ? 1 : 0;
          // const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
          // const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
          // const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
          // const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
          // const d = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
          const path = (
            <Circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              stroke={slice.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${(angle / 360) * 2 * Math.PI * radius},${
                2 * Math.PI * radius
              }`}
              strokeDashoffset={`-${(startAngle / 360) * 2 * Math.PI * radius}`}
            />
          );
          startAngle += angle;
          return path;
        })}
      </G>
      <SvgText
        x={center}
        y={center + 8}
        fontSize="28"
        fontWeight="bold"
        fill="#222"
        textAnchor="middle"
      >
        {total}
      </SvgText>
    </Svg>
  );
}

export default function ProgressScreen() {
  return (
    <ScrollView className="flex-1 px-3">
      {/* Lịch sử quét da */}
      <View className="bg-white rounded-2xl shadow p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            className="w-36 h-48 rounded-xl mr-4 object-cover"
          />
          <View className="flex-1">
            <View className="mb-1">
              <Text className="text-sm font-semibold text-gray-700">
                Loại da:
              </Text>
              <Text className="text-sm text-gray-500">Dầu</Text>
            </View>
            <View className="mb-1">
              <Text className="text-sm font-semibold text-gray-700">
                Vấn đề da liễu:
              </Text>
              <Text className="text-sm text-gray-500">
                Mụn trứng cá (mụn viêm, mụn đầu đen), lỗ chân lông to
              </Text>
            </View>
            <View className="mb-1">
              <Text className="text-sm font-semibold text-gray-700">
                Độ đàn hồi:
              </Text>
              <Text className="text-sm text-gray-500">
                Da có dấu hiệu chảy xệ
              </Text>
            </View>
            <View className="mb-1">
              <Text className="text-sm font-semibold text-gray-700">
                Màu da:
              </Text>
              <Text className="text-sm text-gray-500">
                Xuất hiện các vùng da có màu
              </Text>
            </View>
          </View>
        </View>
        <Text className="font-semibold text-gray-700 mb-2">Gợi ý sản phẩm</Text>
        <View className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              className="flex-row items-center bg-[#F6FAFF] rounded-lg p-2"
            >
              <Image
                source={{
                  uri: "https://image.hsv-tech.io/1987x0/bbx/common/a93ab2d8-7bf7-4cef-9cf6-bbfb94a5841a.webp",
                }}
                className="w-12 h-12 rounded mr-3 object-cover"
              />
              <View className="flex-1">
                <Text className="font-semibold text-sm text-gray-800">
                  Cleanser ABC
                </Text>
                <Text className="text-xs text-gray-500">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                  sed...
                </Text>
              </View>
            </View>
          ))}
        </View>
        <Text className="text-xs text-gray-400 text-right mt-2">1/5</Text>
      </View>

      {/* Biểu đồ thống kê */}
      <View className="bg-white rounded-2xl shadow p-4 flex-row items-center justify-between">
        <View className="items-center justify-center">
          <PieChart />
        </View>
        <View className="flex-1 ml-4">
          <View className="flex-row items-center mb-2">
            <View className="w-3 h-3 rounded-full bg-[#4F8CFF] mr-2" />
            <Text className="text-sm text-gray-700 flex-1">
              {pieData[0].label}
            </Text>
            <Text className="text-sm font-semibold text-gray-700">
              {pieData[0].value}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <View className="w-3 h-3 rounded-full bg-[#FF5A5F] mr-2" />
            <Text className="text-sm text-gray-700 flex-1">
              {pieData[1].label}
            </Text>
            <Text className="text-sm font-semibold text-gray-700">
              {pieData[1].value}
            </Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-[#222] mr-2" />
            <Text className="text-sm text-gray-700 flex-1">Ảnh đã tải lên</Text>
            <Text className="text-sm font-semibold text-gray-700">{total}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
