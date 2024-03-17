import React, { useEffect, useState } from 'react';
import AppStyle from '../config/styles';
import {
    View,
    Image,
    TouchableOpacity,
    Text,
    StyleSheet,

} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import images from '../config/images';
// import LinearGradient from 'react-native-linear-gradient'
import NavigationService from '../navigation/NavigationService';


interface HeaderProps {
    title: string;
    isReset?: boolean;
    showBack?: boolean;
    showRight?: boolean;
    onPress?: any,
    onPressSaved? : any,
    // style?:any;
}

const CustomHeader: React.FC<HeaderProps> = ({
    title,
    isReset = false,
    showBack = false,
    showRight = false,
    onPress,
    onPressSaved
}) => {
    const navigation = useNavigation();

    return (
        <>
            {/* <StatusBar backgroundColor={'#fff'} barStyle='dark-content' /> */}
            {/* //<SafeAreaView> */}
            {/* <ImageBackground source = {images.headerTop}>

            </ImageBackground> */}
            {/*
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#F5AB00', '#F56E00']} style={styles.cardView}>
                <View
                    style={styles.header}
                >
                    <View style={{ flex: 0.2, flexDirection: 'row', alignItems: 'center' }}>

                        {showBack &&
                            <TouchableOpacity onPress={() => NavigationService.goBack()}
                                style={styles.headerBackButton}>
                                <Image
                                    resizeMode='contain'
                                    style={{ height: 20, width: 20 }}
                                    source={images.whiteBackIcon}
                                />
                            </TouchableOpacity>
                        }

                        {showBack == false &&(

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
                        )}

                    </View>

                    <View style={{ flex: 0.6 }}>
                        <Text style={styles.title}>{title}</Text>
                    </View>


                    {showRight ?
                        <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-end' }}>
                            {isReset ?
                                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }} onPress={onPress}>
                                    <Text style={styles.semiTitle}>Reset</Text>
                                </TouchableOpacity>
                                :
                                <View style={styles.headerRight}>
                                    <TouchableOpacity onPress = {onPressSaved} >
                                        <Image
                                            resizeMode='contain'
                                            style={{ height: 20, width: 20, marginRight: 25 }}
                                            source={images.whiteBookmarkIcon}
                                        />
                                    </TouchableOpacity>

                                </View>
                            }
                        </View> :
                        <View style={{ flex: 0.2 }}>

                        </View>
                    }
                </View>
            </LinearGradient >
            {/* </SafeAreaView > */}
        </>
    );
};

export default CustomHeader;


const styles = StyleSheet.create({
    cardView:
    {
        //backgroundColor: '#2E9298',
        //borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 2,
        shadowOpacity: 0.1,
        height: 130,
        width: '100%'

    },
    header: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        marginTop: 20,
        paddingHorizontal: 10,
        // backgroundColor: 'yellow'
        //backgroundColor: '#fff'
    },
    headerBackArrow: {
        //flex: 0.1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row'

    },
    headerMenuButton: {
        height: 25,
        width: 25,
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 5,
    },
    title: {
        color: AppStyle.color.COLOR_WHITE,
        textAlign: 'center',
        fontSize: 18,
        fontFamily: AppStyle.fonts.FONT_SEMIBOLD,
    },
    semiTitle:
    {
        color: AppStyle.color.COLOR_WHITE,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: AppStyle.fonts.FONT_MEDIUM,
    },
    headerTxt:
    {
        color: AppStyle.color.GREY_70,
        textAlign: 'center',
        fontSize: 14,
        marginLeft: 10,
        fontFamily: AppStyle.fonts.FONT_MEDIUM,
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
        justifyContent: "center",
        alignItems: "center",
        flexDirection: 'row',
    },


})



