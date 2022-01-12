import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  ToastAndroid,
  AlertIOS,
} from 'react-native';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import * as CONSTANT from '../constant/constant';
import {useRoute} from '@react-navigation/native';

const ClassHome = ({navigation, route}) => {
  const [data, setData] = useState(true);
  const [mode, setMode] = useState();
  useEffect(() => {
    navigation.setOptions({
      title: route.params.title,
      tabBarStyle: {display: 'none'},
    });
  });

  const Buttondata = [
    {
      label: 'Descriptive',
    },
    {
      label: 'MCQs',
    },
  ];
  const [createAssign, setCreateAssign] = useState(false);
  const [ShowAddStudent, setShowAddStudent] = useState(false);
  const [member, setMember] = useState('');
  const routes = useRoute();

  const displaydetails = () => {
    setData(!data);
  };
  const checkMode = () => {
    return Object.values(mode).includes('Descriptive');
  };
  const AddStudent = val => {
    val = val.replace(/\s+/g, '');
    const res = val.split(',');
    let temp = [];
    let arr = res;
    for (let i of arr) i && temp.push(i); // copy each non-empty value to the 'temp' array
    arr = temp;
    setMember(arr);
  };
  const AddStudentDB = async () => {
    if (member.length < 6) {
      showmsg('Please Enter Student Email');
    } else {
      await CONSTANT.API.post('/code', {code: route.params.code, member})
        .then(response => {
          showmsg('Added');
          setMember('');
          setShowAddStudent(!ShowAddStudent);
        })
        .catch(error => showmsg(error.data));
    }
  };
  const showmsg = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };
  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={styles.mainContainer}>
      <View style={styles.container}>
        <ScrollView>
          <TouchableOpacity onPress={() => displaydetails()}>
            <View style={styles.button}>
              <MaterialIcons
                name={data ? 'keyboard-arrow-right' : 'keyboard-arrow-down'}
                color="#fff"
                size={35}
              />
              <Text style={styles.textSign}>Class details</Text>
            </View>
          </TouchableOpacity>

          {data ? null : (
            <View style={styles.titleCard}>
              <Text style={styles.titleNames}>
                Class Name:
                <Text style={styles.titleData}>
                  {'\t\t' + route.params.title}
                </Text>
              </Text>
              <Text style={styles.titleNames}>
                Class Code:
                <Text style={styles.titleData}>
                  {'\t\t\t' + route.params.code}
                </Text>
              </Text>
              {route.params.description.trim().length > 0 ? (
                <Text style={styles.titleNames}>
                  Class Description:
                  <Text style={styles.titleData}>
                    {'\t\t' + route.params.description}
                  </Text>
                </Text>
              ) : null}
            </View>
          )}
          <View style={styles.innerContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Chat', {
                  code: route.params.code,
                  title: route.params.title,
                });
              }}>
              <View style={styles.buttonCard}>
                <Text style={styles.icons}>
                  <Entypo name="chat" size={25} />
                </Text>
                <Text style={styles.buttonNames}>Chat</Text>
              </View>
            </TouchableOpacity>
            {route.params.owner == 'owner' ? (
              <View>
                <View style={styles.createAssign}>
                  <TouchableOpacity
                    onPress={() => {
                      setCreateAssign(!createAssign);
                    }}>
                    <View style={styles.assignmentdisplay}>
                      <Text style={styles.icons}>
                        <Ionicons name="create" size={27} />
                      </Text>
                      <Text style={styles.buttonNames}>Create Assignments</Text>
                    </View>
                    {createAssign ? (
                      <View>
                        <RadioButtonRN
                          data={Buttondata}
                          animationTypes={['pulse']}
                          initial={1}
                          icon={
                            <Icon
                              name="check-circle"
                              size={25}
                              color="#2c9dd1"
                            />
                          }
                          boxDeactiveBgColor={'#e1f5fe33'}
                          selectedBtn={e => {
                            setMode(e);
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setCreateAssign(!createAssign);
                            checkMode()
                              ? navigation.navigate('Des', {
                                  code: route.params.code,
                                  type: 'descriptive',
                                })
                              : navigation.navigate('mcqs', {
                                  type: 'mcqs',
                                  code: route.params.code,
                                });
                          }}>
                          <View style={{alignItems: 'flex-end'}}>
                            <MaterialIcons
                              name="chevron-right"
                              color="#fff"
                              size={35}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('TeacherResult', {
                      code: route.params.code,
                      title: route.params.title,
                      assignment: route.params.assignment,
                    })
                  }>
                  <View style={styles.buttonCard}>
                    <Text style={styles.icons}>
                      <Foundation name="results" size={27} />
                    </Text>
                    <Text style={styles.buttonNames}>Assignments Result</Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.createAssign}>
                  <TouchableOpacity
                    onPress={() => setShowAddStudent(!ShowAddStudent)}>
                    <View style={styles.assignmentdisplay}>
                      <Text style={styles.icons}>
                        <Entypo name="add-user" size={25} />
                      </Text>
                      <Text style={styles.buttonNames}>Add Students</Text>
                    </View>
                  </TouchableOpacity>

                  {ShowAddStudent ? (
                    <View>
                      <TouchableOpacity>
                        <View style={styles.action}>
                          <TextInput
                            placeholder="Enter Student Email"
                            placeholderTextColor="#666666"
                            style={[styles.textInput]}
                            autoCapitalize="none"
                            value={member}
                            onChangeText={val => AddStudent(val)}
                          />
                          <Feather name="search" color="green" size={20} />
                        </View>
                      </TouchableOpacity>
                      <View style={styles.addedStudentsContainer}>
                        <View style={styles.addedStudents}>
                          {member.length > 0 ? (
                            <View>
                              {member.map(item => (
                                <Text style={styles.addedStudents}>{item}</Text>
                              ))}
                            </View>
                          ) : null}
                        </View>
                      </View>
                      <View style={styles.stdButton}>
                        <TouchableOpacity
                          style={styles.signIn}
                          onPress={() => {
                            AddStudentDB();
                          }}>
                          <LinearGradient
                            colors={['#4d2e33', '#d7a083']}
                            style={styles.signIn}>
                            <Text style={[styles.textSign]}>Add Student</Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Schedule', {
                      assignment: route.params.assignment,
                      code: route.params.code,
                    });
                  }}>
                  <View style={styles.buttonCard}>
                    <Text style={styles.icons}>
                      <Ionicons name="create" size={27} />
                    </Text>
                    <Text style={styles.buttonNames}>Assignments</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('StudentResult', {
                      assignment: route.params.assignment,
                      code: route.params.code,
                      title: route.params.title,
                    });
                  }}>
                  <View style={styles.buttonCard}>
                    <Text style={styles.icons}>
                      <Foundation name="results" size={27} />
                    </Text>
                    <Text style={styles.buttonNames}>Assignments Result</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default ClassHome;

const styles = {
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  createAssign: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: 5,
    paddingLeft: 15,
    margin: 10,
    marginRight: 20,
    marginLeft: 20,
    borderRadius: 15,
    textAlign: 'center',
  },
  assignmentdisplay: {
    display: 'flex',
    flexDirection: 'row',
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
  titleCard: {
    backgroundColor: 'rgba(214, 159, 130, 0.6)',
    borderColor: 'rgb(66, 38, 41)',
    borderWidth: 3,
    padding: 15,
    paddingLeft: 15,
    margin: 10,
    marginRight: 20,
    marginLeft: 20,
    borderTopRightRadius: 45,
    marginBottom: 40,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  textSign: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  button: {
    alignItems: 'flex-start',
    marginTop: 20,
    flexDirection: 'row',
    paddingLeft: 10,
  },
  titleNames: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  titleData: {
    fontSize: 20,
    fontWeight: 'normal',
    color: 'orange',
  },
  icons: {
    padding: 10,
    marginTop: 3,
  },
  innerContainer: {
    marginTop: 10,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  stdButton: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  addedStudentsContainer: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#fff',
    borderStyle: 'dashed',
  },
  addedStudents: {
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    fontSize: 16,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
};
