import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  ActivityIndicator,
  Dimensions,
  Share,
  TouchableOpacity,
  TextInput,
  ScrollView,
  BackHandler,
  Modal,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
// import firestore from '@react-native-firebase/firestore';
import RtcEngine, {
  ChannelProfile,
  ClientRole,
  RtcLocalView,
  RtcRemoteView,
  VideoRemoteState,
} from 'react-native-agora';
// import { useSelector } from 'react-redux';
// import Loader from '../../components/Loader';
// import ModelLoader from '../../components/ModelLoader';
// import { showmsg } from '../../components/ShowMsg';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const {width, height} = Dimensions.get('screen');

async function requestCameraAndAudioPermission() {
  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);
    if (
      granted['android.permission.RECORD_AUDIO'] ===
        PermissionsAndroid.RESULTS.GRANTED &&
      granted['android.permission.CAMERA'] ===
        PermissionsAndroid.RESULTS.GRANTED
    ) {
      console.log('You can use the cameras & mic');
    } else {
      console.log('Permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

export default function Index(props) {
  const isBroadcaster = props.route.params.type === 'create';
  console.log('BroadCaster', isBroadcaster);

  const onShare = async () => {
    try {
      const result = await Share.share({message: props.route.params.channel});
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const navigation = useNavigation();
  const [joined, setJoined] = useState(false);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState('');
  const scrollRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // const userInfo = useSelector(state => {
  //     return state.user.userInfo
  // })

  const [broadcasterVideoState, setBroadcasterVideoState] = useState(
    VideoRemoteState.Decoding,
  );
  const videoStateMessage = state => {
    switch (state) {
      case VideoRemoteState.Stopped:
        navigation.navigate('TabStack');
        return 'Video turned off by Host';

      case VideoRemoteState.Frozen:
        return 'Connection Issue, Please Wait';

      case VideoRemoteState.Failed:
        return 'Network Error';
    }
  };
  const AgoraEngine = useRef();
  const init = async () => {
    AgoraEngine.current = await RtcEngine.create(
      '01d2f38373ee43d58809f3c23096aa43',
    );
    AgoraEngine.current.enableVideo();
    AgoraEngine.current.setChannelProfile(ChannelProfile.LiveBroadcasting);
    if (isBroadcaster)
      AgoraEngine.current.setClientRole(ClientRole.Broadcaster);

    AgoraEngine.current.addListener('RemoteVideoStateChanged', (uid, state) => {
      if (uid === 1) setBroadcasterVideoState(state);
    });

    AgoraEngine.current.addListener(
      'JoinChannelSuccess',
      (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        setJoined(true);
      },
    );
  };

  const onSwitchCamera = () => AgoraEngine.current.switchCamera();

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('Back button pressed');
      if (isBroadcaster) {
        // setShowModal(true)
      } else {
        navigation.goBack();
      }

      return true;
    });
    if (Platform.OS === 'android') requestCameraAndAudioPermission();
    const uid = isBroadcaster ? 1 : 0;
    init().then(() =>
      AgoraEngine.current.joinChannel(
        null,
        props.route.params.channel,
        null,
        uid,
      ),
    );
    return () => {
      AgoraEngine.current.destroy();
    };
  }, []);
  // 00601d2f38373ee43d58809f3c23096aa43IACLfnNNI0J5v/km6bb3wZj2Bnep/PHqpgkYClA7LYIVVaPi7psAAAAAEADIL2danEvfYQEAAQCaS99h
  const renderHost = () =>
    broadcasterVideoState === VideoRemoteState.Decoding ? (
      <RtcRemoteView.SurfaceView
        uid={1}
        style={styles.fullscreen}
        channelId={props.route.params.channel}
      />
    ) : (
      <View style={styles.broadcasterVideoStateMessage}>
        <Text style={styles.broadcasterVideoStateMessageText}>
          {videoStateMessage(broadcasterVideoState)}
        </Text>
      </View>
    );

  const renderLocal = () => (
    <RtcLocalView.SurfaceView
      style={styles.fullscreen}
      channelId={props.route.params.channel}
    />
  );
  useEffect(() => {
    if (isBroadcaster) {
      // firestore().collection('livestream').doc(userInfo._id)
      //     .set({
      //         channel: props.route.params.channel,
      //         user: userInfo._id,
      //         name: userInfo.username,
      //         photo: userInfo.photo,
      //     })
      //     .then(() => {
      //         console.log('live stream success')
      //     })
      //     .catch(err => {
      //     })
    }
  }, []);

  useEffect(async () => {
    // firestore().collection('liveStreamChats').doc(props.route.params.liveId)
    //     .collection('messages').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
    //         if (!snapshot.empty) {
    //             setChat(snapshot.docs.map(doc => { return { ...doc.data(), id: doc.id } }))
    //         } else {
    //         }
    //     },
    //         error => {
    //             showmsg('Error while fetching messages')
    //             console.log(error);
    //         }
    //     )
  }, []);
  const sendMsg = () => {
    // firestore().collection('liveStreamChats').doc(props.route.params.liveId).collection('messages').add({
    //     message: message,
    //     displayName: userInfo.username,
    //     email: userInfo.email,
    //     uid: userInfo._id,
    //     photo: userInfo.photo,
    //     timestamp: firestore.FieldValue.serverTimestamp(),
    // })
    //     .then(res => {
    //         setMessage('')
    //     })
    //     .catch(err => {
    //         console.log(err)
    //         showmsg(JSON.stringify(err))
    //     })
  };
  return (
    <View style={styles.container}>
      {!joined ? (
        <>
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <ActivityIndicator
              size={60}
              color="#fff"
              style={styles.activityIndicator}
            />
            <Text style={{...styles.loadingText, color: '#fff'}}>
              Joining Stream, Please Wait
            </Text>
          </View>
        </>
      ) : (
        <>
          {isBroadcaster ? renderLocal() : renderHost()}
          {isBroadcaster ? (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{paddingVertical: 20}}
                onPress={onSwitchCamera}>
                <Ionicons
                  name="camera-reverse-outline"
                  size={30}
                  color="#fff"
                />
              </TouchableOpacity>
              <TouchableOpacity style={{}} onPress={onShare}>
                <AntDesign name="sharealt" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={{paddingVertical: 20}} onPress={onShare}>
                <AntDesign name="sharealt" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {!chat.length ? (
        <View style={{paddingVertical: height * 0.13}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
            }}>
            Send First Message
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.chattingWrapper}
          ref={scrollRef}
          onContentSizeChange={() =>
            scrollRef.current.scrollToEnd({animated: true})
          }>
          {chat.length
            ? chat.map((item, index) => (
                <View
                  key={index}
                  style={
                    item.email === userInfo.email
                      ? styles.mineChat
                      : styles.othersChat
                    // :styles.mineChat
                  }>
                  <Text style={styles.username}>{item.displayName}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.text}>{item.message}</Text>
                    {/* <Text style={styles.time}>
                                    <Text>
                                    {new Date(item?.timestamp?.toDate())?.toUTCString().split(',')[1].split(' ')[1]}
                                    </Text>
                                    <Text>{` `}</Text>
                                    <Text>
                                    {new Date(item?.timestamp?.toDate())?.toUTCString().split(',')[1].split(' ')[2]}
                                    </Text>
                                    <Text>{` `}</Text>
                                    <Text>
                                    {new Date(item?.timestamp?.toDate())?.toUTCString().split(',')[1].split(' ')[3]}
                                    </Text>
                                </Text> */}
                  </View>
                </View>
              ))
            : null}
        </ScrollView>
      )}
      <View
        style={{
          marginHorizontal: 20,
          alignSelf: 'center',
          justifyContent: 'space-around',
          flexDirection: 'row',
          paddingBottom: 10,
        }}>
        <TextInput
          placeholder="Type here.."
          placeholderTextColor="#fff"
          value={message}
          onChangeText={text => setMessage(text)}
          style={{
            width: '80%',
            borderWidth: 0.5,
            padding: 10,
            borderRadius: 10,
            borderColor: 'rgba(255, 0, 46,0.7)',
            marginRight: 10,
            color: '#fff',
          }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: 'rgba(255, 0, 46,0.7)',
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
      {showModal ? (
        <Modal transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Are you want to end live stream?
              </Text>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={async () => {
                  // setLoading(true)
                  try {
                    console.log(props.route.params.liveId);
                    // const promise = chat.map(async (item) => {
                    //     const resp = await firestore().collection('liveStreamChats').doc(props.route.params.liveId).collection('messages').doc(item.id).delete()
                    //     console.log("delete", resp)
                    //     return resp
                    // })
                    // const resp = await Promise.all(promise)
                    // console.log("Chat deleted", resp)
                    // const del = await firestore().collection('livestream').doc(props.route.params.liveId).delete()
                    // console.log('live stream deleted', del)
                    // setLoading(false)
                    // setShowModal(false)
                    // navigation.goBack()
                  } catch (error) {
                    showmsg('unable to end live stream');
                  }
                }}>
                <Text style={styles.textStyle}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => {
                  setShowModal(false);
                }}>
                <Text style={styles.textStyle}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      ) : null}
      {loading ? <ModelLoader /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#222',
  },
  fullscreen: {
    width: width,
    height: height - 380,
  },
  buttonContainer: {
    // flexDirection: 'row',
    position: 'absolute',
    // bottom: 0,
    top: 0,
    right: 20,
  },
  button: {
    width: 150,
    backgroundColor: '#fff',
    marginBottom: 50,
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonText: {
    fontSize: 17,
  },
  broadcasterVideoStateMessage: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  broadcasterVideoStateMessageText: {
    color: '#fff',
    fontSize: 20,
  },
  chattingWrapper: {
    height: height * 0.6,
    width,
    paddingLeft: 20,
    paddingRight: 20,
    maxHeight: height * 0.6,
  },
  othersChat: {
    alignSelf: 'flex-start',
    padding: 10,
    backgroundColor: 'rgba(255, 0, 46,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  mineChat: {
    alignSelf: 'flex-end',
    padding: 10,
    backgroundColor: 'rgba(255, 0, 46,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
  username: {
    fontSize: 14,
    color: 'black',
    alignSelf: 'flex-start',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    alignSelf: 'flex-start',
    color: '#fff',
  },
  modalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    // margin: 20,
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 35,
  },

  modalText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#f2f2f2',
  },
  textStyle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: 'rgba(255, 0, 46,0.7)',
    marginTop: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
});
