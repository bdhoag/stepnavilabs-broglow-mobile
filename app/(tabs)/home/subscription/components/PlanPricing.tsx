import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface PlanPricingProps {
    onSelect?: (selectedPlan: string) => void;
}

interface PlanOption {
    label: string;
    price: string;
    isPopular?: boolean;
}

const PlanPricing = ({ onSelect }: PlanPricingProps) => {
    const [selectedPlan, setSelectedPlan] = useState('Hàng tháng');

    const plans: PlanOption[] = [
        { label: 'Hàng tuần', price: '127.000đ/tuần' },
        { label: 'Hàng tháng', price: '255.000đ/tháng', isPopular: true },
        { label: 'Hàng năm', price: '1.276.000đ/năm' },
    ];

    const handleSelect = (label: string) => {
        setSelectedPlan(label);
        if (onSelect) onSelect(label);
    };

    return (
        <View style={styles.pricingContainer}>
            {plans.map((plan, index) => (
                <View key={index} style={styles.optionContainer}>
                    <TouchableOpacity onPress={() => handleSelect(plan.label)} style={styles.optionSelector}>
                        <Ionicons
                            name={selectedPlan === plan.label ? 'checkmark-circle' : 'radio-button-off'}
                            size={24}
                            color={selectedPlan === plan.label ? '#1584F2' : '#ccc'}
                        />
                    </TouchableOpacity>
                    <View style={styles.optionValueContainer}>
                        <Text style={styles.optionValue}>{plan.label}</Text>
                        <Text style={styles.optionText}>{plan.price}</Text>
                    </View>
                    {plan.isPopular && (
                        <TouchableOpacity style={styles.popularButton}>
                            <Text style={styles.popularText}>Phổ biến nhất</Text>
                        </TouchableOpacity>
                    )}
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    pricingContainer: {
        flex: 1,
        padding: 20,
        borderWidth: 2,
        borderColor: '#1584F2',
        borderRadius: 18,
        marginBottom: 20,
        paddingVertical: 12,
        gap: 6,

    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e6e6e6',
        
    },
    optionSelector: {
        marginRight: 10,
    },
    optionValueContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 5,
    },
    optionValue: {
        fontSize: 14,
        fontFamily: 'Quicksand_700Bold',
        textAlign: 'left',
        color: '#171B2E',
    },
    optionText: {
        fontSize: 12,
        fontFamily: 'Quicksand_400Regular',
        color: '#171B2E',
        marginLeft: 0,
    },
    popularButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#12B2B3',
        padding: 6,
        borderRadius: 50,
    },
    popularText: {
        color: '#fff',
        fontSize: 12,
        marginLeft: 4,
    },
});

export default PlanPricing;