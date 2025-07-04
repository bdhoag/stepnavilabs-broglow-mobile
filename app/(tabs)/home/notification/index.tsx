import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'profile' | 'upgrade';
    dateGroup: string;
}

const notifications: NotificationItem[] = [
    {
        id: '1',
        title: 'Hoàn thành xác định hồ sơ da',
        description: 'Lorem ipsum dolor sit amet consectetur. Sagittis turpis tris',
        time: '5 phút trước',
        type: 'profile',
        dateGroup: 'Hôm nay',
    },
    {
        id: '2',
        title: 'Nâng cấp gói',
        description: 'Hãy trở thành BroGlow member để có cơ hội sử dụng các tính năng vượt trội',
        time: '5 phút trước',
        type: 'upgrade',
        dateGroup: 'Hôm qua (20/6/2025)',
    },
    {
        id: '3',
        title: 'Nâng cấp gói',
        description: 'Hãy trở thành BroGlow member để có cơ hội sử dụng các tính năng vượt trội',
        time: '5 phút trước',
        type: 'upgrade',
        dateGroup: 'Hôm qua (20/6/2025)',
    },
    {
        id: '4',
        title: 'Nâng cấp gói',
        description: 'Hãy trở thành BroGlow member để có cơ hội sử dụng các tính năng vượt trội',
        time: '5 phút trước',
        type: 'upgrade',
        dateGroup: '18/6/2025',
    },
];

const groupedNotifications = notifications.reduce((groups: Record<string, NotificationItem[]>, item) => {
    if (!groups[item.dateGroup]) {
        groups[item.dateGroup] = [];
    }
    groups[item.dateGroup].push(item);
    return groups;
}, {});

const NotificationScreen = () => {
    const navigation = useNavigation();

    const getIcon = (type: string) => {
        return type === 'profile'
            ? require('../../../../assets/images/Left.png')
            : require('../../../../assets/images/Left do.png');
    };

    const handleBackPress = () => {
        router.back(); // Navigate back to the previous screen

    };

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={handleBackPress} style={styles.header}>
                <Text style={styles.headerText}>← Thông Báo</Text>
            </TouchableOpacity>
            {Object.entries(groupedNotifications).map(([date, items]) => (
                <View key={date}>
                    <Text style={styles.dateGroup}>{date}</Text>
                    {items.map(item => (
                        <View key={item.id} style={styles.card}>
                            <Image source={getIcon(item.type)} style={styles.icon} />
                            <View style={styles.content}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
    },
    dateGroup: {
        fontWeight: '600',
        fontSize: 14,
        marginTop: 10,
        marginBottom: 6,
        color: '#333',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fdfdfd',
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    icon: {
        width: 36,
        height: 36,
        marginRight: 12,
        resizeMode: 'contain',
    },
    content: {
        flex: 1,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 2,
    },
    description: {
        fontSize: 13,
        color: '#555',
    },
    time: {
        marginTop: 4,
        fontSize: 12,
        color: '#999',
    },
});

export default NotificationScreen;