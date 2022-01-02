import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    ToastAndroid, 
    AlertIOS,
} from 'react-native';
const setting_drawer =({navigation})=>{
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Setting Drawer!!</Text>
        </View>
      );

}
export default setting_drawer;