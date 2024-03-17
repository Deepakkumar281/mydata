/**
 * React Native App
 * Everything starts from the entrypoint
 */
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    SafeAreaView,
    StyleSheet,
    Appearance,
    Alert,
    Platform,
    DeviceEventEmitter,
} from 'react-native';
import Navigator from './navigation';

import { Provider as PaperProvider } from 'react-native-paper';
import {
    PaperThemeDefault,
    PaperThemeDark,
    CombinedDefaultTheme,
    CombinedDarkTheme,
} from './config/theme';
import { Provider } from 'react-redux';
import reduxStore from './redux/store'
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react'
import { WRootToastApp } from 'react-native-smart-tip'
import { NotifierWrapper } from 'react-native-notifier';
import messaging from '@react-native-firebase/messaging'


export const store = reduxStore()

const RootNavigation: React.FC = () => {
    const colorScheme = Appearance.getColorScheme();
    const isDark = false; 
    const paperTheme = isDark ? PaperThemeDark : PaperThemeDefault;
    const combinedTheme = isDark ? CombinedDarkTheme : CombinedDefaultTheme;
   
    
    return (
        <PaperProvider theme={paperTheme}>
            <NotifierWrapper translucentStatusBar={true}>
                <Navigator theme={combinedTheme} />
            </NotifierWrapper>
        </PaperProvider>
    );
};


const Entrypoint: React.FC = () => {
    return (
        <Provider store={store.store}>
            <PersistGate persistor={store.persistor} loading={<ActivityIndicator />}>
              
                <WRootToastApp>
                    <RootNavigation />
                </WRootToastApp>
            
            </PersistGate>
        </Provider>
    );
};

export default Entrypoint;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
});
