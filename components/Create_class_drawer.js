import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  ToastAndroid,
  AlertIOS,
  ImageBackground,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {useTheme} from '@react-navigation/native';
import * as CONSTANT from '../constant/constant';

const create_class_drawer = ({navigation}) => {
  const init = {
    name: '',
    ValidName: false,
    description: '',
    members: '',
    creator: '',
  };
  const [data, setData] = useState(init);
  useEffect(() => {
    getCreatorName();
  }, []);
  const {colors} = useTheme();

  const createData = {
    name: '',
    description: '',
    code: '',
    creator: '',
    member: '',
    chat: [],
  };

  const capitalizeName = name => {
    const n = name.split(' ');
    for (var i = 0; i < n.length; i++) {
      n[i] = n[i].charAt(0).toUpperCase() + n[i].slice(1);
    }
    name = n.join(' ');
    return name;
  };
  const getCreatorName = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('email');
      if (jsonValue !== null) {
        setData({...data, creator: JSON.parse(jsonValue)});
      }
    } catch (e) {
      console.log(e);
    }
  };
  const getRandomString = length => {
    const randomChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (var i = 0; i < length; i++) {
      result += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length),
      );
    }
    return result;
  };

  const searchtext = val => {
    val = val.replace(/\s+/g, '');
    const res = val.split(',');
    res.push(data.creator);

    let temp = [];
    let arr = res;

    for (let i of arr) i && temp.push(i); // copy each non-empty value to the 'temp' array
    arr = temp;

    setData({...data, members: arr});
  };
  const textInputChange = val => {
    if (val.trim().length >= 4) {
      setData({
        ...data,
        name: val,
        ValidName: true,
      });
    } else {
      setData({
        ...data,
        name: val,
        ValidName: false,
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
  const descriptionchange = val => {
    setData({
      ...data,
      description: val,
    });
  };

  const createclass = () => {
    if (Platform.OS === 'android') {
      if (data.ValidName) {
        createData.name = capitalizeName(data.name);
        createData.description = data.description;
        createData.code = getRandomString(6);
        if (data.members.length > 1) {
          createData.member = data.members;
        } else {
          createData.member = [data.creator];
        }

        createData.creator = data.creator;
        CONSTANT.API.post('/createclass', createData)
          .then(response => {
            showmsg('Class created!');
            navigation.goBack();
            setData({
              ...data,
              name: '',
              members: '',
              description: '',
              ValidName: false,
            });
          })
          .catch(error => console.log(error));
      } else {
        showmsg('Please Enter Class Name');
      }
    } else {
      // implementation for IOS
    }
  };
  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={styles.container}>
      <View style={styles.header}></View>

      <View style={[styles.footer]}>
        <ScrollView>
          <Text style={[styles.text_footer, {color: colors.text}]}>
            Class Name
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Class Name"
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              value={data.name}
              onChangeText={val => textInputChange(val)}
            />
            {data.ValidName ? (
              <Animatable.View animation="bounceIn">
                <Feather name="check-circle" color="green" size={20} />
              </Animatable.View>
            ) : null}
          </View>
          {data.name.trim().length >= 1 && data.name.trim().length < 4 ? (
            <Animatable.View animation="fadeInLeft" duration={500}>
              <Text style={styles.errorMsg}>
                Username must be 4 characters long.
              </Text>
            </Animatable.View>
          ) : null}
          <Text style={[styles.text_footer, {color: colors.text}]}>
            Description
          </Text>
          <View style={styles.action}>
            <TextInput
              placeholder="Description"
              multiline={true}
              maxLength={50}
              value={data.description}
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              onChangeText={val => descriptionchange(val)}
            />
          </View>

          <TouchableOpacity>
            <View style={styles.action}>
              <TextInput
                placeholder="Search Student"
                placeholderTextColor="#666666"
                style={[
                  styles.textInput,
                  {
                    color: colors.text,
                  },
                ]}
                autoCapitalize="none"
                value={data.members}
                onChangeText={val => searchtext(val)}
              />
              <Feather name="search" color="green" size={20} />
            </View>
          </TouchableOpacity>
          <View style={styles.addedStudentsContainer}>
            <View style={styles.addedStudents}>
              {data.members.length > 1 ? (
                <View>
                  {data.members.map(item => (
                    <Text style={styles.addedStudents}>{item}</Text>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.signIn}
              onPress={() => createclass()}>
              <LinearGradient
                colors={['#4d2e33', '#d7a083']}
                style={styles.signIn}>
                <Text
                  style={[
                    styles.textSign,
                    {
                      color: '#fff',
                    },
                  ]}>
                  Create Class
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
export default create_class_drawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  footer: {
    flex: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  text_footer: {
    color: '#05375a',
    paddingTop: 10,
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
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
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addedStudentsContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,

    borderStyle: 'dashed',
  },
  addedStudents: {
    padding: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    fontSize: 16,
  },
});
