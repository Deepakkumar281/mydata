import React, {  } from 'react';
import {
    StyleSheet,
    Platform,
    Appearance,
    ReturnKeyType
} from 'react-native';
import AppStyle from '../config/styles';
import { TextInput,DefaultTheme, Text } from 'react-native-paper';

const IS_IOS = Platform.OS === 'ios' ? true : false

interface ButtonProps {
    onChangeText?: any,
    placeHolder?: string,
    txtStyle?: any,
    values: string,
    isSecure: boolean,
    showRightIcon?: boolean,
    hidePassword?: boolean,
    onPress?: any,
    onFocus?:any,
    showRightButton?: boolean,
    returnKeyType?: ReturnKeyType,
    onSubmitEditing?: any
    isEdit?: boolean,
    autoCapital?: any,
    mode: any,
    maxLength?: number,
    keyboardType?: any,
    leftText?: any,
    autoFocus?: any,
    rightComponent?: any,
    otherProps?: any,
    testID?:string,


}

const OutlineTextinput: React.FC<ButtonProps> = ({
    isSecure = false,
    placeHolder,
    txtStyle,
    values,
    onChangeText,
    onPress,
    showRightButton,
    returnKeyType,
    onSubmitEditing,
    isEdit,
    autoCapital = "",
    maxLength,
    keyboardType,
    leftText,
    autoFocus,   
    rightComponent,
    otherProps,
    testID,
}) => {
    const colorScheme = Appearance.getColorScheme();
    var darkThemeFlag = false
if (colorScheme === 'dark') {
    darkThemeFlag = true
    console.log("dark theme")
  // Use dark color scheme
}
    return (
        <>
            {showRightButton && (
                <TextInput
                    theme={{
                        ...DefaultTheme,
                        colors: {
                            ...DefaultTheme.colors,
                            text: AppStyle.color.COLOR_BLACK,
                            primary: AppStyle.color.COLOR_GREY,
                            background: AppStyle.color.COLOR_WHITE,
                        },
                 }}
                    style={[styles.textInput, txtStyle]}
                    selectionColor="#000"
                    underlineColorAndroid = "#000"
                    label={placeHolder}
                    autoCapitalize={autoCapital !== '' ? autoCapital : 'none'}
                    autoCorrect={false}
                    mode='outlined'
                    dense={true}
                    value={values}
                    secureTextEntry={isSecure}
                    placeholder={placeHolder}
                    onChangeText={onChangeText}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    editable={isEdit}
                    maxLength={maxLength} 
                    keyboardType={keyboardType}
                    testID={testID}
                  
                    left={
                        <Text>{leftText}</Text>
                    }
                    right={
                        <TextInput.Icon
                            name={isSecure ? 'eye-off' : 'eye'}
                            size={22}
                            color={'black'}
                            forceTextInputFocus={false}
                            onPress={onPress}
                        />
                    }
                {...otherProps}
                >

                </TextInput>
            )}

            {showRightButton == false && (

                <TextInput
                    theme={{
                        ...DefaultTheme,
                        colors: {
                            ...DefaultTheme.colors,
                            text: AppStyle.color.COLOR_BLACK,
                            primary: AppStyle.color.COLOR_GREY,
                            background: AppStyle.color.COLOR_WHITE,
                        },
                        // fonts: {
                        //     regular: {
                        //       fontFamily: AppStyle.fonts.FONT_REGULAR,
                        //      fontWeight:'bold'
                        //     }
                        // }
                    }}
                    mode='outlined'
                    dense={true}
                    autoFocus={autoFocus}
                    style={[styles.textInput, txtStyle]}
                    selectionColor="#000"
                    label={placeHolder}
                    underlineColorAndroid = "#000"
                    autoCapitalize={autoCapital !== '' ? autoCapital : 'none'}
                    autoCorrect={false}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    value={values}
                    editable={isEdit}
                    secureTextEntry={isSecure}
                    placeholder={placeHolder}
                    onChangeText={onChangeText}
                    maxLength={maxLength}
                    keyboardType={keyboardType}
                    right={rightComponent}
                    {...otherProps}
                >

                </TextInput>
            )}
        </>
    );
};

export default OutlineTextinput;


const styles = StyleSheet.create({
    btnTxt: {
        textAlign: 'center',
        fontSize: 19,
        color: AppStyle.color.COLOR_WHITE,
        fontFamily: AppStyle.fonts.FONT_BOLD,
        marginBottom: IS_IOS ? 0 : 4,
        marginTop: IS_IOS ? 4 : 0
    },

    textInput: {
        marginTop: 4,
        width: '90%',
        fontSize: 15,
        marginLeft: 20,
        marginRight: 10,
        fontFamily: AppStyle.fonts.FONT_REGULAR,
        paddingHorizontal: -10,
        backgroundColor: AppStyle.color.COLOR_WHITE,
       
    },
})



