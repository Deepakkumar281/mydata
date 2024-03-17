import React, { useEffect, useState } from 'react';
import AppStyle from '../config/styles';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient'

interface ButtonProps {
    onPress?: any,
    title?: string,
}

export default (props: any) => {
    return (
        <LinearGradient colors={['#00CC18', '#00660C']} style={styles.linearGradient}>
            <TouchableOpacity
                style={[styles.signBtn, props.style]}
                onPress={props.onPress}
                {...props}
            >
                <Text style={styles.signUpTxt}>{props.title}</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};



const styles = StyleSheet.create({
    signBtn: {
        height: 40,
        width: "50%",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        marginBottom: 4,
        borderRadius: 5,
    },
    signUpTxt: {
        textAlign: 'center',
        fontSize: 18,
        color: AppStyle.color.COLOR_WHITE,
        fontFamily: AppStyle.fonts.FONT_REGULAR,
    },
    linearGradient: {
        height: 40,
        width: "90%",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 5,
        marginTop: 15,
    },
})



