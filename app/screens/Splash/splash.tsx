import React, {useEffect, useMemo} from 'react';
import {View, Image, Alert, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NavigationService from '../../navigation/NavigationService';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from '../../redux';
import DeviceInfo from 'react-native-device-info';

import IdmApi from '../../services/auth';
import RNExitApp from 'react-native-exit-app';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import styles from './styles';
import images from '../../config/images';
import { ActivityIndicator } from 'react-native-paper';

const Splash: React.FC = () => {
  const navigation = useNavigation();
  
  const user = useSelector(state => state.userReducer)
  const api = useMemo(() => new IdmApi(), [user.access_token])

  useEffect(() => {
    setTimeout(() => {
      if (user.loggedIn) {
        
      // NavigationService.replace("MainApp")
      checkAppVersionUpgrade();
      } else {
        NavigationService.replace("Login")
      }
    }, 1000)
  }, [])

  const checkAppVersionUpgrade = async () => {
    /*
    This method will check the app upgrade API and if upgraded verson found then it will show a popup to user 
    to upgrade the application.
    If high priority then it will not allow to navigate away, if low priority then it will add skip button.
    */
    let appId = DeviceInfo.getBundleId()
    let versionNumber = DeviceInfo.getSystemVersion()
    let codeName = await DeviceInfo.getCodename()
    
    console.log(codeName)
    api.checkAppUpdates(appId).then(res => {
      console.log(res.data.results,"hello")
      if (res.data.results) {
        let filtered = res.data.results.filter((item: any) => item?.asset_attributes?.active == 'yes' && item?.asset_attributes?.code_name == codeName)
        if (filtered) {
          let appUpdate = filtered[0];
          let cloudVersion = appUpdate?.asset_attributes?.version;
          let cloudLink = appUpdate?.asset_attributes?.download_url;
          let priority = appUpdate?.asset_attributes?.priority;
          if (cloudVersion > versionNumber) {
            Alert.alert("App Update required", "A new app version released, please download and install to continue.", [{
              text: "Download Update",
              onPress: () => {
                Linking.openURL(cloudLink);
                RNExitApp.exitApp();       
              }
            }, priority != 'high' ? {
              text: "Skip Update",
              onPress: () => {
                NavigationService.replace("MainApp")
              }
            } : null as any])
            return;
          }
        }
      }
      NavigationService.replace("MainApp") 
    }).catch(err => {
      console.log(err);
     
      NavigationService.replace("MainApp")
    })
  }
  return (
    <View style={styles.container}>
      <Image
        style={{
          width: wp(50),  
          height: wp(20), 
          marginTop: wp(20),
          marginLeft: wp(0),
          justifyContent: 'center',
          resizeMode: 'contain'
        }}
        source={images.Splashlogo1}
      />
      <ActivityIndicator/>
    </View>
  );
};

export default Splash;