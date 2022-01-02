import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
const {width, height} = Dimensions.get('screen');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Pusher from 'pusher-js/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as CONSTANT from '../constant/constant.js';
import * as Progress from 'react-native-progress';
import KeyboardAvoidingWrapper from './KeyboardAvoidingWrapper';
import {useRoute} from '@react-navigation/native';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const ClassroomChat = ({navigation, route}) => {
  const [chat, setChat] = useState();
  const [userOnlineEmail, setuserOnlineEmail] = useState(null);
  const [userOnlineName, setuserOnlineName] = useState(null);
  const code = route.params.code;
  const [message, setMessage] = useState('');
  const routes = useRoute();
  console.log(routes.name);
  useEffect(() => {
    getOnlineUser();
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
      headerShown: false,
    });
  }, []);
  useFocusEffect(() => {
    if (chat === undefined) {
      fetchChat();
    }
  });
  useEffect(() => {
    const pusher = new Pusher('44b4562fab24e3744652', {
      cluster: 'eu',
    });
    const channel = pusher.subscribe('newChat');
    channel.bind('pusher:subscription_succeeded', () => {
      channel.bind('update', newChat => {
        {
          // newChat.code == route.params.code
          //   ? setChat([...chat, newChat])
          //   : console.log('Different Class');
          if (newChat.code == route.params.code) {
            setChat([...chat, newChat]);
          }
        }
      });
    });
    channel.bind('pusher:subscription_error', error => {
      console.log(error);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chat]);

  const messageSend = {
    msg: message,
    username: userOnlineName,
    email: userOnlineEmail,
    code: code,
  };

  const fetchChat = async () => {
    try {
      await CONSTANT.API.get(`/chat/${route.params.code}`)
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
  const sendMsg = () => {
    messageSend.msg = message;
    messageSend.username = userOnlineName;
    messageSend.email = userOnlineEmail;
    messageSend.code = code;
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
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableHighlight
            underlayColor="rgba(255,255,255,0.2)"
            onPress={() => {
              setChat(undefined);
              navigation.goBack();
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome5 name="arrow-left" color="white" size={20} />
          </TouchableHighlight>
          <View style={styles.profile}>
            <Image
              style={{width: '100%', height: '100%'}}
              source={require('../assets/profile.jpeg')}
            />
          </View>
          <Text style={styles.name}>{route.params.title}</Text>
        </View>
        <TouchableHighlight
          underlayColor="rgba(255,255,255,0.2)"
          onPress={() => {
            console.log('press');
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons
            name="dots-vertical"
            color="white"
            size={30}
          />
        </TouchableHighlight>
      </View>

      <ScrollView style={styles.chattingWrapper}>
        {chat != undefined ? (
          chat.map((item, index) => (
            <View
              key={index}
              style={
                item.email === userOnlineEmail
                  ? styles.mineChat
                  : styles.othersChat
              }>
              <Text style={styles.username}>{item.username}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.text}>{item.msg}</Text>
                <Text style={styles.time}>{item.date}</Text>
              </View>
            </View>
          ))
        ) : (
          <View
            style={{
              alignItems: 'center',
            }}>
            <Progress.Circle size={100} indeterminate={true} />
          </View>
        )}
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
};

export default ClassroomChat;

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#FFF',
  },
  header: {
    width,
    height: 80,
    backgroundColor: '#160d22',
    alignItems: 'center',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 20,
    justifyContent: 'space-between',
  },
  profile: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
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
