import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfirmFeature from './components/ConfirmFeature';
import PlanPricing from './components/PlanPricing';

const SubConfirm = () => {
    const router = useRouter();
    const [selectedPlan, setSelectedPlan] = useState('Hàng tháng');

    const handleBack = () => {
        router.back();
    };

    const handleUpgrade = () => {
        router.push('/(tabs)/home/subscription/method');
        console.log(`Selected Plan: ${selectedPlan}`);
        
    };

    return (
        <SafeAreaView style={styles.subConfirmContainer}>
            <View style={styles.subConfirmHeader}>
                <TouchableOpacity onPress={handleBack} style={styles.subConfirmBack}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <View style={styles.subConfirmSubHeader}>
                    <Text style={styles.subConfirmTitle}>BroGlow</Text>
                    <View style={styles.subConfirmSubText}>
                        <Text style={styles.subConfirmSubText}>PRO</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.subConfirmContent}>

                <PlanPricing onSelect={setSelectedPlan} />

                <ConfirmFeature
                    confirmFeature={[
                        'Scan da mặt',
                        'Phân tích da bằng AI',
                        'Lưu lại quá trình mỗi lần scan da',
                        'Xác định hồ sơ da',
                        'Tham gia cộng đồng chăm sóc da',
                        'Gợi ý sử dụng sản phẩm bằng AI (không giới hạn)',
                        'Gợi ý chu trình chăm sóc da (không giới hạn)',
                        'Tư vấn với chuyên gia',
                    ]}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={handleUpgrade}>
                        <LinearGradient
                            colors={['#FFB800', '#FFDA7B']}
                            style={styles.gradientButton}
                            start={{ x: 1, y: 0 }}
                            end={{ x: 0, y: 1 }}
                        >
                            <Text style={styles.buttonText}>Nâng cấp</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SubConfirm;

const styles = StyleSheet.create({
    subConfirmContainer: { flex: 1 },
    subConfirmHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
    },
    subConfirmSubHeader: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        gap: 5,
    },
    subConfirmSubText: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#1584F2',
        padding: 5,
        borderRadius: 50,
        color: '#fff',
    },
    subConfirmBack: { marginRight: 12 },
    subConfirmTitle: {
        fontSize: 20,
        fontFamily: 'Quicksand_700Bold',
        color: '#1f2937',
    },
    subConfirmContent: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    upgradeButton: {
        backgroundColor: '#FFB800',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    upgradeText: {
        color: '#1584F2',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonContainer: {
        marginTop: 20,
        borderRadius: 50,
    },
    gradientButton: {
        padding: 16,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Quicksand_700Bold',
    },
});