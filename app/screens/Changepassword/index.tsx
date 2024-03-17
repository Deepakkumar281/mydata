import React, {useState, useRef, useMemo} from 'react';
import {View, Image, TouchableOpacity, Alert, Text} from 'react-native';
import {TextInput, DefaultTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import NavigationService from '../../navigation/NavigationService';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useDispatch} from 'react-redux';
import styles from './styles';
import AppStyle from '../../config/styles';
import images from '../../config/images';
import SubmitNormalButton from '../../components/SubmitNormalButton';
import IdmApi from '../../services/auth';
import {useSelector} from '../../redux';
import {Notifier, NotifierComponents} from 'react-native-notifier';
const Changepassword: React.FC<any> = ({navigation}) => {
  const pwdRef: any = useRef(null);
  const [secure, setSecure] = useState(true);
  const [secure1, setSecure1] = useState(true);
  const [secure2, setSecure2] = useState(true);
  const [emailAddressTxt, setEmailAddressTxt] = useState('');
  const [Curpasserror, setCurpasserror] = useState(false);
  const [Npasserror, setNpasserror] = useState(false);
  const [Copasserror, setCopasserror] = useState(false);
  const [passwordnot_error, setpasswordnot_error] = useState(false);
  const [passwordTxt, setPasswordTxt] = useState('');
  const [currentpasswordTxt, setCurrentPasswordTxt] = useState('');
  const [newpasswordTxt, setNewPasswordTxt] = useState('');
  const [confirmpasswordTxt, setConfirmPasswordTxt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userReducer);
  const api = useMemo(() => new IdmApi(), [user.access_token]);
  const templateApi = useMemo(() => new IdmApi(), [user.loggedIn]);
  const [profileImgUrl] = useState('');
  const onLogin = () => {
    if (currentpasswordTxt === '') {
      setCurpasserror(true);
    } else if (newpasswordTxt === '') {
      setNpasserror(true);
    } else if (confirmpasswordTxt === '') {
      setCopasserror(true);
    } else if (newpasswordTxt !== confirmpasswordTxt) {
      setpasswordnot_error(true);
    } else if (currentpasswordTxt === newpasswordTxt) {
      Alert.alert(
        'Alert',
        'Current password and new password cannot be the same.',
      );
    } else {
      setIsLoading(true);
      api
        .changepassword({
          old_password: currentpasswordTxt,
          password: newpasswordTxt,
          status: true,
          reset_status: false,
        }
        // user.access_token
        )
        .then(res => {
          console.log(res)
          if (res.data.success) {
            setIsLoading(false);
            Notifier.showNotification({
              title: 'Password changed successfully.',
              Component: NotifierComponents.Alert,
              duration: 2000,
              componentProps: {
                alertType: 'success',
              },
            });
            NavigationService.replace('Auth', {
              screen: 'Login',
            });
          } else {
            setIsLoading(false);
            showMessage('Invalid old password. Try again.');
          }
          console.log(res.data);
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
          showMessage('Something went wrong. Try again.');
        });
      resetFields();
    }
  };
  const resetFields = () => {
    setEmailAddressTxt('');
    setPasswordTxt('');
  };

  const showMessage = (message: string) => {
    setTimeout(() => {
      Alert.alert('', message);
    }, 200);
  };
  return (
    <View style={styles.container}>
       <View style={{ flexDirection: 'row' }}>
       <View>
                            {profileImgUrl !== '' && profileImgUrl !== null && profileImgUrl !== undefined ?
                                <TouchableOpacity style={[styles.centerFlex, { height: 30, width: 30, borderRadius: 50 }]}
                                    onPress={() => NavigationService.navigate("AccountInfo")}>
                                    <Image
                                        resizeMode='cover'
                                        source={{ uri: profileImgUrl }}
                                        style={{ height: 30, width: 30, borderRadius: 50 }}
                                    />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity style={[styles.centerFlex, { height: 65, width: 65, borderRadius: 50 }]}
                                    onPress={() => NavigationService.navigate("AccountInfo")}>
                                    <Image
                                        resizeMode='cover'
                                        source={images.img_placeHolder}
                                        style={{ height: 40, width: 40, borderRadius: 50 }}
                                    />
                                </TouchableOpacity>
                            }

                        </View>
                        <View style={[styles.centerFlex,]}>
                        <Text style={styles.nameTxt}>
  {user.user.firstname &&          user.user.lastname
    ? `${user.user.firstname || ''} ${user.user.lastname || ''}`
    : ''}
</Text>
                            {/* <Text style={styles.degreeTxt}>{user.user.username}</Text> */}
                        </View>
                        </View>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.logs}>
          <Image style={styles.logoImg} source={images.Splashlogo} />
        </View>

        <View style={styles.passwordContainer}>
          <TextInput
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                text: AppStyle.color.COLOR_BLACK,
                primary: AppStyle.color.COLOR_GREY,
                background: AppStyle.color.COLOR_WHITE,
              },
            }}
            label="Current Password"
            ref={pwdRef}
            selectionColor="#000"
            style={styles.pwdTxt}
            textContentType="password"
            secureTextEntry={secure}
            placeholder={'Current Password'}
            value={currentpasswordTxt}
            onChangeText={(value: any) => {
              setCurrentPasswordTxt(value.trim());
              setCurpasserror(false);
            }}
          />
          <TouchableOpacity
            style={styles.password}
            onPress={() => {
              setSecure(prev => !prev);
            }}>
            {secure ? (
              <Icon name="eye-off" size={25} color={'#2B83D5'} />
            ) : (
              <Icon name="eye" size={25} color={'#2B83D5'} />
            )}
          </TouchableOpacity>
        </View>
        {Curpasserror && (
          <Text style={styles.validText}>This field is required</Text>
        )}
        <View style={styles.passwordContainer}>
          <TextInput
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                text: AppStyle.color.COLOR_BLACK,
                primary: AppStyle.color.COLOR_GREY,
                background: AppStyle.color.COLOR_WHITE,
              },
            }}
            label="New Password"
            ref={pwdRef}
            selectionColor="#000"
            style={styles.pwdTxt}
            textContentType="password"
            secureTextEntry={secure1}
            placeholder={'New Password'}
            value={newpasswordTxt}
            onChangeText={(value: any) => {
              setNewPasswordTxt(value.trim());
              setNpasserror(false);
            }}
          />
          <TouchableOpacity
            style={styles.password}
            onPress={() => {
              setSecure1(prev => !prev);
            }}>
            {secure1 ? (
              <Icon name="eye-off" size={25} color={'#2B83D5'} />
            ) : (
              <Icon name="eye" size={25} color={'#2B83D5'} />
            )}
          </TouchableOpacity>
        </View>
        {Npasserror && (
          <Text style={styles.validText}>This field is required</Text>
        )}
        <View style={styles.passwordContainer}>
          <TextInput
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                text: AppStyle.color.COLOR_BLACK,
                primary: AppStyle.color.COLOR_GREY,
                background: AppStyle.color.COLOR_WHITE,
              },
            }}
            label="Confirm Password"
            ref={pwdRef}
            selectionColor="#000"
            style={styles.pwdTxt}
            textContentType="password"
            secureTextEntry={secure2}
            placeholder={'Confirm Password'}
            value={confirmpasswordTxt}
            onChangeText={(value: any) => {
              setConfirmPasswordTxt(value);
              setCopasserror(false);
              setpasswordnot_error(false);
            }}
          />
          <TouchableOpacity
            style={styles.password}
            onPress={() => {
              setSecure2(prev => !prev);
            }}>
            {secure2 ? (
              <Icon name="eye-off" size={25} color={'#2B83D5'} />
            ) : (
              <Icon name="eye" size={25} color={'#2B83D5'} />
            )}
          </TouchableOpacity>
        </View>

        {Copasserror && (
          <Text style={styles.validText}>This field is required</Text>
        )}
        {passwordnot_error && (
          <Text style={styles.validText}>Password not matched</Text>
        )}
        

        <SubmitNormalButton
          loading={isLoading}
          title={'Submit'}
          btnStyle={styles.btnStyle}
          onPress={onLogin}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Changepassword;