import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
  ImageBackground,
  BackHandler,
  Alert,
} from 'react-native';
import ClassCard from './Classcard.js';
import * as Progress from 'react-native-progress';
import * as CONSTANT from '../constant/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pusher from 'pusher-js/react-native';
import {useRoute} from '@react-navigation/native';
const Classroom = ({navigation, route}) => {
  const [Classdata, setClassData] = useState();
  const [OnlineEmail, setOnlineEmail] = useState();
  const routes = useRoute();

  // useFocusEffect(
  //   React.useCallback(() => {
  //     getClass();
  //   }, []),
  // );

  useEffect(() => {
    navigation.setOptions({
      title: 'Classes',
    });
    getClass('start');
  }, []);

  useEffect(() => {
    const pusher = new Pusher('44b4562fab24e3744652', {
      cluster: 'eu',
    });
    const channel = pusher.subscribe('newclass');
    channel.bind('pusher:subscription_succeeded', () => {
      channel.bind('inserted', newClass => {
        const code = newClass.code;
        if (OnlineEmail == undefined) {
          getClass('start');
        }
        if (checkValue(newClass, code)) {
          setClassData([...Classdata, newClass]);
        } else {
          console.log('Different Class');
        }
      });
    });

    const deleteChannel = pusher.subscribe('deleteClass');
    deleteChannel.bind('pusher:subscription_succeeded', () => {
      deleteChannel.bind('deleted', newClass => {
        getClass('delete');
      });
    });
    channel.bind('pusher:subscription_error', error => {
      console.log(error);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      deleteChannel.unbind_all();
      deleteChannel.unsubscribe();
    };
  }, [Classdata]);
  const hasValue = (obj, key, value) => {
    return obj.hasOwnProperty(key) && obj[key] === value;
  };
  const checkValue = (details, code) => {
    const result =
      Object.values(details).some(function (k) {
        return ~k.indexOf(OnlineEmail);
      }) &&
      Classdata.some(function (boy) {
        return hasValue(boy, 'code', code);
      }) === false;
    return result;
  };
  const getClass = async from => {
    try {
      let jsonValue = await AsyncStorage.getItem('email');
      if (jsonValue !== null) {
        if (OnlineEmail == undefined) {
          setOnlineEmail(JSON.parse(jsonValue));
        }
        if (Classdata == undefined || from == 'delete') {
          CONSTANT.API.get(`/createclass/${JSON.parse(jsonValue)}`)
            .then(response => {
              setClassData(response.data);
            })
            .catch(error => console.log(error));
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={styles.container}>
      <View style={styles.mainContainer}>
        {Classdata != undefined ? (
          <FlatList
            data={Classdata}
            keyExtractor={item => item.code.toString()}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ClassHome', {
                      code: item.code,
                      title: item.name,
                      description: item.description,
                      assignment: item.assignment,
                      owner: OnlineEmail === item.creator ? 'owner' : 'no',
                    });
                  }}>
                  <ClassCard name={item.name} />
                </TouchableOpacity>
              );
            }}
          />
        ) : (
          <View
            style={{
              alignItems: 'center',
            }}>
            <Progress.Circle size={100} indeterminate={true} />
          </View>
        )}
      </View>
    </ImageBackground>
  );
};
export default Classroom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  textassign: {
    fontSize: 20,
    paddingLeft: 50,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderRadius: 50,
    borderColor: '#ECECEC',
  },
  button: {
    alignItems: 'flex-start',
    marginTop: 35,
    flexDirection: 'row',
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderRadius: 50,
    borderColor: '#ECECEC',
  },

  textSign: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listdisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    paddingRight: 10,
    paddingLeft: 10,
    borderBottomWidth: 1,
  },
});
