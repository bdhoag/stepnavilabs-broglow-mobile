import { Feather } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export interface ConfirmFeatureProps {
    confirmFeature?: string[]
}

const ConfirmFeature: React.FC<ConfirmFeatureProps> = ({ confirmFeature }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gồm Các Tính Năng</Text>
            <View style={styles.freePlanContentContainer}>
                {confirmFeature && confirmFeature.map((feature, index) => (
                    <View key={index} style={styles.freePlanFeatureRow}>
                        <Feather name="check" size={20} color="#3DC47E" />
                        <Text style={styles.freePlanFeatureText}>{feature}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default ConfirmFeature

const styles = StyleSheet.create({
    container: {
        flex: 1,  
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontFamily: 'Quicksand_700Bold',
        color: '#171B2E',
        marginBottom: 22,
        textAlign: 'center',
    },
    freePlanContentContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 6,
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
})