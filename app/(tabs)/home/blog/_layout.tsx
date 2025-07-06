import { Stack } from 'expo-router'
import React from 'react'

const BlogLayout = () =>
{
    return (
        <Stack
            screenOptions={ {
                headerStyle: {
                    backgroundColor: "#fff",
                },
                headerTintColor: "#000",
                headerShadowVisible: false,
                headerShown: false,
            } }
        >
            <Stack.Screen name="index" options={ {} } />
            <Stack.Screen
                name="detail"
                options={ {
                    title: "Bài viết",
                    headerShown: false,
                } }
            />
            <Stack.Screen
                name="add"
                options={ {
                    title: "Tạo bài viết",
                    headerShown: false,
                } }
            />
        </Stack>
    )
}

export default BlogLayout