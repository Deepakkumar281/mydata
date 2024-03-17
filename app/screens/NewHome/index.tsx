import React, {useState, useMemo, useEffect} from 'react';
import {View, ScrollView, TouchableHighlight, Image, PermissionsAndroid, ActivityIndicator} from 'react-native';
import {Button, Card, IconButton, Text} from 'react-native-paper';
import {useSelector} from '../../redux';
import {useDispatch} from 'react-redux';
import styles from './styles';
import NavigationService from '../../navigation/NavigationService';
import TemplateApi from '../../services/template';
import {ListResponse} from '../../models/common/listResponse';
import {useRoute} from '@react-navigation/native';
import {setScreenUpdated} from '../../redux/screen/actions';
import images from '../../config/images';
import LinearGradient from 'react-native-linear-gradient';
import * as Animatable from 'react-native-animatable';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import { Notifier, NotifierComponents } from 'react-native-notifier';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const SCREEN_NAME = 'LIST_TEMPLATES';
const NewHome: React.FC<any> = ({navigation}) => {
  const user = useSelector(state => state.userReducer);
  const screen = useSelector(state => state.screenReducer);
  const [isLoading, setIsLoading] = useState(true);
  const templateApi = useMemo(() => new TemplateApi(), [user.loggedIn]);
  const [data, setData] = useState<ListResponse<any>>();

  const [data2, setData2] = useState<any>([]);
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Camera Permission",
          message: "App needs access to your camera.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission granted");
        // Continue with the logic that requires camera access here
      } else {
        console.log("Camera permission denied");
        // Handle the case where permission is denied
      }
    } catch (error) {
      console.error("Error requesting camera permission:", error);
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!state.isConnected || (state.type === 'cellular' && state.strength && state.strength < 2)) {
        setOffline(true);
        Notifier.showNotification({
          title: 'Offline Mode',
          description: 'Your network connection is weak or offline.',
          Component: NotifierComponents.Alert,
          duration: 2000,
          componentProps: {
            alertType: 'error',
          },
        });
      } else {
        setOffline(false);
        // Hide offline notification if the network is back online
        Notifier.hideNotification();
      }
    });
  
   return () => {
     unsubscribe();
   };
 }, []);
  const previewForm = (formId: number) => {
    NavigationService.navigate('UserApp', {
      screen: 'TemplateSubmitForm',
      params: {
        formId,
      },
    });
  };

  const dispatch = useDispatch();
  const route = useRoute<any>();

  useEffect(() => {
    navigation.closeDrawer();
    if (screen.screenName === SCREEN_NAME) {
      onAdded();
      dispatch(setScreenUpdated(''));
    }
  }, [screen.screenName]);

  const onAdded = () => {
    loadTemplates();
  };

  useEffect(() => {
    navigation.closeDrawer();
    if (user.loggedIn) loadTemplates();
  }, [user.loggedIn]);
  useEffect(() => {
    navigation.closeDrawer();
  }, []);
  const loadTemplates = () => {
    console.log('Loading started');

    setIsLoading(true);
    setData({} as any);
    templateApi
      .userdata()
      .then(res => {
        console.log('Loading end', res);
        setData(res.data);
        setData2(res.data.results);
        setIsLoading(false);
      })
      .catch(err => {
        console.log('Loading error');
        console.log(err);
        setIsLoading(false);
      });
  };
  const openDrawer = () => {
    navigation.openDrawer(); // Open the drawer
  };
  const adminMenu = () => {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.cardview}>
          {user?.user_roles?.user_permissions?.CSFormSubmission?.includes('view') && (
            <View style={styles.style1}>       
                <Animatable.View
    animation="rotate"
    iterationCount="infinite"
    duration={6000}
    easing="linear"
    style={{
      position: 'absolute',
      width: 100,
      height: '130%',
      zIndex: 0,
    }}
  >
    <LinearGradient
      colors={['rgb(0, 183, 255)', 'rgb(255, 48, 255)']}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  </Animatable.View>
  <View style={styles.style2} />

                {/* <Card style={styles.card}> */}
                <TouchableHighlight
                underlayColor="transparent"
                onPress={() =>
                  NavigationService.navigate('UserApp', {
                    screen: 'Checklist',
                  })
                }
               >
                  <Image
                    resizeMode="contain"
                    source={images.Checklisticon}
                    style={{height: 85, width: 60}}
                  />
                {/* </Card> */}
              </TouchableHighlight>

              <Text style={{textAlign: 'center'}}>CheckList</Text>
            </View>
               )} 
            <View style={styles.style1}>       
                <Animatable.View
    animation="rotate"
    iterationCount="infinite"
    duration={6000}
    easing="linear"
    style={{
      position: 'absolute',
      width: 100,
      height: '130%',
      zIndex: 0,
    }}
  >
    <LinearGradient
      colors={['rgb(0, 183, 255)', 'rgb(255, 48, 255)']}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  </Animatable.View>
  <View style={styles.style2} />

                {/* <Card style={styles.card}> */}
                <TouchableHighlight
                underlayColor="transparent"
                onPress={() =>
                  NavigationService.navigate('UserApp', {
                    screen: 'Changepassword',
                  })
                }
               >
                  <Image
                    resizeMode="contain"
                    source={images.img_placeHolder}
                    style={{height: 85, width: 60}}
                  />
                {/* </Card> */}
              </TouchableHighlight>

              <Text style={{textAlign: 'center'}}>Profile</Text>
            </View>
            
          </View>
          <View style={styles.cardview1}>
          
          
            <View style={styles.style1}>
            
            <Animatable.View
