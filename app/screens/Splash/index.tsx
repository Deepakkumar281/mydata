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

const Splash: React.FC = () => {
  const navigation = useNavigation();
  
  const user = useSelector(state => state.userReducer)
  const api = useMemo(() => new IdmApi(), [user.access_token])

  useEffect(() => {
    setTimeout(() => {
      if (user.loggedIn) {
        
        checkAppVersionUpgrade();

      } else {
        NavigationService.replace("Login")
      }
    }, 1000)
  }, [])

  const checkAppVersionUpgrade = async () => {
    let appId = DeviceInfo.getBundleId()
    let versionNumber = Number(DeviceInfo.getVersion().split(".")[2])
    //let versionNumber= DeviceInfo.getBuildNumber()
    let codeName = await DeviceInfo.getCodename()
    console.log(versionNumber, "sys version")
    console.log(codeName)
    api.checkAppUpdates(appId).then(res => {
      if (res.data.results) {
        let filtered = res.data.results.filter((item: any) => item?.asset_attributes?.active == 'Yes' && item?.asset_attributes?.code_name == codeName)
        if (filtered) {
          let appUpdate = filtered[0];
          let cloudVersion = appUpdate?.asset_attributes?.version;
          let cloudLink = appUpdate?.asset_attributes?.download_url;
          let priority = appUpdate?.asset_attributes?.priority;
          if (cloudVersion > Number(versionNumber)) {
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
    {/* <Text style={{ fontSize:25,color:'#79E5EA'}}>
      MeghaTravels
    </Text>*/}
   {/* <Image
      // style={{ height:135,justifyContent: 'center',width:'100%' }}
      
      // source={images.Splashlogo1}
      source={images.Splashlogo}  

      /> */}
       <Image
        
        // source={images.Splashlogo1}
        source={images.Splashlogo}  
      />
       {/* <Image
                                            source={require('../image/splash.gif')}
                                            // style={styles.placeholderImg1}
                                            // style={{ height:600,justifyContent: 'center',width:'100%',marginTop:50 }}
                                          /> */}
                                        


  </View>
  );
};

export default Splash;