import React from 'react';
import { useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,   
    Image 
} from 'react-native';
const uploadfile =()=>{
  const [data,setData]=useState({
    arrow_file:true
  })
  const displayfile=()=>{
    setData({
      ...data,
      arrow_file:!data.arrow_file
    })

  }
    return (
        <View style={styles.container}> 
          <TouchableOpacity onPress={()=>displayfile()}>
              <View style={styles.button}> 
                <MaterialIcons
                    name={data.arrow_file ? "keyboard-arrow-right" : "keyboard-arrow-down"}
                    color="#000000"
                    size={35}
                />
                <Text style={styles.textSign}>Files</Text>
            </View>
          </TouchableOpacity>
          {data.arrow_file?null:
            <Animatable.View
              animation="slideInLeft" >
              <Image 
                source={require('../assets/one.png')}
                style={styles.displaystyle}
                resizeMode="stretch"
              />
              <Image 
                  source={require('../assets/two.png')}
                  style={styles.displaystyle}
                  resizeMode="stretch"
              />
              <Image 
                  source={require('../assets/three.png')}
                  style={styles.displaystyle}
                  resizeMode="stretch"
              />
            </Animatable.View>
          }
          

        </View>
      );

}
export default uploadfile;
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#ffffff'
  },
  displaystyle: {
    
    width: '100%',
    height: 100,
    borderRadius: 100 / 2,
    alignSelf:'stretch',
  },
  textassign:{
    fontSize: 20,
    paddingLeft:50,
    paddingTop:10,
    borderBottomWidth:1,
    borderRadius:50,
    borderColor:"#ECECEC", 
  },
  button: {
      alignItems: 'flex-start',
      marginTop: 50,
      flexDirection:'row',
      paddingLeft:10
  },
  textSign: {
      fontSize: 25,
      fontWeight: 'bold',
      
  }
});