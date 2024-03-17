import React from 'react';
import {
    Platform,
    Image, View, StyleSheet, Modal,
    Dimensions
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import metrics from '../config/metrics';
import AppStyle from '../config/styles';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

interface LoaderProps {
    loading?: boolean,
    style: any
}

export default (props: any) => {
    return (
        // <Modal transparent={true} animationType={"none"} visible={true}>
        //     <View style={localStyle.modalBackground}>
        //         <View style={localStyle.activityIndicatorWrapper}>
        //             <ActivityIndicator
        //                 animating={true}
        //                 size="large"
        //                 color={AppStyle.color.ORANGE_DARK}
        //             />
        //         </View>
        //     </View>
        // </Modal>
        // <View style={localStyle.modalBackground}>
        <View style={[localStyle.container, localStyle.flexCenter, props.style]}>
              <View style={localStyle.activityIndicatorWrapper}>
            <ActivityIndicator
                animating={true}
                size="large"
                color={AppStyle.color.PRIMARY_BUTTON_COLOR}
            />
        </View>
        </View>
    );
};


const localStyle = StyleSheet.create({
    modalBackground: {
        flex: 1,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-around",
        backgroundColor: "#00000040",
    },
    activityIndicatorWrapper: {
        // backgroundColor: "#fff",
        height: 100,
        width: 100,
        borderRadius: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
    },
    container: {
        flex:1,
        position: 'absolute',
        width: metrics.screenWidth,
        height: metrics.screenHeight + 0,
        // backgroundColor: AppStyle.color.COLOR_LOADER_BG,
    },
    flexCenter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})



