import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get( "window" );

const SubMethod = () =>
{
    const router = useRouter();
    const [ selectedMethod, setSelectedMethod ] = useState( 'momo' );
    const [ showSuccessModal, setShowSuccessModal ] = useState( false );
    const momoImg = require( '../../../../assets/images/momo.png' )

    const handleBack = () =>
    {
        router.back();
    };

    const handlePayment = () =>
    {
        console.log( 'Processing payment with:', selectedMethod );
        setShowSuccessModal( true );
    };

    const handleModalOK = () =>
    {
        setShowSuccessModal( false );
        router.replace( "/(tabs)/home" );
    };

    const SuccessModal = () => (
        <Modal
            visible={ showSuccessModal }
            transparent={ true }
            animationType="fade"
            onRequestClose={ () => { } }
        >
            <View
                style={ {
                    flex: 1,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    justifyContent: "center",
                    alignItems: "center",
                } }
            >
                <View
                    style={ {
                        backgroundColor: "white",
                        borderRadius: 50,
                        paddingHorizontal: 32,
                        paddingTop: 32,
                        paddingBottom: 16,
                        width: width * 0.8,
                        minHeight: 300,
                        alignItems: "center",
                        justifyContent: "space-between",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.25,
                        shadowRadius: 3.84,
                        elevation: 5,
                    } }
                >
                    {/* Decorative dots */ }
                    <View style={ { position: "absolute", top: 40, left: 80 } }>
                        <View
                            style={ {
                                width: 20,
                                height: 20,
                                borderRadius: 20,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>
                    <View style={ { position: "absolute", top: 30, right: 80 } }>
                        <View
                            style={ {
                                width: 10,
                                height: 10,
                                borderRadius: 10,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>
                    <View style={ { position: "absolute", top: 20, left: 150 } }>
                        <View
                            style={ {
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>
                    <View style={ { position: "absolute", top: 90, right: 100 } }>
                        <View
                            style={ {
                                width: 7,
                                height: 7,
                                borderRadius: 3,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>
                    <View style={ { position: "absolute", bottom: 80, left: 60 } }>
                        <View
                            style={ {
                                width: 5,
                                height: 5,
                                borderRadius: 2.5,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>
                    <View style={ { position: "absolute", bottom: 130, right: 50 } }>
                        <View
                            style={ {
                                width: 7,
                                height: 7,
                                borderRadius: 3.5,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>
                    <View style={ { position: "absolute", bottom: 150, left: 120 } }>
                        <View
                            style={ {
                                width: 4,
                                height: 4,
                                borderRadius: 2,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>
                    <View style={ { position: "absolute", top: 150, right: 140 } }>
                        <View
                            style={ {
                                width: 5,
                                height: 5,
                                borderRadius: 2.5,
                                backgroundColor: "#4A90E2",
                            } }
                        />
                    </View>

                    {/* Checkmark Circle */ }
                    <View
                        style={ {
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            backgroundColor: "#4A90E2",
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: 40,
                            marginTop: 20
                        } }
                    >
                        <View
                            style={ {
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                backgroundColor: "white",
                                justifyContent: "center",
                                alignItems: "center",
                            } }
                        >
                            <Ionicons name="checkmark" size={ 30 } color="#4A90E2" />
                        </View>
                    </View>

                    {/* Text */ }
                    <Text
                        style={ {
                            fontSize: 18,
                            fontWeight: "bold",
                            color: "#1584F2",
                            textAlign: "center",
                            marginBottom: 6,
                            fontFamily: "Quicksand_700Bold",
                        } }
                    >
                        Đã Thanh Toán
                    </Text>

                    <Text
                        style={ {
                            fontSize: 12,
                            color: "#171B2E",
                            textAlign: "center",
                            marginBottom: 7,
                            fontFamily: "Quicksand_400Regular",
                        } }
                    >
                        Bạn đã nâng cấp tài khoản BroGlow Pro thành công!
                    </Text>

                    {/* OK Button */ }
                    <TouchableOpacity
                        onPress={ handleModalOK }
                        style={ {
                            backgroundColor: "#4A90E2",
                            paddingHorizontal: 48,
                            paddingVertical: 14,
                            borderRadius: 24,
                            width: "100%",
                            marginTop: 24,
                        } }
                    >
                        <Text
                            style={ {
                                color: "white",
                                fontSize: 16,
                                fontWeight: "600",
                                textAlign: "center",
                            } }
                        >
                            OK
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={ styles.container }>
            {/* Header */ }
            <View style={ styles.headerContainer }>
                <TouchableOpacity onPress={ handleBack } style={ styles.backButton }>
                    <Ionicons name="arrow-back" size={ 20 } color="#333" />
                </TouchableOpacity>
                <Text style={ styles.headerTitle }>
                    Phương thức thanh toán
                </Text>
            </View>

            {/* Content */ }
            <ScrollView style={ styles.mainContentContainer }>
                <Text style={ styles.sectionTitle }>
                    Chọn phương thức thanh toán của bạn
                </Text>

                {/* MoMo Payment Option */ }
                <TouchableOpacity
                    style={ [
                        styles.paymentOption,
                        selectedMethod === 'momo' && styles.selectedPaymentOption
                    ] }
                    onPress={ () => setSelectedMethod( 'momo' ) }
                >
                    <View style={ styles.paymentContent }>
                        <View style={ styles.momoLogoContainer }>
                            <Image
                                source={ momoImg }
                                style={ styles.momoLogo }
                                resizeMode="contain"
                            />
                        </View>
                        <View style={ styles.paymentInfo }>
                            <Text style={ styles.paymentTitle }>Ví Điện Tử MoMo</Text>
                            <Text style={ styles.paymentSubtitle }>xxxx xxx 789</Text>
                        </View>
                        <View style={ styles.checkContainer }>
                            <Ionicons
                                name={ selectedMethod === 'momo' ? 'checkmark-circle' : 'radio-button-off' }
                                size={ 24 }
                                color={ selectedMethod === 'momo' ? '#1584F2' : '#ccc' }
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView>

            {/* Payment Button */ }
            <View style={ styles.buttonContainer }>
                <TouchableOpacity
                    style={ styles.paymentButton }
                    onPress={ handlePayment }
                >
                    <Text style={ styles.paymentButtonText }>Thanh toán</Text>
                </TouchableOpacity>
            </View>

            {/* Success Modal */ }
            <SuccessModal />
        </SafeAreaView>
    )
}

export default SubMethod

const styles = StyleSheet.create( {
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
    },
    backButton: {
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1f2937',
    },
    mainContentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Quicksand_700Bold',
        color: '#374151',
        marginBottom: 24,
    },
    paymentOption: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    selectedPaymentOption: {
        borderColor: '#3B82F6',
        backgroundColor: '#F8FAFC',
    },
    paymentContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    momoLogoContainer: {
        marginRight: 12,
    },
    momoLogo: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    paymentInfo: {
        flex: 1,
    },
    paymentTitle: {
        fontSize: 16,
        fontFamily: 'Quicksand_700Bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    paymentSubtitle: {
        fontSize: 12,
        color: '#616161',
        fontFamily: 'Quicksand_500Regular',
    },
    checkContainer: {
        marginLeft: 12,
    },
    buttonContainer: {
        paddingHorizontal: 16,
        paddingVertical: 24,
        backgroundColor: '#FFFFFF',
    },
    paymentButton: {
        backgroundColor: '#1584F2',
        borderRadius: 50,
        paddingVertical: 16,
        alignItems: 'center',
    },
    paymentButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Quicksand_700Bold',
    },
} )