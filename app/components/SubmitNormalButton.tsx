import React from 'react';
import {TouchableOpacity, Text, StyleSheet, Platform} from 'react-native';
import {ActivityIndicator, Colors} from 'react-native-paper';
import AppStyle from '../config/styles';

const IS_IOS = Platform.OS === 'ios' ? true : false;

interface ButtonProps {
  onPress?: any;
  title?: string;
  btnStyle: any;
  loading?: boolean;
  
}

export default (props: ButtonProps) => {
  return (
    <TouchableOpacity
      disabled={props.loading}
      style={[styles.linearGradient, props.btnStyle]}
      onPress={props.onPress}
      {...props}>
      {!props.loading ? (
        <Text style={styles.btnTxt}>{props.title}</Text>
      ) : (
        <ActivityIndicator animating={true} color={Colors.white} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnTxt: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: AppStyle.color.COLOR_WHITE,
    fontFamily: AppStyle.fonts.FONT_BOLD,
    marginBottom: IS_IOS ? 0 : 4,
    marginTop: IS_IOS ? 4 : 0,
  },
  linearGradient: {
    height: 55,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: AppStyle.color.PRIMARY_BUTTON_COLOR,
  },
});
