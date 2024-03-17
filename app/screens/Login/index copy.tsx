import React, {useState, useRef, useMemo, useEffect} from 'react';
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
import {setCurrentUser} from '../../redux/user/actions';
import {useSelector} from '../../redux';
import OutlineTextinput from '../../components/OutlineTextinput';
const Login: React.FC<any> = ({navigation}) => {
  const pwdRef: any = useRef(null);
  const dispatch = useDispatch();
  const userReducer = useSelector(state => state.userReducer);
  const [isConnected, setIsConnected] = useState<null | boolean>(null);
  const [showConnectedMessage, setShowConnectedMessage] = useState(false);
  
  const [secure, setSecure] = useState(true);
  const [emailAddressTxt, setEmailAddressTxt] = useState('');
  const [emailerror, setemailerror] = useState<string>('');
  const [passworderror, setpassworderror] = useState<string>('');
  const [passwordTxt, setPasswordTxt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const api = useMemo(() => new IdmApi(), [userReducer.access_token]);

  const onLogin = () => {
    if (emailAddressTxt === '') {
      setemailerror('Username is required');
    } else if (passwordTxt === '') {
      setpassworderror('Password is required');
    } else {
      setIsLoading(true);
      console.log({
        username: emailAddressTxt,
        password: passwordTxt,
      });
      api
        .login({
          username: emailAddressTxt,
          password: passwordTxt,
        })
        .then(res => {
          // getUserRoles(res);
          console.log(res)
          dispatch(
            setCurrentUser({
              ...res.data,
              loggedIn: true,
              user_roles: {
                user_permissions: res.data.user_roles.user_permissions,
                user_roles: res.data.user_roles.user_roles,
              },
            }),
          );
          if (res.data.user.status === false) {
            NavigationService.navigate('UserApp', {
              screen: 'Changepassword',
            });
            console.log(res)
          } else {
        NavigationService.replace('MainApp');
           
          }
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
          showMessage('Invalid login details. Try again.');
        });
    }
  };

  const getUserRoles = (res: any) => {
    api
      .getUserRoles(res.data.access_token)
      .then(res2 => {
        dispatch(
          setCurrentUser({
            ...res.data,
            loggedIn: true,
            user_roles: {
              user_permissions: res.data.user_roles.user_permissions,
              user_roles: res.data.user_roles.user_roles,
            },
          }),
        );
        setIsLoading(false);
        NavigationService.replace('MainApp');
      })
      .catch(err => {
        console.log(err);
      });
  };

  const checkPasswordRegex = (text: string) => {
    var regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    console.log('regex value', regex.test(text));
    if (regex.test(text)) {
      return true;
    }

    return false;
  };

  const resetFields = () => {
    setEmailAddressTxt('');
    setPasswordTxt('');
  };

  const emailAddress = (value: any) => {
    setEmailAddressTxt(value);
    setemailerror('')
    
  };
  const password = (value: any) => {
    setPasswordTxt(value);
    setpassworderror('')
  };
  const hidPassowrd = () => {
    if (secure == false) {
      setSecure(true);
    } else {
      setSecure(false);
    }
  };
  const forgotPasswordBtn = () => {
    NavigationService.navigate('VerifyEmail');
  };

  const showMessage = (message: string) => {
    setTimeout(() => {
      Alert.alert('', message);
    }, 100);
  };

  return (
    <View style={styles.container}>
      
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.logs}>
          <Image style={styles.logoImg} source={images.Splashlogo} />
        </View>

        <OutlineTextinput
          mode="outline"
          txtStyle={styles.emailTxt}
          onChangeText={emailAddress}
          placeHolder={'Username'}
          showRightButton={false}
          isSecure={false}
          values={emailAddressTxt}
          returnKeyType="next"
          onSubmitEditing={() => pwdRef.current.focus()}
          otherProps={{
            textContentType: 'username',
          }}
     
        />
        {emailerror && (
          <Text style={styles.validText}>This field is required
          <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
        )}
        <View style={styles.passwordContainer}>
          <TextInput
            mode="outlined"
            theme={{
              ...DefaultTheme,
              colors: {
                ...DefaultTheme.colors,
                text: AppStyle.color.COLOR_BLACK,
                primary: AppStyle.color.COLOR_GREY,
                background: AppStyle.color.COLOR_WHITE,
              },
            }}
            label="Password"
            ref={pwdRef}
            selectionColor="#000"
            style={styles.pwdTxt}
            textContentType="password"
            secureTextEntry={secure}
            placeholder={'Password'}
            value={passwordTxt}
            onChangeText={password}
            testID="password"
          />
          <TouchableOpacity
            style={styles.password}
            onPress={() => {
              setSecure(prev => !prev);
            }}>
            {secure ? (
              <Icon name="eye-off" size={25} color="#2B83D5" />
            ) : (
              <Icon name="eye" size={25} color="#2B83D5" />
            )}
          </TouchableOpacity>
        </View>
        {passworderror && (
          <Text style={styles.validText}>This field is required
           <Text style={styles.requiredAsterisk}>*</Text>
          </Text>
        )}

        <SubmitNormalButton
          loading={isLoading}
          title={'Sign In'}
          btnStyle={styles.btnStyle}
          onPress={onLogin}
        
        />

<View style={{marginTop:100,alignItems: 'center'}}>
        {/* {isConnected === null ? (
          <Text style={{color:"blue"}}>Checking internet connection...</Text>
        ) : isConnected ? (
          <Text style={{color:"green",fontSize:16,fontWeight:"bold"}}>{showConnectedMessage ? 'Connected to the Internet!' : ''}</Text>
        ) : (
          <Text style={{color:"red"}}>No Internet Connection</Text>
        )} */}
      </View>
      </KeyboardAwareScrollView>

     
    </View>
  );
};

export default Login;