import { Notification, notificationService } from '@/src/services/notification.service';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    type: 'profile' | 'upgrade';
    dateGroup: string;
}

const NotificationScreen = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Helper function to calculate relative time
    const getRelativeTime = (createdAt: string) => {
        const now = new Date();
        const date = new Date(createdAt);
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSeconds < 60) return `${diffSeconds} giây trước`;
        if (diffMinutes < 60) return `${diffMinutes} phút trước`;
        if (diffHours < 24) return `${diffHours} giờ trước`;
        return `${diffDays} ngày trước`;
    };

    // Helper function to determine date group
    const getDateGroup = (createdAt: string) => {
        const now = new Date();
        const date = new Date(createdAt);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const isToday =
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate();
        const isYesterday =
            date.getFullYear() === yesterday.getFullYear() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getDate() === yesterday.getDate();

        if (isToday) return 'Hôm nay';
        if (isYesterday) return 'Hôm qua';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Fetch notifications from API
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const apiNotifications = await notificationService.getAllNotifications(1, 10);
                const mappedNotifications = apiNotifications.map((notif: Notification) => {
                    // Type guard for createdAt
                    const createdAt = notif.createdAt ?? new Date().toISOString();
                    const mappedType: 'profile' | 'upgrade' =
                        ['success', 'info'].includes(notif.type ?? '') ? 'profile' : 'upgrade'; // Handle undefined type
                    return {
                        id: notif._id,
                        title: notif.title,
                        description: notif.message,
                        time: getRelativeTime(createdAt),
                        type: mappedType,
                        dateGroup: getDateGroup(createdAt),
                    };
                });

                setNotifications(mappedNotifications);
            } catch (err) {
                setError('Không thể tải thông báo. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    // Group notifications by dateGroup
    const groupedNotifications = notifications.reduce(
        (groups: Record<string, NotificationItem[]>, item) => {
            if (!groups[item.dateGroup]) {
                groups[item.dateGroup] = [];
            }
            groups[item.dateGroup].push(item);
            return groups;
        },
        {}
    );

    const getIcon = (type: string) => {
        return type === 'profile'
            ? require('../../../../assets/images/Left do.png')
            : require('../../../../assets/images/Left.png');
    };

    const handleBackPress = () => {
        router.back();
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Đang tải...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={handleBackPress} style={styles.header}>
                <Text style={styles.headerText}>← Thông Báo</Text>
            </TouchableOpacity>
            {Object.entries(groupedNotifications).map(([date, items]) => (
                <View key={date}>
                    <Text style={styles.dateGroup}>{date}</Text>
                    {items.map((item) => (
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
        flex: 1,
        padding: 16,
        backgroundColor: '#ffffff',
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