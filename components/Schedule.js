import React from 'react';
import {useState, useEffect} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Pusher from 'pusher-js/react-native';
import * as CONSTANT from '../constant/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  Platform,
  ToastAndroid,
  AlertIOS,
  ScrollView,
} from 'react-native';

const schedule = ({navigation, route}) => {
  const [assignment, setAssignment] = useState(route.params.assignment);
  const [email, setEmail] = useState();
  const code = route.params.code;
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState({
    arrow_assigment: true,
    arrow_quiz: true,
  });
  useEffect(() => {
    const pusher = new Pusher('44b4562fab24e3744652', {
      cluster: 'eu',
    });
    const AssignmentChannel = pusher.subscribe('newAssignment');
    AssignmentChannel.bind('pusher:subscription_succeeded', () => {
      AssignmentChannel.bind('update', newAssign => {
        if (email == undefined) {
          getOnlineUser();
        }
        if (newAssign.code == code) {
          setAssignment(newAssign.assignment);
        } else {
          console.log('Different Class');
        }
      });
    });
    return () => {
      AssignmentChannel.unbind_all();
      AssignmentChannel.unsubscribe();
    };
  }, [assignment]);
  const hasValue = (obj, key, value) => {
    return obj.hasOwnProperty(key) && obj[key] === value;
  };
  const checkValue = (details, uuid) => {
    const result =
      Object.values(details).some(function (k) {
        return ~k.indexOf(email);
      }) &&
      assignment.some(function (boy) {
        return hasValue(boy, 'uuid', uuid);
      }) === false;
    return result;
  };
  useEffect(() => {
    getOnlineUser();
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
      title: 'Assignments',
    });
  }, []);
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
  const ShowAlert = (title, description) => {
    Alert.alert(title, description, [
      {
        text: 'OK',
      },
    ]);
  };
  const showmsg = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };
  const displayassignment = () => {
    setData({
      ...data,
      arrow_assigment: !data.arrow_assigment,
    });
  };
  const checkDetail = async detail => {
    if (email == null) {
      getOnlineUser();
    }
    try {
      let tempDate = new Date().toString().split('G');
      await CONSTANT.API.post('/checkAssignment', {
        code,
        email,
        uuid: detail.uuid,
        date: tempDate[0],
      })
        .then(response => {
          if (!response.data.find) {
            if (response.data.time == 'wait') {
              ShowAlert(
                'Please Wait',
                'You Need to wait for the Start Time of Assignment',
              );
            } else if (response.data.time == 'end') {
              ShowAlert('Time Out', 'Sorry, Assignemt Due Date is over');
            } else if (response.data.time == 'start') {
              if (detail.type == 'descriptive') {
                navigation.navigate('DesSolution', {
                  question: detail.question,
                  uuid: detail.uuid,
                  code: code,
                  end: detail.end,
                });
              } else if (detail.type == 'mcqs') {
                navigation.navigate('McqsSol', {
                  question: detail.question,
                  uuid: detail.uuid,
                  code: code,
                  end: detail.end,
                });
              }
            }
          } else {
            ShowAlert('Attempted', 'Sorry!,You Already Attemp the Assignment');
          }
        })
        .catch(error => showmsg(error));
    } catch (e) {
      // Handle error
      showmsg(e);
    }
  };
  // new Date(detail.end).toDateString() +
  // ' ' +
  // new Date(detail.end).toLocaleTimeString()
  return (
    <ImageBackground
      source={require('../assets/BG.png')}
      style={styles.mainContainer}>
      <View style={styles.header}></View>
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => displayassignment()}>
          <View style={styles.button}>
            <MaterialIcons
              name={
                data.arrow_assigment
                  ? 'keyboard-arrow-right'
                  : 'keyboard-arrow-down'
              }
              color="#fff"
              size={28}
            />
            <Text style={styles.signText}>Assignments</Text>
          </View>
        </TouchableOpacity>
        <ScrollView>
          {data.arrow_assigment
            ? null
            : assignment != undefined
            ? assignment.map(detail => (
                <View style={styles.assCard} key={detail.uuid}>
                  <Text style={styles.assTitle}>{detail.title}</Text>
                  <View style={styles.timeCard}>
                    <View style={styles.startTime}>
                      <Text style={styles.timeText}>Start Time:</Text>

                      <Text style={styles.timeTime}>{detail.start}</Text>
                    </View>
                    <View style={styles.endTime}>
                      <Text style={styles.timeText}>End Time:</Text>

                      <Text style={styles.timeTime}>{detail.end}</Text>
                    </View>
                    <View>
                      <TouchableOpacity onPress={() => checkDetail(detail)}>
                        <LinearGradient
                          colors={['#4d2e33', '#d7a083']}
                          style={styles.signIn}>
                          <Text style={{fontSize: 17, color: '#fff'}}>
                            Start
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            : null}
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
export default schedule;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  header: {
    flex: 0.000001,
  },
  footer: {
    flex: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  button: {
    alignItems: 'flex-start',
    marginTop: 50,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  signText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  assCard: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 25,
    margin: 20,
    padding: 20,
  },
  assTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  timeCard: {
    marginTop: 10,
    alignSelf: 'center',
  },
  timeText: {
    fontSize: 18,
    padding: 10,
    textAlign: 'right',
  },
  startTime: {
    flexDirection: 'row',
  },
  endTime: {
    flexDirection: 'row',
  },
  timeTime: {
    fontSize: 18,
    padding: 10,
    textAlign: 'right',
    color: 'green',
  },
  signIn: {
    marginTop: 10,
    alignSelf: 'center',
    width: 90,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
  },
});