animation="rotate"
iterationCount="infinite"
duration={6000}
easing="linear"
style={{
  position: 'absolute',
  width: 100,
  height: '130%',
  zIndex: 0,
}}
>
<LinearGradient
  colors={['rgb(0, 183, 255)', 'rgb(255, 48, 255)']}
  style={{
    width: '100%',
    height: '100%',
  }}
/>
</Animatable.View>
{/* <View style={styles.style} /> */}
<View style={styles.style2} />

            {/* <Card style={styles.card}> */}
            <TouchableHighlight
            underlayColor="transparent"
            onPress={() =>
              NavigationService.navigate('UserApp', {
                screen: 'actiontracker',
              })
            }
           >
  <View style={styles.imageContainer}>
              <Image
                resizeMode="contain"
                source={images.tracker}
                style={{height: 85, width: 60}}
              />
              </View>
            {/* </Card> */}
          </TouchableHighlight>

          <Text style={{textAlign: 'center'}}>Action Tracker</Text>
        </View>
          
          </View>
         
        </ScrollView>
      </View>
    );
  };
  const renderMenu = () => {
    return adminMenu();
  };

  return (
    <>
    <View style={styles.container}>
  <View style={{flex: 1}}>
    {/* <View style={{ backgroundColor: '#e7edfb' ,flex: 0,marginTop:20}}>
  <IconButton
  icon="menu"
  onPress={openDrawer}
  color="#000"
  size={30}
 
/>
</View> */}
    {renderMenu()}
  </View>
  {offline && (
      <View>
      <View style={{ backgroundColor: 'red', padding: 10 ,flexDirection:'row',justifyContent:'center'}}>
         
     <MaterialCommunityIcons
                                    name="alert-circle"
                                    size={20}
                                    color="black"
                                  />
        <Text style={{ color: 'white' }}>Offline: Your network is weak or offline</Text>
        </View>
       
      </View>
    )}
  <View style={{flex: 0, backgroundColor: '#191970', height: 20}}>
    <Text style={{textAlign: 'center', color: 'white'}}>
      Powered by TechGenzi Private Limited
    </Text>
  </View>
</View>

    </>
  );
};

export default NewHome;
