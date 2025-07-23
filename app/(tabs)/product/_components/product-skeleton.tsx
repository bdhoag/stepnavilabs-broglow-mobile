import React from 'react';
import { View } from 'react-native';

const ProductSkeletonItem = () => (
    <View className="w-[48%] mb-6">
        {/* Image Placeholder */ }
        <View className="w-full bg-gray-200 aspect-square rounded-2xl" />
        <View className="mt-2.5 space-y-2">
            <View className="w-3/4 h-6 bg-gray-200 rounded" />
            <View className="w-1/3 h-4 bg-gray-200 rounded" />
            <View className="w-full h-5 bg-gray-200 rounded" />
            <View className="w-5/6 h-5 bg-gray-200 rounded" />
        </View>
    </View>
);
export const ProductGridSkeleton = ( { count = 6 }: { count?: number } ) => (
    <View className="flex-row flex-wrap justify-between px-4 pt-4">
        { [ ...Array( count ) ].map( ( _, index ) => (
            <ProductSkeletonItem key={ index } />
        ) ) }
    </View>
);