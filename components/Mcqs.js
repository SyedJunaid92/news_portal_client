import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Button,
  ImageBackground,
  Alert,
  Platform,
  ToastAndroid,
  AlertIOS,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as CONSTANT from '../constant/constant.js';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Mcqs = ({navigation, route}) => {
  const [title, setTitle] = useState();
  const code = route.params.code;
  const type = route.params.type;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [StartTime, setStartTime] = useState();
  const [EndTime, setEndTime] = useState();
  const [from, setFrom] = useState('');
  const [ques, setQues] = useState('');
  const [correct, setCorrect] = useState('');
  const [Questions, setQuestion] = useState([]);
  const [textInput, setTextInput] = useState([]);
  const [inputData, setInputData] = useState([]);
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
      title: "MCQ's Assignment",
    });
  }, []);
  //function to add TextInput dynamically
  const addTextInput = index => {
    let textInputCopy = textInput;
    textInputCopy.push(
      <TextInput
        style={styles.textInput2}
        onChangeText={text => addValues(text, index)}
        placeholder="Enter Option"
        placeholderTextColor="'rgba(255,255,255,0.6)"
      />,
    );
    setTextInput([...textInputCopy]);
  };
  //function to remove TextInput dynamically
  const removeTextInput = () => {
    let textInputCopy = textInput;
    let inputDataCopy = inputData;
    textInputCopy.pop();
    inputDataCopy.pop();
    setTextInput([...textInputCopy]);
    setInputData([...inputDataCopy]);
  };
  //function to add text from TextInputs into single array
  const addValues = (text, index) => {
    let dataArray = inputData;

    for (let i = 0; i < textInput.length; i++) {
      if (i == index) {
        dataArray[i] = text;
        setInputData([...dataArray]);
      }
    }
  };
  //function to console the output
  const getValues = () => {
    let temp = {question: ques, options: inputData, correct: correct};
    setQuestion(prevState => [...prevState, temp]);
    setInputData([]);
    setTextInput([]);
    setQues('');
    setCorrect('');
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    if (from == 'start') {
      handleStartTime(date);
    } else if (from == 'end') {
      handleEndTime(date);
    }
    hideDatePicker();
  };
  const handleStartTime = date => {
    let tempDate = date.toString().split('G');
    // let fDate =
    //   tempDate.getFullYear() +
    //   '-' +
    //   (tempDate.getMonth() + 1) +
    //   '-' +
    //   tempDate.getDate();
    // let fTime;
    // if (tempDate.getHours().toString().length == 1) {
    //   fTime = 'T' + '0' + tempDate.getHours() + ':' + tempDate.getMinutes();
    // } else {
    //   fTime = 'T' + tempDate.getHours() + ':' + tempDate.getMinutes();
    // }
    // let Time = fDate + fTime;
    setStartTime(tempDate[0]);
  };
  const handleEndTime = date => {
    if (date.toString() < StartTime) {
      Alert.alert(
        'Alert!',
        'Please Select Correct Time. End Time is Always Greater from Start Time',
        [
          {
            text: 'OK',
          },
        ],
      );
    } else {
      let tempDate = date.toString().split('G');
      // let fDate =
      //   tempDate.getFullYear() +
      //   '-' +
      //   (tempDate.getMonth() + 1) +
      //   '-' +
      //   tempDate.getDate();
      // let fTime;
      // if (tempDate.getHours().toString().length == 1) {
      //   fTime = 'T' + '0' + tempDate.getHours() + ':' + tempDate.getMinutes();
      // } else {
      //   fTime = 'T' + tempDate.getHours() + ':' + tempDate.getMinutes();
      // }
      // let Time = fDate + fTime;
      setEndTime(tempDate[0]);
    }
  };
  const showmsg = msg => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      AlertIOS.alert(msg);
    }
  };
  const UploadAssignment = () => {
    console.log(Questions);
    if (title == null) {
      showmsg('Please Enter Title');
    } else if (!Questions || Questions.length === 0) {
      showmsg('Please Enter Question');
    } else if (StartTime == null) {
      showmsg('Please Enter Start Time');
    } else if (EndTime == null) {
      showmsg('Please Enter End Time');
    } else {
      const assign = {
        code,
        title,
        start: StartTime,
        end: EndTime,
        question: Questions,
        type,
      };

      CONSTANT.API.post('/assignment', assign)
        .then(response => {
          showmsg('Created');
          setQuestion([]);
          setTitle('');
          setStartTime();
          setEndTime();
          setQues('');
          setInputData([]);
          setTextInput([]);
          navigation.navigate('Room');
        })
        .catch(error => console.log(error));
    }
  };

  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={styles.mainContainer}>
      <View style={styles.container}>
        <ScrollView
          style={{
            padding: 15,
          }}>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="format-title"
              color={'rgba(255,255,255,0.7)'}
              size={20}
            />
            <TextInput
              placeholder="Assignment Title"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={[styles.textInput]}
              value={title}
              autoCapitalize="none"
              keyboardType={
                Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={val => setTitle(val)}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                showDatePicker();
                setFrom('start');
              }}>
              <LinearGradient
                colors={['#4d2e33', '#d7a083']}
                style={styles.btnStyle}>
                <MaterialCommunityIcons
                  name="calendar"
                  color={'rgba(255,255,255,0.7)'}
                  size={20}
                />
                <Text style={styles.btnText}>Set Start Time</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.displayTime}>{StartTime}</Text>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              minimumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => {
                showDatePicker();
                setFrom('end');
              }}>
              <LinearGradient
                colors={['#4d2e33', '#d7a083']}
                style={styles.btnStyle}>
                <MaterialCommunityIcons
                  name="calendar"
                  color={'rgba(255,255,255,0.7)'}
                  size={20}
                />
                <Text style={[styles.btnText]}>Set End Time</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.displayTime}>{EndTime}</Text>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              minimumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>

          <View style={styles.action}>
            <AntDesign
              name="questioncircleo"
              color={'rgba(255,255,255,0.7)'}
              size={20}
            />
            <TextInput
              placeholder="Enter Question"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={[styles.textInput]}
              autoCapitalize="none"
              value={ques}
              keyboardType={
                Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={val => setQues(val)}
            />
          </View>
          {textInput.map((value, index) => {
            return (
              <View key={index} style={[styles.textInput]}>
                {value}
              </View>
            );
          })}
          <View style={styles.row}>
            <View>
              <TouchableOpacity
                style={{margin: 20}}
                onPress={() => addTextInput(textInput.length)}>
                <LinearGradient
                  colors={['#4d2e33', '#d7a083']}
                  style={styles.btnStyle}>
                  <Text style={[styles.btnText]}> Add Option </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                style={{margin: 20}}
                onPress={() => removeTextInput()}>
                <LinearGradient
                  colors={['#4d2e33', '#d7a083']}
                  style={styles.btnStyle}>
                  <Text style={[styles.btnText]}>Remove Option</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.action}>
            <MaterialCommunityIcons
              name="comment-question"
              color={'rgba(255,255,255,0.7)'}
              size={20}
            />
            <TextInput
              placeholder=" Enter Correct Answer"
              placeholderTextColor="rgba(255,255,255,0.7)"
              value={correct}
              style={[styles.textInput]}
              autoCapitalize="none"
              keyboardType={
                Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'
              }
              onChangeText={val => setCorrect(val)}
            />
          </View>
          <View>
            <TouchableOpacity
              style={{marginBottom: 20}}
              onPress={() => getValues()}>
              <LinearGradient
                colors={['#4d2e33', '#d7a083']}
                style={styles.btnStyle}>
                <Text style={[styles.btnText]}>Add Question</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={{marginBottom: 20}}
              onPress={() => {
                UploadAssignment();
              }}>
              <LinearGradient
                colors={['#4d2e33', '#d7a083']}
                style={styles.btnStyle}>
                <Text style={[styles.btnText]}>Upload Assignment</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default Mcqs;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 15,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.6)',
    paddingBottom: 10,
    marginBottom: 10,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.6)',
    paddingBottom: 10,
    marginBottom: 10,
    marginTop: 10,
    paddingTop: 10,
    borderRadius: 10,
  },
  textInput2: {
    height: 40,
    borderColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderRadius: 10,
    borderStyle: 'dashed',
    margin: 15,
    color: '#fff',
    padding: 10,
  },
  btnStyle: {
    flexDirection: 'row',
    width: '70%',
    height: 40,
    justifyContent: 'center',
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {
    fontWeight: 'bold',
    padding: 5,
    color: 'rgba(255,255,255,0.7)',
  },
  displayTime: {
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    fontWeight: 'bold',

    fontSize: 20,
  },
});
