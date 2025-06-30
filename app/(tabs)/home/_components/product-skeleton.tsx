// ProductSkeleton.tsx (or add it in the same file if you prefer)
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const ProductSkeleton = () =>
{
    // For the pulsing animation
    const pulseAnim = useRef( new Animated.Value( 1 ) ).current;

    useEffect( () =>
    {
        // Create a looping animation
        Animated.loop(
            Animated.sequence( [
                Animated.timing( pulseAnim, {
                    toValue: 0.6,
                    duration: 800,
                    useNativeDriver: true,
                } ),
                Animated.timing( pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                } ),
            ] ),
        ).start();
    }, [ pulseAnim ] );

    return (
        // Use Animated.View to apply the opacity animation
        <Animated.View style={ { opacity: pulseAnim } } className="w-48 mr-4">
            {/* Image Placeholder */ }
            <View className="w-full bg-gray-200 rounded-3xl aspect-square" />

            <View className="p-2">
                {/* Price Placeholder */ }
                <View className="w-3/4 h-6 mb-2 bg-gray-200 rounded-md" />

                {/* Brand Placeholder */ }
                <View className="w-1/2 h-4 mb-2 bg-gray-200 rounded-md" />

                {/* Name Placeholder (2 lines) */ }
                <View className="w-full h-4 mb-1.5 bg-gray-200 rounded-md" />
                <View className="w-5/6 h-4 mb-2 bg-gray-200 rounded-md" />

                {/* Category Placeholder */ }
                <View className="w-1/3 h-4 bg-gray-200 rounded-md" />
            </View>
        </Animated.View>
    );
};

export default ProductSkeleton;