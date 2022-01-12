import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
const {width, height} = Dimensions.get('screen');
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CONSTANT from '../constant/constant';

import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';
import {ScrollView} from 'react-native-gesture-handler';

export default function HomeLive() {
  const navigation = useNavigation();
  const [chat, setChat] = useState();
  const [message, setMessage] = useState('');
  const [userOnlineEmail, setuserOnlineEmail] = useState(null);
  const [userOnlineName, setuserOnlineName] = useState(null);
  const messageSend = {
    msg: message,
    username: userOnlineName,
    email: userOnlineEmail,
  };
  useEffect(() => {
    getOnlineUser();
  }, []);
  useFocusEffect(() => {
    if (chat === undefined) {
      fetchChat();
    }
  });
  const fetchChat = async () => {
    try {
      await CONSTANT.API.get(`/chat`)
        .then(response => {
          setChat(response.data);
        })
        .catch(error => console.log(error));
    } catch (e) {
      // Handle error
      console.log(e);
    }
  };

  const getOnlineUser = async () => {
    try {
      if (userOnlineEmail == null || userOnlineName == null) {
        let email = await AsyncStorage.getItem('email');
        let name = await AsyncStorage.getItem('name');

        if (email !== null) {
          setuserOnlineEmail(JSON.parse(email));
          setuserOnlineName(JSON.parse(name));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const createLive = () =>
    navigation.navigate('Live', {type: 'create', channel: uuid()});

  const sendMsg = () => {
    messageSend.msg = message;
    messageSend.username = userOnlineName;
    messageSend.email = userOnlineEmail;

    CONSTANT.API.post('/chat', messageSend)
      .then(
        response => {
          setMessage('');
        },
        error => console.log(error),
      )
      .catch(error => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Livestream App</Text>
      <View style={styles.createContainer}>
        <TouchableOpacity style={styles.button} onPress={createLive}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.chattingWrapper}>
        {chat != undefined
          ? chat.map((item, index) => (
              <View
                key={index}
                style={
                  item.chat.email === userOnlineEmail
                    ? styles.mineChat
                    : styles.othersChat
                }>
                <Text style={styles.username}>{item.chat.username}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.text}>{item.chat.msg}</Text>
                  <Text style={styles.time}>{item.chat.date}</Text>
                </View>
              </View>
            ))
          : null}
      </ScrollView>
      <View
        style={{
          marginHorizontal: 20,
          alignSelf: 'center',
          justifyContent: 'space-around',
          flexDirection: 'row',
        }}>
        <TextInput
          placeholder="Type here.."
          value={message}
          onChangeText={text => setMessage(text)}
          style={{
            width: '80%',
            borderWidth: 0.5,
            padding: 10,
            borderRadius: 10,
            marginRight: 5,
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#160d22',
            width: ' 20%',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}
          disabled={message ? false : true}
          onPress={() => sendMsg()}>
          <Text style={{color: 'white'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '98%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 50,
    color: '#333',
  },
  createContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingTop: 50,
    borderTopWidth: 1,
    borderColor: '#22222255',
  },
  joinChannelInput: {
    backgroundColor: '#cccccc77',
    width: '100%',
    borderRadius: 8,
    paddingHorizontal: 20,
    fontSize: 17,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    marginTop: 15,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#78b0ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },

  profile: {
    width: 40,
    height: 40,
    backgroundColor: '#BC986A',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginLeft: 10,
  },
  name: {
    fontSize: 22,
    color: 'white',
    marginLeft: 8,
  },
  chattingWrapper: {
    height: height - 200,
    width,
    paddingLeft: 20,
    paddingRight: 20,
    maxHeight: height - 200,
  },
  classLogo: {
    fontWeight: 'bold',
    fontSize: 25,
    backgroundColor: '#BC986A',
    borderRadius: 30,
    color: 'white',
  },
  othersChat: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  mineChat: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  username: {
    fontSize: 14,
    color: 'purple',
    alignSelf: 'flex-start',
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    alignSelf: 'flex-start',
  },
  time: {
    fontSize: 13,
    color: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-end',
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 10,
  },
});
