import React, { } from 'react';
import {
    StyleSheet,
    Platform,
    Appearance,
    ReturnKeyType
} from 'react-native';
import AppStyle from '../config/styles';
import { TextInput, DefaultTheme, Text } from 'react-native-paper';

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
    onFocus?: any,
    showRightButton?: boolean,
    returnKeyType?: ReturnKeyType,
    onSubmitEditing?: any
    isEdit?: boolean,
    autoCapital?: any,
    maxLength?: number,
    keyboardType?: any,
    leftText?: any,
    autoFocus?: any,
    rightComponent?: any,
    otherProps?: any
    errorText?: string;
}

const MultiLineInput: React.FC<ButtonProps> = ({
    isSecure = false,
    placeHolder,
    onFocus,
    txtStyle,
    values,
    onChangeText,
    showRightIcon,
    hidePassword,
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
    errorText,
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
                    multiline={true}
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
                        //       fontWeight:'100',
                        //     }
                        // }

                    }}

                    style={[styles.textInput, txtStyle]}
                    selectionColor="#000"
                    underlineColorAndroid="#000"
                    label={placeHolder}
                    autoCapitalize={autoCapital !== '' ? autoCapital : 'none'}
                    autoCorrect={false}

                    value={values}
                    secureTextEntry={isSecure}
                    placeholder={placeHolder}
                    onChangeText={onChangeText}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    editable={isEdit}
                    maxLength={maxLength}
                    keyboardType={keyboardType}

                    //  {...props.isSecure == false &&(

                    //  )}
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
                    multiline={true}
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
                    autoFocus={autoFocus}
                    style={[styles.textInput, txtStyle]}
                    selectionColor="#000"
                    label={placeHolder}
                    underlineColorAndroid="#000"
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
             {errorText && (
                <Text style={{ color: 'red',
                fontSize: 18,
                marginTop: 5,
                marginStart:34,
                
            }}>{errorText}</Text>
            )}
        </>
    );
};

export default MultiLineInput;


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



