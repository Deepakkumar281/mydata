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
            style={[styles.worksBtn, props.style]}
        
            onPress={props.onPress}
            {...props}
        >
            <Text style = {styles.signUpTxt}>{props.title}</Text>
        </TouchableOpacity>
       
);
};



const styles = StyleSheet.create({
    worksBtn:
    {
  
      height: 40,
      width: "90%",
    
      alignSelf:'center',
   
      marginTop: 10,
      borderRadius: 5,
      marginBottom:4,
      backgroundColor: AppStyle.color.COLOR_BLACK
    },
    signUpTxt: {
        textAlign: 'center',
        fontSize: 18,
        marginTop: Platform.OS == 'ios' ? 10 : 6,
        color: AppStyle.color.COLOR_WHITE,
        fontFamily: AppStyle.fonts.FONT_REGULAR,
    },
    linearGradient: {
        height: 40,
        width: "90%",
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        marginLeft: 15,
        marginTop: 20,
    },

})



