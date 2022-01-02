import React, {useState, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import {useTheme} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import * as CONSTANT from '../constant/constant.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ToastAndroid,
} from 'react-native';
const join_class = ({navigation}) => {
  const data = {member: online, code: ''};
  const [online, setOnline] = useState('');
  const [classcodeJ, setClasscodeJ] = useState('');
  const {colors} = useTheme();
  useEffect(() => {
    getEmail();
  }, []);
  const getEmail = async () => {
    try {
      let jsonValue = await AsyncStorage.getItem('email');
      if (jsonValue !== null) {
        jsonValue = JSON.parse(jsonValue);
        setOnline(jsonValue);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const classlinkinput = val => {};
  const showmsg = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };

  const codeJoin = () => {
    data.code = classcodeJ;
    data.member = online;
    CONSTANT.API.post('/code', data)
      .then(response => {
        showmsg('You are added');
        navigation.navigate('Room');
      })
      .catch(error => console.log(error));
    setClasscodeJ('');
  };
  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.text_footer,
          {
            color: colors.text,
            marginTop: 35,
          },
        ]}>
        Join Class with Code
      </Text>
      <View style={styles.button}>
        <TextInput
          placeholder="Enter Class Code"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          autoCapitalize="none"
          value={classcodeJ}
          onChangeText={setClasscodeJ}
        />
        <View>
          <TouchableOpacity onPress={() => codeJoin()}>
            <LinearGradient
              colors={['#4d2e33', '#d7a083']}
              style={styles.signIn}>
              <Text style={{fontSize: 25, color: '#fff'}}>Join Class</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={[
          styles.text_footer,
          {
            color: colors.text,
            marginTop: 35,
          },
        ]}>
        Join Class with link
      </Text>
      <View style={styles.button}>
        <TextInput
          placeholder="Enter Class link"
          placeholderTextColor="#666666"
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
          ]}
          autoCapitalize="none"
          onChangeText={val => classlinkinput(val)}
        />
        <LinearGradient colors={['#4d2e33', '#d7a083']} style={styles.signIn}>
          <Text style={{fontSize: 25, color: '#fff'}}>Join Class</Text>
        </LinearGradient>
      </View>
      {/* <TouchableOpacity onPress={() => displayrequest()}>
        <View style={styles.button}>
          <MaterialIcons
            name={data.arrow_request ? "keyboard-arrow-right" : "keyboard-arrow-down"}
            color="#000000"
            size={35}
          />
          <Text style={styles.request_style}>Requests</Text>
        </View>
      </TouchableOpacity>
      {data.arrow_request ? null :
        <Animatable.View
          animation="slideInLeft" >
          <Text style={styles.textassign}>No Request</Text>
        </Animatable.View>
      } */}
    </View>
  );
};
export default join_class;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingRight: 20,
  },

  textassign: {
    fontSize: 20,
    paddingLeft: 50,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderRadius: 50,
    borderColor: '#ECECEC',
    paddingBottom: 10,
  },
  button: {
    alignItems: 'flex-start',
    marginTop: 50,
    flexDirection: 'row',
    paddingLeft: 10,
  },

  request_style: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  text_footer: {
    color: '#05375a',
    fontSize: 25,
    paddingLeft: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
});
