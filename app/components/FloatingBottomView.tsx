import React, { useEffect, useState } from 'react';
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

import images from '../config/images';
import NavigationService from '../navigation/NavigationService';
import { Button as PButton } from 'react-native-paper';

interface Props {
  notification?: String,
 
}

const FloatingBottomView: React.FC<Props> = ({
  notification,
}) => {
  return (
    <>
      {/*
      <View style={styles.cardBottomView}>

        <TouchableOpacity onPress={() => NavigationService.navigate('Home')} style={styles.notificationButton}>
          <Image
            resizeMode='center'
            style={{ height: 50, width: 50 }}
            source={images.notificationIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => NavigationService.navigate('Home')} style={styles.helpButton}>
          <Image
            resizeMode='center'
            style={{ height: 50, width: 50 }}
            source={images.helpIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => NavigationService.navigate('Home')} style={styles.profileButton}>
          <Image
            resizeMode='center'
            style={{ height: 50, width: 50 }}
            source={images.profileBottomIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => NavigationService.navigate('Settings')} style={styles.settingButton}>
          <Image
            resizeMode='center'
            style={{ height: 50, width: 50 }}
            source={images.SettingIcon}
          />
        </TouchableOpacity>

  </View> */}
    </>
  );
};

export default FloatingBottomView;




const styles = StyleSheet.create({
  cardOuterView:
  {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 0.1,
    position: 'absolute',
    justifyContent: 'space-around',
    marginLeft: 10,
    marginRight: 20,
    bottom: 30,
  },
  cardBottomView:
  {
    backgroundColor: '#fff',
    width: '90%',
    height: 55,
    //borderRadius: 10,
    //padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',


    shadowOpacity: 0.3,
    elevation: 5,
    borderRadius: 70,
    position: 'absolute',
    bottom: 30,
    marginLeft: 20,
    marginRight: 20,
    padding: 30,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,



  },
  helpButton:
  {
    width: 50,
    height: 50,
    marginTop: -25,
  },
  profileButton:
  {
    width: 50,
    height: 50,
    marginTop: -25,
  },
  settingButton:
  {
    width: 50,
    height: 50,
    marginTop: -25,
    marginRight: -20,
  },
  notificationButton:
  {
    width: 50,
    height: 50,
    marginTop: -25,
    marginLeft: -20,
  },
  header: {
    flexDirection: "row",
    height: 80,
    marginTop: 25,
    backgroundColor: 'white'
  },


})



