import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export interface ProSubscriptionProps {
    featureAvailable?: string[];
    featureUnavailable?: string[];
}

const ProSubscription: React.FC<ProSubscriptionProps> = ({ featureAvailable, featureUnavailable }) => {
    const handleUpgrade = () => {
        router.push('/(tabs)/home/subscription/confirm');
    }
    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleHeader}>PRO</Text>
            </View>

            <View style={styles.contentContainer}>
                {featureAvailable && featureAvailable.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                        <Feather name="check" size={20} color="#3DC47E" />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
                {featureUnavailable && featureUnavailable.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                        <Feather name="x" size={20} color="#F75555" />
                        <Text style={styles.featureText}>{feature}</Text>
                    </View>
                ))}
            </View>

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
        </View>
    );
};

export default ProSubscription;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        borderWidth: 2,
        borderColor: '#1584F2',
        borderRadius: 18,
        backgroundColor: '#1584F2',
        paddingVertical: 12,

    },
    headerContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        paddingBottom: 12,
        borderBottomColor: '#ffffff',
        paddingHorizontal: 20,
        paddingTop: 12,
        gap: 8,
    },
    titleHeader: {
        fontSize: 32,
        fontWeight: '700',
        fontFamily: 'Quicksand_700Bold',
        color: '#ffffff',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 16,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    featureText: {
        fontSize: 15,
        fontFamily: 'Quicksand_400Regular',
        color: '#ffffff',
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