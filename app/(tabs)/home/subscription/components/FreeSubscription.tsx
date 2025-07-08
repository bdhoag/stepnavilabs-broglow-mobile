import { Feather } from '@expo/vector-icons'; // Ensure Feather is imported
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface FreePlanProps {
    featureAvailable?: string[];
    featureUnavailable?: string[];
}

const FreePlan: React.FC<FreePlanProps> = ({ featureAvailable, featureUnavailable }) => {
    return (
        <View style={styles.freePlanContainer}>
            <View style={styles.freePlanHeaderContainer}>
                <Text style={styles.freePlanTitleHeader}>Miễn Phí</Text>
                <Text style={styles.freePlanTextHeader}>(Gói hiện tại)</Text>
            </View>

            <View style={styles.freePlanContentContainer}>
                {featureAvailable && featureAvailable.map((feature, index) => (
                    <View key={index} style={styles.freePlanFeatureRow}>
                        <Feather name="check" size={20} color="#3DC47E" />
                        <Text style={styles.freePlanFeatureText}>{feature}</Text>
                    </View>
                ))}
                {featureUnavailable && featureUnavailable.map((feature, index) => (
                    <View key={index} style={styles.freePlanFeatureRow}>
                        <Feather name="x" size={20} color="#F75555" />
                        <Text style={styles.freePlanFeatureText}>{feature}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default FreePlan;

const styles = StyleSheet.create({
    freePlanContainer: {
        flex: 1,
        padding: 20,
        borderWidth: 2,
        borderColor: '#1584F2',
        borderRadius: 18,
        marginBottom: 20,
        paddingVertical: 12,
    },
    freePlanHeaderContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        paddingBottom: 12,
        borderBottomColor: '#e6e6e6e6',
        paddingHorizontal: 20,
        paddingTop: 12,
        gap: 8,
    },
    freePlanTitleHeader: {
        fontSize: 32,
        fontWeight: '700',
        fontFamily: 'Quicksand_700Bold',
        color: '#1584F2',
    },
    freePlanTextHeader: {
        fontSize: 14,
        fontFamily: 'Quicksand_400Regular',
        color: '#171B2E',
    },
    freePlanContentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingTop: 16,
    },
    freePlanFeatureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    freePlanFeatureText: {
        fontSize: 15,
        fontFamily: 'Quicksand_400Regular',
        color: '#171B2E',
    },
});