import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ImageBackground,
  ToastAndroid,
  AlertIOS,
} from 'react-native';

import Pusher from 'pusher-js/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentResult = ({navigation, route}) => {
  const [assignment, setAssignment] = useState(route.params.assignment);
  const code = route.params.code;
  const [DisplayResult, setDisplayResult] = useState(true);
  const [email, setEmail] = useState();

  useEffect(() => {
    getOnlineUser();
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
      title: route.params.title,
    });
  }, []);
  useEffect(() => {
    const pusher = new Pusher('44b4562fab24e3744652', {
      cluster: 'eu',
    });
    const UpdateMarksChannel = pusher.subscribe('newAssignment');
    UpdateMarksChannel.bind('pusher:subscription_succeeded', () => {
      UpdateMarksChannel.bind('update', newMem => {
        if (newMem.code == code) {
          setAssignment(newMem.assignment);
        } else {
          console.log('Different Code');
        }
      });
    });
    return () => {
      UpdateMarksChannel.unbind_all();
      UpdateMarksChannel.unsubscribe();
    };
  }, [assignment]);
  const getOnlineUser = async () => {
    try {
      if (email == null) {
        let getemail = await AsyncStorage.getItem('email');

        if (getemail !== null) {
          setEmail(JSON.parse(getemail));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  const showmsg = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };
  const showNumber = item => {
    if (email == undefined) {
      getOnlineUser();
    }
    if (item.length > 0) {
      item.map((mem, index) => (
        <View>
          {item.length - 1 == index ? (
            <View>
              {mem.stdname == email
                ? showmsg('Marks: ' + mem.marks)
                : showmsg('Yet Not Attempted')}
            </View>
          ) : (
            <View>
              {mem.stdname == email ? showmsg('Marks: ' + mem.marks) : null}
            </View>
          )}
        </View>
      ));
    } else {
      showmsg('Yet Not Attempted');
    }
  };
  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={styles.container}>
      <View>
        {DisplayResult ? (
          <View>
            {assignment != null &&
              assignment.map((item, index) => (
                <View key={item.uuid}>
                  <TouchableOpacity
                    onPress={() => {
                      showNumber(item.mem);
                      //setDisplayResult(!DisplayResult);
                    }}>
                    <View style={styles.buttonCard}>
                      <Text style={styles.buttonNames}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </ImageBackground>
  );
};

export default StudentResult;
const styles = StyleSheet.create({
  textassign: {
    fontSize: 20,
    paddingLeft: 50,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderRadius: 50,
    borderColor: '#ECECEC',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  displayList: {
    flexDirection: 'row',
    padding: 20,
    borderBottomWidth: 1,
    borderRadius: 50,
    borderColor: '#ECECEC',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  displayText: {
    fontSize: 20,
  },
  buttonCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    paddingLeft: 15,
    margin: 10,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 15,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonNames: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 24,
  },
});
