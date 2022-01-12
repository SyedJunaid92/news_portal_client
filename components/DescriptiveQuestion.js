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
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import * as CONSTANT from '../constant/constant.js';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const DescriptiveQuestion = ({navigation, route}) => {
  const [title, setTitle] = useState();
  const code = route.params.code;
  const type = route.params.type;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [StartTime, setStartTime] = useState();
  const [EndTime, setEndTime] = useState();
  const [from, setFrom] = useState('');
  const [ques, setQues] = useState('');
  const [marks, setMarks] = useState('');

  const [Questions, setQuestion] = useState([]);
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
      title: 'Descriptive Assignment',
    });
  }, []);

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
  const addQuestion = () => {
    if (ques.length < 8) {
      showmsg('Please Enter Question');
    } else if (marks.length < 1) {
      showmsg('Please Enter Question Marks');
    } else {
      try {
        let temp = {question: ques, mark: marks};
        setQuestion(prevState => [...prevState, temp]);
        setQues('');
        setMarks('');
      } catch (error) {
        console.log(error);
      }
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
      CONSTANT.API.post('/assignment', assign).then(response => {
        showmsg('Created');
        setQuestion([]);
        setTitle();
        setStartTime();
        setEndTime();
        setQues('');
        navigation.navigate('Room');
      });
    }
  };

  const deleteQuestion = (index, text) => {
    let arr = Questions.filter(function (item) {
      return item !== text;
    });
    setQuestion(arr);
  };
  return (
    <ImageBackground
      source={require('./../assets/BG.png')}
      style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.action}>
          <MaterialCommunityIcons
            name="format-title"
            color={'rgba(255,255,255,0.7)'}
            size={20}
          />
          <TextInput
            placeholder="Assignment Title"
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={title}
            style={[styles.textInput]}
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
              <Text style={[styles.btnText]}>Set Start Time</Text>
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
        <View style={styles.action}>
          <MaterialCommunityIcons
            name="numeric"
            color={'rgba(255,255,255,0.7)'}
            size={20}
          />
          <TextInput
            placeholder="Enter Question Marks"
            placeholderTextColor="rgba(255,255,255,0.7)"
            style={[styles.textInput]}
            autoCapitalize="none"
            value={marks}
            keyboardType="numeric"
            onChangeText={val => setMarks(val)}
          />
        </View>
        <View>
          <TouchableOpacity
            style={{marginBottom: 20}}
            onPress={() => {
              addQuestion();
            }}>
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

        {Questions.length > 0 ? (
          <FlatList
            data={Questions}
            renderItem={({item, index}) => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <Text style={{color: '#fff'}}>
                    Question
                    {index + 1}: {item.question}-------
                  </Text>
                  <Text style={{color: '#fff'}}> Marks: {item.mark}</Text>
                  <TouchableOpacity onPress={() => deleteQuestion(index, item)}>
                    <Entypo name="cross" color="#fff" size={18} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        ) : null}
      </View>
    </ImageBackground>
  );
};

export default DescriptiveQuestion;
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
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
  displayTime: {
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    fontWeight: 'bold',
    paddingLeft: 30,
    fontSize: 20,
  },
});
