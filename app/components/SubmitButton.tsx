import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import AppStyle from '../config/styles';
import LinearGradient from 'react-native-linear-gradient'

const IS_IOS = Platform.OS === 'ios' ? true : false

interface ButtonProps {
    onPress?: any,
    title?: string,
    btnStyle: any
}

export default (props: ButtonProps) => {
    return (
        <LinearGradient
            colors={[AppStyle.color.ORANGE_PEEL, AppStyle.color.ORANGE_DARK]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.linearGradient, props.btnStyle]}>
            <TouchableOpacity
                style={styles.linearGradient}
                onPress={props.onPress}
                {...props}
            >
                <Text style={styles.btnTxt}>{props.title}</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};



const styles = StyleSheet.create({
    btnTxt: {
        textAlign: 'center',
        fontSize: 18,
        color: AppStyle.color.COLOR_WHITE,
        fontFamily: AppStyle.fonts.FONT_REGULAR,
        marginBottom: IS_IOS ? 0 : 4,
        marginTop: IS_IOS ? 4 : 0
    },
    linearGradient: {
        height: 45,
        width: "90%",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 25,
    },
})



