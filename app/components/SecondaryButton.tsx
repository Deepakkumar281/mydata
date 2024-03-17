import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import AppStyle from '../config/styles';

const IS_IOS = Platform.OS === 'ios' ? true : false

interface ButtonProps {
    onPress?: any,
    title?: string,
    btnStyle: any,
    textStyle:any,
}

export default (props: ButtonProps) => {
    return (
        <TouchableOpacity
                style={[styles.linearGradient,props.btnStyle]}
                onPress={props.onPress}
                {...props}
            >
                <Text style={[styles.btnTxt,props.textStyle]}>{props.title}</Text>
            </TouchableOpacity>
    );
};



const styles = StyleSheet.create({
    btnTxt: {
        textAlign: 'center',
        fontSize: 18,
        color: AppStyle.color.PRIMARY_BUTTON_COLOR,
        fontFamily: AppStyle.fonts.FONT_BOLD,
        marginBottom: IS_IOS ? 0 : 4,
        marginTop: IS_IOS ? 4 : 0
    },
    linearGradient: {
        height: 55,
        width: "90%",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 25,
        marginTop:10,
        borderColor : AppStyle.color.PRIMARY_BUTTON_COLOR,
        borderWidth:2
    },
})



