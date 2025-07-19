import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
// import { LinearGradient } from 'expo-linear-gradient';
import CrownIcon from "@/src/components/svg/crown-icon";
import DefineIcon from "@/src/components/svg/define-icon";
import DiscoverIcon from "@/src/components/svg/discover-icon";
import RecommendIcon from "@/src/components/svg/recommend-icon";
import { LinearGradient } from 'expo-linear-gradient';

type Route =
    | "/home/skin-profile"
    | "/home/skincare-routine"
    | "/home/explore"
    | "/home/subscription";

const GeneralFunction = () =>
{
    const options = [
        {
            title: "Xác Định Hồ Sơ Da Của Bạn",
            description: "Xác Định Hồ Sơ Da Của Bạn",
            icon: DefineIcon,
            buttonText: "Xác định",
            gradientColors: [ "#02AAEB", "#1584F2" ],
            route: "/home/skin-profile" as Route,
        },
        {
            title: "Gợi Ý Chu Trình Chăm Sóc Da",
            description: "Gợi Ý Chu Trình Chăm Sóc Da",
            icon: RecommendIcon,
            buttonText: "Gợi ý",
            gradientColors: [ "#56E0E0", "#12B2B3" ],
            route: "/home/skincare-routine" as Route,
        },
        {
            title: "Khám Phá Bài Viết Chăm Sóc",
            description: "Khám Phá Bài Viết Chăm Sóc Da",
            icon: DiscoverIcon,
            buttonText: "Khám phá",
            gradientColors: [ "#FFDA7B", "#FFB800" ],
            route: "/home/blog" as Route,
        },
        {
            title: "Khám phá gói Đăng Ký Của Bạn",
            description: "Khám phá gói Đăng Ký Của Bạn",
            icon: CrownIcon,
            buttonText: "Xem",
            gradientColors: [ "#FF5E7CE5", "#FF1843E5" ],
            route: "/home/subscription" as Route,
        },
    ];

    const optionPairs = [];
    for ( let i = 0; i < options.length; i += 2 )
    {
        optionPairs.push( options.slice( i, i + 2 ) );
    }
    return (
        <View className="mb-6">
            <View className="px-5 pb-2">
                <Text className="text-xl font-quicksand-bold text-gray-900 mb-2 ">
                    Chức năng chính
                </Text>
            </View>

            <View className="mx-6 p-2 rounded-3xl border border-[#EEEEEE]">
                { optionPairs.map( ( pair, pairIndex ) => (
                    <View key={ pairIndex } className="flex-row gap-3 mb-3">
                        { pair.map( ( option, index ) => (
                            <View key={ index } className="flex-1">
                                <Pressable
                                    className="rounded-3xl overflow-hidden"
                                    onPress={ () => router.push( option.route ) }
                                >
                                    <LinearGradient
                                        colors={ option.gradientColors as any }
                                        style={ { minHeight: 160 } }
                                    >
                                        <View className={ "flex-1 p-3 justify-between" }>
                                            <View className="flex-1 mb-4">
                                                <Text className="text-white text-lg font-quicksand-bold mb-2 leading-6">
                                                    { option.title }
                                                </Text>
                                                <Text className="text-white text-sm leading-5 font-quicksand-light">
                                                    { option.description }
                                                </Text>
                                            </View>

                                            <View className="flex-row items-center justify-between">
                                                <View className="flex-row items-center">
                                                    <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-3">
                                                        <option.icon />
                                                    </View>

                                                    <Text className="text-white font-quicksand-medium text-base">
                                                        { option.buttonText }
                                                    </Text>
                                                </View>

                                                <View className="w-8 h-8 items-center justify-center">
                                                    <Feather
                                                        name="arrow-right"
                                                        size={ 18 }
                                                        color="white"
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </LinearGradient>
                                </Pressable>
                            </View>
                        ) ) }
                    </View>
                ) ) }
            </View>
        </View>
    )
}

export default GeneralFunction