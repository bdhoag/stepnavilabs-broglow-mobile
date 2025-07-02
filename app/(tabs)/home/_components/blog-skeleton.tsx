import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const CARD_WIDTH = 288;

const BlogCardSkeleton = () =>
{
    const shimmerAnimation = useRef( new Animated.Value( 0 ) ).current;

    useEffect( () =>
    {
        Animated.loop(
            Animated.timing( shimmerAnimation, {
                toValue: 1,
                duration: 1500,
                useNativeDriver: true,
            } )
        ).start();
    }, [ shimmerAnimation ] );

    const translateX = shimmerAnimation.interpolate( {
        inputRange: [ 0, 1 ],
        outputRange: [ -CARD_WIDTH, CARD_WIDTH ],
    } );

    return (
        <View className="mr-4 w-72 h-96 rounded-[40px] overflow-hidden bg-gray-200">
            {/* Shimmer Effect Overlay */ }
            <Animated.View
                style={ [
                    StyleSheet.absoluteFill,
                    { transform: [ { translateX } ] }
                ] }
            >
                <LinearGradient
                    colors={ [ 'transparent', 'rgba(0,0,0,0.05)', 'transparent' ] }
                    start={ { x: 1, y: 1 } }
                    style={ StyleSheet.absoluteFill }
                />
            </Animated.View>

            <View className="absolute bottom-4 mx-4 h-52 w-[256px]">
                <View className="flex-row items-center mb-4">
                    <View className="w-8 h-8 rounded-full bg-gray-300 mr-2" />
                    <View className="h-4 w-20 bg-gray-300 rounded" />
                </View>

                <View className="h-5 w-full bg-gray-300 rounded mb-2" />
                <View className="h-5 w-5/6 bg-gray-300 rounded mb-4" />

                <View className="h-4 w-full bg-gray-300 rounded mb-2" />
                <View className="h-4 w-full bg-gray-300 rounded mb-2" />
                <View className="h-4 w-4/6 bg-gray-300 rounded" />
            </View>
        </View>
    );
};

export default BlogCardSkeleton;