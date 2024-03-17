import React, { useEffect, useState } from 'react';
import AppStyle from '../config/styles';
import {
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Button,
  SafeAreaView, StatusBar
} from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import images from '../config/images';
import NavigationService from '../navigation/NavigationService';
import { Button as PButton } from 'react-native-paper';


interface ButtonProps {
  title: string;
  showNotification?: boolean;
  showBack?: boolean;
  showClose?: boolean;
  showBottomLIne?: boolean;
  showMenu?: boolean;
  showProfileIcon?: boolean;
  
}

const Header: React.FC<ButtonProps> = ({
  title,
  showNotification = false,
  showBack = false,
  showClose = false,
  showBottomLIne = false,
  showMenu = false,
  showProfileIcon = false,
}) => {
  const navigation: any = useNavigation();
  
  return (
    <>
      <StatusBar backgroundColor={'#fff'} barStyle='dark-content' />
     
      <View style={styles.cardView}>
        <View
          style={[
            styles.header
          ]}
        >
          {/* Left */}
          <View style={{ flex: showProfileIcon ? 0.3 : 0.2, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
              style={styles.headerMenuButton}>
              <Image
                resizeMode='contain'
                style={{ height: 20, width: 20 }}
                source={images.rightMenuIcon}
              />
            </TouchableOpacity>
            {showBack &&
              <TouchableOpacity onPress={() => NavigationService.goBack()}
                style={styles.headerBackButton}>
                <Image
                  resizeMode='contain'
                  style={{ height: 20, width: 20 }}
                  source={images.redArrowIcon}
                />
              </TouchableOpacity>
            }
            {showProfileIcon &&
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => NavigationService.goBack()}
                  style={[styles.headerBackButton, { justifyContent: 'center' }]}>
                  <Image
                    resizeMode='contain'
                    style={{ height: 40, width: 40, marginLeft: 10 }}
                    source={images.profileIcon}
                  />

                </TouchableOpacity>
                <Text style={styles.welcomeTxt}>hi max!</Text>
              </View>

            }
          </View>

          {/* Middle */}
          <View style={{ flex: showProfileIcon ? 0.5 : 0.6 }}>
            <Text style={styles.title}>{title}</Text>
          </View>

          {/* Right */}
          <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'flex-end' }}>
            <View style={styles.headerRight}>
              <TouchableOpacity>
                <Text style={styles.EngTxt}>SGD ENG</Text>
              </TouchableOpacity>
              <Image
                style={styles.logoImg} source={images.Logo}
              />
            </View>
          </View>

        </View >
      </View >
      {/* </SafeAreaView > */}
    </>
  );
};

export default Header;


const styles = StyleSheet.create({
  cardView:
  {
    //backgroundColor: '#2E9298',
    //borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 2,
    shadowOpacity: 0.1

  },
  header: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    marginTop: 20,
    paddingHorizontal: 10,
    // backgroundColor: 'yellow'
    backgroundColor: '#fff'
  },
  headerBackArrow: {
    //flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row'

  },
  title: {
    color: AppStyle.color.COLOR_BLACK,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: AppStyle.fonts.FONT_MEDIUM,
  },
  headerTxt:
  {
    color: AppStyle.color.GRADIENT_TOP,
    textAlign: 'center',
    fontSize: 14,
    marginLeft: 10,
    fontFamily: AppStyle.fonts.FONT_MEDIUM,
  },
  welcomeTxt:
  {
    color: AppStyle.color.GRADIENT_TOP,
    textAlign: 'center',
    fontSize: 10,
    marginLeft: 15,
    fontFamily: AppStyle.fonts.FONT_REGULAR,
  },
  headerMenuButton: {
    height: 25,
    width: 25,
    justifyContent: "center",
    alignItems: "center",
    // marginLeft: 10,
  },
  headerBackButton: {
    height: 25,
    width: 25,
    // justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
    //marginTop:25,
  },
  EngTxt:
  {
    textAlign: 'center',
    color: '#797979',
    fontSize: 8,
    fontFamily: AppStyle.fonts.FONT_REGULAR,
    marginRight: 10
  },
  headerRight: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'row',
  },
  logoImg: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  topView: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

})



