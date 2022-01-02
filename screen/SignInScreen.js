import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  ToastAndroid,
  AlertIOS,
  ImageBackground,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import SocialButton from '../components/SocialButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';

import * as CONSTANT from '../constant/constant';

const SignInScreen = ({navigation}) => {
  const {colors} = useTheme();
  const [user, setUser] = useState({});
  const init = {
    email: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidPassword: true,
    isValidUser: true,
  };
  const [data, setData] = React.useState(init);
  useEffect(() => {
    // getData();
    GoogleSignin.configure({
      webClientId:
        '827513774065-0mu7j4p3arcgtq24el259rb3sgauk7es.apps.googleusercontent.com',
      androidClientId:
        '827513774065-f809hpgg65l32urrrrau0t1e96pu3a13.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
      scopes: ['profile', 'email'],
    });

    isSignedIn();
  }, []);

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('email');
  //     return jsonValue != null ? navigation.navigate('Main') : null;
  //   } catch (e) {
  //     console.log(error);
  //   }
  // };

  const textInputChange = val => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    if (reg.test(val) === true) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
        isValidUser: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
        isValidUser: false,
      });
    }
    if (val.trim().length < 1) {
      setData({
        ...data,
        isValidUser: true,
      });
    }
  };
  const showmsg = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };

  const handlePasswordChange = val => {
    if (val.trim().length >= 6) {
      setData({
        ...data,
        password: val,
        isValidPassword: true,
      });
    } else {
      setData({
        ...data,
        password: val,
        isValidPassword: false,
      });
    }
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };
  const storeData = async (email, name) => {
    try {
      const Email = JSON.stringify(email);
      await AsyncStorage.setItem('email', Email);
      const Name = JSON.stringify(name);
      await AsyncStorage.setItem('name', Name);
    } catch (e) {
      showmsg(e);
    }
  };
  const SignInUser = async data => {
    try {
      await CONSTANT.API.post('/user/signin', data)
        .then(response => {
          if (response.data.sucess) {
            console.log("response: ",response.data)
            
            showmsg('User signed in!');
            setData(init);
            navigation.navigate('Main');
          } else {
            showmsg(response.data.message);
          }
        })
        .catch(error => console.log(error.message));
    } catch (error) {
      console.log(error.message);
    }
  };
  const SignInWithemail = () => {
    if (data.email.trim().length < 1) {
      showmsg('Please Enter email');
    } else if (data.isValidUser === false) {
      showmsg('Please Enter Valid email');
    } else if (data.password.trim().length < 1) {
      showmsg('Please Enter Password');
    } else if (data.isValidPassword === false) {
      showmsg('Please Enter Valid Password');
    } else {
      if (Platform.OS === 'android') {
        SignInUser({
          email: data.email.toLowerCase(),
          password: data.password,
          type: 'manual',
        });
      } else {
        // implementation for IOS
      }
    }
  };
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      console.log(error.message);
    }
  };
  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo();
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('edit__', userInfo);
      setUser(userInfo);
    } catch (error) {
      console.log('CurrentError: ', error);
    }
  };

  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={
        (styles.container, {width: '100%', height: '100%', resizeMode: ''})
      }>
      <StatusBar backgroundColor="#db2233" barStyle="light-content" />
      <Animatable.View style={styles.header} animation="fadeInDownBig">
        <Text style={{fontSize:50, color: "#fff", textAlign: 'center'}}>Login</Text>
      </Animatable.View>
      <Animatable.View animation="fadeInUpBig" style={[styles.footer]}>
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
            },
          ]}>
          Email
        </Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Email"
            placeholderTextColor="#666666"
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            autoCapitalize="none"
            onChangeText={val => textInputChange(val)}
            value={data.email}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>
        {data.isValidUser ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>email is not Valid.</Text>
          </Animatable.View>
        )}
        <Text
          style={[
            styles.text_footer,
            {
              color: colors.text,
              marginTop: 35,
            },
          ]}>
          Password
        </Text>
        <View style={styles.action}>
          <Feather name="lock" color={colors.text} size={20} />
          <TextInput
            placeholder="Your Password"
            placeholderTextColor="#666666"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={[
              styles.textInput,
              {
                color: colors.text,
              },
            ]}
            value={data.password}
            autoCapitalize="none"
            onChangeText={val => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
              <Feather name="eye" color="#000" size={20} />
            )}
          </TouchableOpacity>
        </View>
        {data.isValidPassword ? null : (
          <Animatable.View animation="fadeInLeft" duration={500}>
            <Text style={styles.errorMsg}>
              Password must be 6 characters long.
            </Text>
          </Animatable.View>
        )}

        <TouchableOpacity>
          <Text style={{color: '#009387', marginTop: 15}}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <View style={styles.button}>
          <TouchableOpacity
            style={styles.signIn}
            onPress={() => SignInWithemail()}>
            <LinearGradient
              colors={['#C0392B', '#db2233']}
              style={styles.signIn}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: '#fff',
                  },
                ]}>
                Sign In
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignupScreen')}
            style={[
              styles.signIn,
              {
                borderColor: '#160d22',
                borderWidth: 1,
                marginTop: 15,
              },
            ]}>
            <Text
              style={[
                styles.textSign,
                {
                  color: '#000',
                },
              ]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        {Platform.OS === 'android' ? (
          <View>
            <SocialButton
              buttonTitle="Sign In with Google"
              btnType="google"
              color="#de4d41"
              backgroundColor="#fff"
              onPress={() => signIn()}
            />
          </View>
        ) : null}
      </Animatable.View>
    </ImageBackground>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4d2e33',
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_header: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 30,
  },
  text_footer: {
    color: '#05375a',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
