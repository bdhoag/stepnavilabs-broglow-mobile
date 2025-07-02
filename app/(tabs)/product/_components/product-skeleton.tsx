import React from 'react';
import { View } from 'react-native';

const ProductSkeletonItem = () => (
    <View className="w-[48%] mb-6">
        {/* Image Placeholder */ }
        <View className="w-full aspect-square bg-gray-200 rounded-2xl" />
        <View className="mt-2.5 space-y-2">
            <View className="h-6 w-3/4 bg-gray-200 rounded" />
            <View className="h-4 w-1/3 bg-gray-200 rounded" />
            <View className="h-5 w-full bg-gray-200 rounded" />
            <View className="h-5 w-5/6 bg-gray-200 rounded" />
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