import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  TextInputBase,
  TextInput,
  Button,
} from 'react-native';
import Overlay from 'react-native-modal-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DialogInput from 'react-native-dialog-input';
import LinearGradient from 'react-native-linear-gradient';
import * as CONSTANT from '../constant/constant';
import Pusher from 'pusher-js/react-native';

const TeacherResult = ({navigation, route}) => {
  const [assignment, setAssignment] = useState(route.params.assignment);
  const [Attempted, setAttempted] = useState();
  const code = route.params.code;
  const [uuid, setUUID] = useState('');
  const [stdname, setStdName] = useState('');
  const [NotAttempted, setNotAttempted] = useState();
  const [type, setType] = useState('');
  const [DisplayResult, setDisplayResult] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showModal, setShowModal] = useState({modalVisible: false});
  const [detail, setDetail] = useState();
  useEffect(() => {
    navigation.setOptions({
      tabBarStyle: {display: 'none'},
      title: route.params.title,
    });
  }, []);
  useEffect(() => {
    const pusher = new Pusher('44b4562fab24e3744652', {
      cluster: 'eu',
    });
    const UpdateMarksChannel = pusher.subscribe('updateMarks');
    UpdateMarksChannel.bind('pusher:subscription_succeeded', () => {
      UpdateMarksChannel.bind('update', newMem => {
        if (newMem.code == code) {
          setAttempted(newMem.mem);
        } else {
          console.log('Different Code');
        }
      });
    });
    return () => {
      UpdateMarksChannel.unbind_all();
      UpdateMarksChannel.unsubscribe();
    };
  }, [Attempted]);
  const UpdateMarks = async text => {
    setShowDialog(false);
    setShowModal({modalVisible: false});
    console.log(text, code, uuid, stdname);
    await CONSTANT.API.post('/updateMarks', {code, uuid, marks: text, stdname})
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  const onClose = () => setShowModal({modalVisible: false});

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
                      setAttempted(item.mem);
                      setUUID(item.uuid);
                      setType(item.type);
                      setDisplayResult(!DisplayResult);
                    }}>
                    <View style={styles.buttonCard}>
                      <Text style={styles.buttonNames}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
          </View>
        ) : (
          <View>
            {Attempted != undefined &&
              Attempted.map((item, index) => (
                <View style={styles.buttonCard} key={index}>
                  <Text style={styles.buttonNames}>{index + 1}</Text>
                  <Text style={styles.buttonNames}>{item.stdname}</Text>
                  <Text style={styles.buttonNames}>{item.marks}</Text>
                  <FontAwesome
                    onPress={() =>
                      type == 'mcqs' ? (
                        <View>
                          {(setShowDialog(true), setStdName(item.stdname))}
                        </View>
                      ) : (
                        <View>
                          {/* {(setShowDialog(true), setStdName(item.stdname))} */}
                          {setDetail(item)}
                          {setStdName(item.stdname)}
                          {setShowModal({modalVisible: true})}
                        </View>
                      )
                    }
                    name="edit"
                    size={20}
                    color="#000"
                  />
                </View>
              ))}
            <DialogInput
              isDialogVisible={showDialog}
              title={`Edit Marks:${stdname} `}
              message={'Enter Marks: '}
              textInputProps={{keyboardType: 'numeric'}}
              submitInput={inputText => {
                UpdateMarks(inputText);
              }}
              closeDialog={() => {
                setShowDialog(false);
              }}
            />
            <Overlay
              visible={showModal.modalVisible}
              onClose={() => onClose()}
              closeOnTouchOutside>
              {detail != undefined ? (
                <View>
                  {detail.answers.map((ans, index) => (
                    <Text>
                      Answer: {index + 1} {ans}
                    </Text>
                  ))}
                </View>
              ) : null}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  alignSelf: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text>Enter Marks</Text>
                <TextInput
                  placeholder="Enter Marks"
                  value={detail != undefined ? detail.marks : null}
                  onChangeText={val => setDetail({...detail, marks: val})}
                />
              </View>
              <Button
                title="Upload Marks"
                onPress={() => UpdateMarks(detail.marks)}
              />
            </Overlay>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => setDisplayResult(!DisplayResult)}>
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
                    Go Back
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};
//inputText.replace(/[^0-9.]/g, '')
export default TeacherResult;
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
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 15,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
  },
  buttonNames: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 24,
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
