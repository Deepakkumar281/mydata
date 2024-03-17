import React, { useEffect, useState } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    Platform
} from 'react-native';
import ProgressCircle from 'react-native-progress-circle';

import AppStyle from '../config/styles';

const IS_IOS = Platform.OS === 'ios' ? true : false

interface CircleProps {
    percentage?: any,
    fillColor?: string,
    unfillColor?: string,
    backColor?: string
}

const ProgressCircleComponent: React.FC =  (props: CircleProps) => {
    return (
        <ProgressCircle
            percent={props.percentage}
            radius={36}
            borderWidth={8}
            color={props.fillColor}
            shadowColor={props.unfillColor}
            bgColor={props.backColor}>
            <Text style={styles.progressText}>{props.percentage + '%'}</Text>
        </ProgressCircle>
    );
};

export default ProgressCircleComponent

const styles = StyleSheet.create({
    progressText: {
        textAlign: 'center',
        fontSize: 14,
        color: AppStyle.color.COLOR_WHITE,
        fontFamily: AppStyle.fonts.ROBOTO_FONT_MEDIUM,
    },

})



