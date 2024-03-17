import React, { useEffect, useState } from 'react';
import AppStyle from '../config/styles';
import {
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    Text,
    FlatList,
    StyleSheet,
    Platform,
    Button,
    SafeAreaView, StatusBar
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import images from '../config/images';

interface ButtonProps {
    title: string;
    showInbox?: boolean,
    showNotification?: boolean,
    showMore?: boolean,
    headerStyle?: any;
    onpress: any,
}

const HeaderWithDrawer: React.FC<ButtonProps> = ({
    
    title, showInbox, showNotification, showMore, headerStyle, onpress
}) => {
    const navigation: any = useNavigation();


    return (
        <>
            <View style={styles.cardView}>
                <View
                    style={[styles.header, headerStyle]}
                >
                    {/* Left */}
                    <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                        onPress={() => {
                                navigation.openDrawer();
                            }}
                        
                            style={styles.headerMenuButton}>
                            <Image
                                resizeMode='contain'
                                style={{ height: 20, width: 20 }}
                                source={images.leftMenuWt}
                            />
                        </TouchableOpacity>

                    </View>
 
                    {/* Middle */}
                    {/* <View style={{ flex: 0.55 }}>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                  
                    <View style={{ flex: 0.25, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <View style={styles.headerRight}>
                           
                        </View>
                    </View> */}

                </View >
            </View >
        </>
    );
};

export default HeaderWithDrawer;


const styles = StyleSheet.create({
    cardView:
    {
        backgroundColor: 'transparent',
        //borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 2,
        shadowOpacity: 0.1

    },
    header: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        height: 65,
        marginTop: 20,
        paddingHorizontal: 10,
        // backgroundColor: 'red'
    },
    headerBackArrow: {
        //flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row'

    },
    title: {
        color: AppStyle.color.COLOR_WHITE,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: AppStyle.fonts.FONT_SEMIBOLD,
    },
    headerMenuButton: {
        height: 40,
        width: 40,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    },
    headerBackButton: {
        height: 25,
        width: 25,
        // justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
        //marginTop:25,
    },
    headerRight: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    logoImg: {
        width: 25,
        height: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8
    },
    topView: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
})



