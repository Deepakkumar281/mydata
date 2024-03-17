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
    Button
} from 'react-native';


interface ButtonProps {
    onPress?: any,
    title?: string,
    

}

export default (props: any) => {
    return(
    

        <TouchableOpacity
        style={[styles.linearGradient,props.btnStyle]}
        onPress={props.onPress}
        {...props}
    >
        <Text style={styles.btnTxt}>{props.title}</Text>
    </TouchableOpacity>
       
);
};



const styles = StyleSheet.create({
    worksBtn:
    {
      height: 40,
      width: "90%",
      alignItems:'center',
      justifyContent: 'center',
      alignSelf: 'center',
      borderRadius: 5,
      marginTop: 10,
      marginBottom:4,
      backgroundColor: '#797979'
    },
    signUpTxt: {
        textAlign: 'center',
        fontSize: 18,
        //marginTop: Platform.OS == 'ios' ? 10 : 6,
        color: AppStyle.color.COLOR_WHITE,
        fontFamily: AppStyle.fonts.FONT_REGULAR,
    },
    linearGradient: {
        height: 55,
        width: "90%",
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 25,
        backgroundColor:AppStyle.color.GREY_70
    },

    btnTxt: {
        textAlign: 'center',
        fontSize: 16,
        color: AppStyle.color.COLOR_BLACK,
        fontFamily: AppStyle.fonts.FONT_BOLD,
        marginBottom: Platform.OS == 'ios' ? 0 : 4,
        marginTop:  Platform.OS == 'ios' ? 4 : 0
    },
})



