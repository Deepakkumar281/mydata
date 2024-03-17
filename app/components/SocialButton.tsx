import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform,
    Image,
} from 'react-native';
import AppStyle from '../config/styles';


const IS_IOS = Platform.OS === 'ios' ? true : false

interface ButtonProps {
    onPress?: any,
    btnStyle: any,
    borderColor:any,
    imageName:any,
    iconStyle : any,
}

export default (props: ButtonProps) => {
    return (
        <TouchableOpacity
                style={[styles.linearGradient,props.btnStyle,{borderColor:props.borderColor}]}
                onPress={props.onPress}
                {...props}   
               
            >
                 <Image  style={[styles.iconImg,props.iconStyle]} source={props.imageName}
                 
                 {...props}   />
             
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
    iconImg:{
        width:26,
        height:28,
        justifyContent:'center',
        alignSelf:'center',
        marginTop:15,
    },

    linearGradient:
    {
        borderColor:'#8195a7',
        borderWidth:1,
        borderRadius:15,
        width:80,
        height:80,
    }
})



