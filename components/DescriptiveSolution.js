import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Platform,
  Button,
  Alert,
  Dimensions,
} from 'react-native';
import * as CONSTANT from '../constant/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
const {width, height} = Dimensions.get('window');

const DescriptiveSolution = ({navigation, route}) => {
  const code = route.params.code;
  const uuid = route.params.uuid;
  const [question, setQuestion] = useState(route.params.question);
  const [answer, setAnswer] = useState([]);
  const [email, setEmail] = useState();
  const [marks, setMarks] = useState([]);
  let sum = 0;
  let check = false;
  useFocusEffect(
    React.useCallback(() => {
      setQuestion(route.params.question);
    }),
  );

  useEffect(() => {
    getOnlineUser();
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
      title: 'Descriptive Assignment',
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
  const SubmitAnswer = async () => {
    check = false;
    let tempDate = new Date().toString().split('G');
    await CONSTANT.API.post('/checkAssignment', {
      code,
      email,
      uuid,
      date: tempDate[0],
    })
      .then(response => {
        if (response.data.time == 'end') {
          setAnswer([]);
          setQuestion();
          Alert.alert(
            'Alert!',
            "Time is Over, Now You can't able to submit the assignment",
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.navigate('Room');
                },
              },
            ],
          );
        } else {
          if (answer.length < question.length) {
            ShowAlert(
              'Question Missing',
              'Do you want to continue without attempting all question',
              true,
            );
          } else {
            answer.forEach((item, index) => {
              if (item.length == 0) {
                check = true;
                ShowAlert(
                  'Question Missing',
                  'Do you want to continue without attempting all question',
                  true,
                );
              }
              if (check == false && index === answer.length - 1) {
                check = false;
                ShowAlert('Submit Assignment', 'Confirm Submission!', false);
              }
            });
          }
        }
      })
      .catch(error => console.log(error));
  };
  const ShowAlert = (title, description, check) => {
    Alert.alert(title, description, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Room');
          if (check) {
            for (let i = answer.length; i < question.length; i++) {
              answer.push('');
            }
          }

          setAnswer([]);
          setQuestion();
          checkPlag();
        },
      },
    ]);
  };
  const APIPlag = async (item, index) => {
    let flag = false;
    await CONSTANT.API.post('/plagiarism', {item}).then(response => {
      if (response.data.plag) {
        let pla = response.data.data.percentPlagiarism;
        if (item.length > 2) {
          let mark = (marks[index] / 100) * (100 - pla);
          sum = sum + mark;

          console.log('Plag: ', pla, ' Marks: ', mark, ' SUM: ', sum);
          flag = true;
        }
      } else {
        console.log('Error');
      }
    });
    if (flag == true && index == answer.length - 1) {
      console.log('Sum SUb: ', sum);
      uploadAssignment(sum);
    }
  };
  const checkPlag = async () => {
    answer.forEach((item, index) => {
      if (item.length >= 0) {
        APIPlag(item, index);
      }
      //else if (index == answer.length - 1) {
      //   uploadAssignment(sum);
      // }
    });
  };
  const uploadAssignment = async sum => {
    await CONSTANT.API.post('/submitAssignment', {
      email,
      answers: answer,
      marks: sum,
      code,
      uuid,
    })
      .then(response => {
        sum = 0;

        // navigation.navigate('Room');
      })
      .catch(error => console.log(error));
  };

  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={styles.mainContainer}>
      <View style={styles.container}>
        {question != undefined && (
          <View>
            <FlatList
              data={question}
              renderItem={({item, index}) => {
                {
                  marks[index] = item.mark;
                }
                return (
                  <View style={{width: width * 0.9}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        padding: 20,
                        justifyContent: 'space-between',
                        alignContent: 'space-between',
                      }}>
                      <Text style={styles.displayquestion}>
                        Question: {item.question}
                      </Text>
                      <Text
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontStyle: 'italic',
                          fontWeight: 'bold',
                          position: 'absolute',
                        }}>
                        Marks: {item.mark}
                      </Text>
                    </View>
                    <View style={{padding: 20}}>
                      <TextInput
                        placeholder="Enter Your Answer"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={answer[index]}
                        textAlignVertical="auto"
                        multiline={true}
                        style={[styles.textInput]}
                        selectTextOnFocus={true}
                        keyboardType={
                          Platform.OS === 'ios'
                            ? 'ascii-capable'
                            : 'visible-password'
                        }
                        onChangeText={questions => {
                          let textInputs = answer;
                          textInputs[index] = questions;
                          setAnswer(textInputs);
                        }}
                      />
                    </View>
                  </View>
                );
              }}
            />
          </View>
        )}
        <TouchableOpacity
          style={{marginBottom: 20}}
          onPress={() => SubmitAnswer()}>
          <LinearGradient
            colors={['#4d2e33', '#d7a083']}
            style={styles.btnStyle}>
            <Text style={[styles.btnText]}>Submit</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default DescriptiveSolution;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    borderRadius: 40,
  },
  displayquestion: {
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: 20,
  },
  btnStyle: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: 'rgba(255,255,255,0.7)',
  },
});
